const { MercadoPagoConfig, Payment, Preference } = require('mercadopago');
const { db } = require('../services/firebase');
const { verifyAuth } = require('../middleware/auth');
const { sendPurchaseConfirmation } = require('../services/emailService');

// Inicialização lazy do client
const getMPClient = () => {
    return new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || ''
    });
};

const PRICE_MAP = {
    price_1SxBbqRTHGPeccd9D66pZoXs: { credits: 1, name: "Recurso Expresso", amount: 49.90 },
    price_1SuFi7RTHGPeccd987NViaZP: { credits: 3, name: "Proteção Completa", amount: 129.90 },
    price_1SuFiORTHGPeccd9HKTxjPO7: { credits: 10, name: "Pacote Profissional", amount: 349.90 },
    price_1TL2dLRTHGPeccd9tAHX77rE: { credits: 1, name: "Recurso Expresso (50%)", amount: 24.95 },
    price_1TL2dqRTHGPeccd9IvRUpANK: { credits: 3, name: "Proteção Completa (50%)", amount: 64.95 },
    price_1TL2eARTHGPeccd9ub7jSux7: { credits: 10, name: "Pacote Profissional (50%)", amount: 174.95 },
    price_H5ggYwtDq4fbrJ: { credits: 1, name: "Plano Teste", amount: 1.00 }
};

exports.createMercadoPagoPreference = async (req, res) => {
    try {
        const { priceId, guestEmail, successUrl, cancelUrl } = req.body;
        let userId = null;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            try {
                userId = await verifyAuth(req);
            } catch (e) {
                console.log("Token inválido, prosseguindo como convidado.");
            }
        }

        if (!userId && !guestEmail) {
            return res.status(401).json({ error: "Utilizador não autenticado e email não fornecido." });
        }

        const planInfo = PRICE_MAP[priceId || "price_H5ggYwtDq4fbrJ"];
        if (!planInfo) {
            return res.status(400).json({ error: "Produto inválido." });
        }

        const client = getMPClient();
        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: priceId || "price_H5ggYwtDq4fbrJ",
                        title: planInfo.name,
                        quantity: 1,
                        unit_price: planInfo.amount,
                        currency_id: "BRL",
                    }
                ],
                payer: {
                    email: guestEmail || "cliente@autodefesa.com.br",
                },
                back_urls: {
                    success: successUrl || "http://localhost:5173/credit-success?success=true",
                    failure: cancelUrl || "http://localhost:5173/pricing?canceled=true",
                    pending: cancelUrl || "http://localhost:5173/pricing?canceled=true",
                },
                auto_return: "approved",
                metadata: {
                    user_id: userId || "",
                    guest_email: guestEmail || "",
                    credits: planInfo.credits,
                    plan_name: planInfo.name,
                },
                // external_reference can also be used, but metadata is structured
                external_reference: userId || guestEmail || "guest",
            }
        });

        // The URL to redirect the user to complete the payment
        // Use init_point for production, sandbox_init_point for sandbox
        const redirectUrl = process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith("TEST-") 
            ? result.sandbox_init_point 
            : result.init_point;

        res.status(200).json({ url: redirectUrl, preferenceId: result.id });
    } catch (error) {
        console.error("Erro ao criar preferência Mercado Pago:", error);
        res.status(500).json({ error: error.message || "Erro interno ao processar preferência" });
    }
};

exports.createPixPayment = async (req, res) => {
    try {
        const { priceId, guestEmail } = req.body;
        let userId = null;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            try {
                userId = await verifyAuth(req);
            } catch (e) {
                console.log("Token inválido, prosseguindo como convidado.");
            }
        }

        if (!userId && !guestEmail) {
            return res.status(401).json({ error: "Utilizador não autenticado e email não fornecido." });
        }

        const planInfo = PRICE_MAP[priceId || "price_H5ggYwtDq4fbrJ"];
        if (!planInfo) {
            return res.status(400).json({ error: "Produto inválido." });
        }

        const client = getMPClient();
        const payment = new Payment(client);
        const result = await payment.create({
            body: {
                transaction_amount: planInfo.amount,
                description: planInfo.name,
                payment_method_id: "pix",
                payer: { email: guestEmail || "cliente@autodefesa.com.br" }
            }
        });

        await db.collection("pix_payments").doc(result.id.toString()).set({
            userId: userId || null,
            guestEmail: guestEmail || null,
            credits: planInfo.credits,
            planName: planInfo.name,
            status: "pending",
            createdAt: new Date().toISOString()
        });

        res.status(200).json({
            paymentId: result.id,
            qrCode: result.point_of_interaction.transaction_data.qr_code,
            qrCodeBase64: result.point_of_interaction.transaction_data.qr_code_base64
        });
    } catch (error) {
        console.error("Erro Mercado Pago:", error);
        res.status(500).json({ error: error.message || "Erro interno ao processar pagamento" });
    }
};

