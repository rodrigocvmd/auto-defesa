const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
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

exports.createPreference = async (req, res) => {
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
                        title: planInfo.name,
                        unit_price: planInfo.amount,
                        quantity: 1,
                        currency_id: "BRL",
                    }
                ],
                payer: {
                    email: guestEmail || (userId ? "usuario@autodefesa.com.br" : "cliente@autodefesa.com.br"),
                },
                back_urls: {
                    success: successUrl || "http://localhost:5173/credit-success?success=true",
                    failure: cancelUrl || "http://localhost:5173/pricing?canceled=true",
                    pending: cancelUrl || "http://localhost:5173/pricing?canceled=true",
                },
                auto_return: "approved",
                notification_url: "https://sua-url-ngrok.ngrok-free.app/mercadopagoWebhook", // Substitua pela sua URL do ngrok
                metadata: {
                    userId: userId || "",
                    guestEmail: guestEmail || "",
                    credits: planInfo.credits,
                    planName: planInfo.name,
                }
            }
        });

        res.status(200).json({
            id: result.id,
            init_point: result.init_point
        });
    } catch (error) {
        console.error("Erro ao criar preferência Mercado Pago:", error);
        res.status(500).json({ error: error.message || "Erro interno" });
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
            // Busca dados nos metadados (Checkout Pro / Preferência)
            // Nota: O MP converte camelCase para snake_case no metadata às vezes, ou mantém. 
            // Vamos verificar ambos por segurança.
            const metadata = paymentData.metadata || {};
            const credits = parseInt(metadata.credits || 0, 10);
            const planName = metadata.plan_name || metadata.planName || "Plano Adquirido";
            const userId = metadata.user_id || metadata.userId;
            const guestEmail = metadata.guest_email || metadata.guestEmail;

            if (!userId && !guestEmail) {
                console.log("Pagamento sem metadados de identificação. Verificando coleção pix_payments...");
                // Fallback para PIX direto se ainda houver
                const pixRef = db.collection("pix_payments").doc(paymentId.toString());
                const pixDoc = await pixRef.get();
                if (!pixDoc.exists) return res.status(200).send("OK: Pagamento não identificado.");
                
                // ... lógica de PIX (se necessário manter)
                return res.status(200).send("OK");
            }

            const mpPaymentRef = db.collection("mp_payments").doc(paymentId.toString());
            let emailToSend = null;
            let processed = false;

            await db.runTransaction(async (t) => {
                const doc = await t.get(mpPaymentRef);
                if (doc.exists && doc.data().status === "paid") return;

                t.set(mpPaymentRef, {
                    status: "paid",
                    paidAt: new Date().toISOString(),
                    userId: userId || null,
                    guestEmail: guestEmail || null,
                    credits,
                    planName
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