exports.mercadopagoWebhook = async (req, res) => {
    const paymentId = req.body?.data?.id || req.query?.["data.id"];

    if (!paymentId) {
        return res.status(200).send("Ignorado: Sem ID de pagamento.");
    }

    try {
        const client = getMPClient();
        const paymentObj = new Payment(client);
        const paymentData = await paymentObj.get({ id: paymentId });

        if (paymentData.status === "approved") {
            // Verifica se é um pagamento via PIX direto
            const pixRef = db.collection("pix_payments").doc(paymentId.toString());
            const pixDoc = await pixRef.get();

            let emailToSend = null;
            let credits = 0;
            let planName = "";
            let processed = false;

            if (pixDoc.exists) {
                // Fluxo do PIX
                await db.runTransaction(async (t) => {
                    const doc = await t.get(pixRef);
                    const data = doc.data();
                    if (data.status === "paid") return; // Já processado

                    credits = data.credits;
                    planName = data.planName;

                    t.set(pixRef, { status: "paid", paidAt: new Date().toISOString() }, { merge: true });

                    if (data.userId) {
                        const userRef = db.collection("users").doc(data.userId);
                        const userDoc = await t.get(userRef);
                        const currentCredits = userDoc.exists ? (userDoc.data().credits || 0) : 0;
                        t.set(userRef, { credits: currentCredits + credits }, { merge: true });
                        emailToSend = userDoc.exists ? userDoc.data().email : null;
                    } else if (data.guestEmail) {
                        const guestRef = db.collection("guest_credits").doc(data.guestEmail);
                        const guestDoc = await t.get(guestRef);
                        const currentCredits = guestDoc.exists ? (guestDoc.data().credits || 0) : 0;
                        t.set(guestRef, {
                            credits: currentCredits + credits,
                            updatedAt: new Date().toISOString()
                        }, { merge: true });
                        emailToSend = data.guestEmail;
                    }
                    processed = true;
                });
            } else if (paymentData.metadata && (paymentData.metadata.user_id || paymentData.metadata.guest_email)) {
                // Fluxo do Checkout Pro (Preferência)
                const metadata = paymentData.metadata;
                credits = parseInt(metadata.credits || 0, 10);
                planName = metadata.plan_name || "Plano Adquirido";
                const userId = metadata.user_id;
                const guestEmail = metadata.guest_email;

                // Usa uma coleção separada para garantir idempotência do Checkout Pro
                const mpPaymentRef = db.collection("mp_payments").doc(paymentId.toString());

                await db.runTransaction(async (t) => {
                    const doc = await t.get(mpPaymentRef);
                    if (doc.exists && doc.data().status === "paid") return; // Já processado

                    t.set(mpPaymentRef, {
                        status: "paid",
                        paidAt: new Date().toISOString(),
                        userId: userId || null,
                        guestEmail: guestEmail || null,
                        credits,
                        planName,
                        paymentMethod: paymentData.payment_method_id
                    }, { merge: true });

                    if (userId) {
                        const userRef = db.collection("users").doc(userId);
                        const userDoc = await t.get(userRef);
                        const currentCredits = userDoc.exists ? (userDoc.data().credits || 0) : 0;
                        t.set(userRef, { credits: currentCredits + credits }, { merge: true });
                        emailToSend = userDoc.exists ? userDoc.data().email : null;
                    } else if (guestEmail) {
                        const guestRef = db.collection("guest_credits").doc(guestEmail);
                        const guestDoc = await t.get(guestRef);
                        const currentCredits = guestDoc.exists ? (guestDoc.data().credits || 0) : 0;
                        t.set(guestRef, {
                            credits: currentCredits + credits,
                            updatedAt: new Date().toISOString()
                        }, { merge: true });
                        emailToSend = guestEmail;
                    }
                    processed = true;
                });
            }

            if (processed && emailToSend) {
                await sendPurchaseConfirmation(emailToSend, credits, planName);
            }
        }
        res.status(200).send("OK");
    } catch (error) {
        console.error("Erro no Webhook Mercado Pago:", error);
        res.status(500).send("Erro interno");
    }
};
