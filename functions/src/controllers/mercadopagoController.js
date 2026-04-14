const { MercadoPagoConfig, Payment } = require('mercadopago');
const { db } = require('../services/firebase');
const cors = require('../middleware/cors');
const { verifyAuth } = require('../middleware/auth');
const { sendPurchaseConfirmation } = require('../services/emailService');

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

exports.createPixPayment = (req, res) => {
    cors(req, res, async () => {
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

        const PRICE_MAP = {
            price_1SxBbqRTHGPeccd9D66pZoXs: { credits: 1, name: "Recurso Expresso", amount: 49.90 },
            price_1SuFi7RTHGPeccd987NViaZP: { credits: 3, name: "Proteção Completa", amount: 129.90 },
            price_1SuFiORTHGPeccd9HKTxjPO7: { credits: 10, name: "Pacote Profissional", amount: 349.90 },
            price_1TL2dLRTHGPeccd9tAHX77rE: { credits: 1, name: "Recurso Expresso (50%)", amount: 24.95 },
            price_1TL2dqRTHGPeccd9IvRUpANK: { credits: 3, name: "Proteção Completa (50%)", amount: 64.95 },
            price_1TL2eARTHGPeccd9ub7jSux7: { credits: 10, name: "Pacote Profissional (50%)", amount: 174.95 },
            price_H5ggYwtDq4fbrJ: { credits: 1, name: "Plano Teste", amount: 1.00 }
        };

        const planInfo = PRICE_MAP[priceId || "price_H5ggYwtDq4fbrJ"];
        if (!planInfo) {
            return res.status(400).json({ error: "Produto inválido." });
        }

        try {
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
            res.status(500).json({ error: error.message });
        }
    });
};

exports.mercadopagoWebhook = async (req, res) => {
    // O Mercado Pago envia o ID do pagamento de diferentes formas dependendo da configuração
    const paymentId = req.body?.data?.id || req.query?.["data.id"];

    if (!paymentId) {
        return res.status(200).send("Ignorado: Sem ID de pagamento.");
    }

    try {
        const paymentObj = new Payment(client);
        const paymentData = await paymentObj.get({ id: paymentId });

        if (paymentData.status === "approved") {
            const pixRef = db.collection("pix_payments").doc(paymentId.toString());
            let emailToSend = null;
            let credits = 0;
            let planName = "";

            await db.runTransaction(async (t) => {
                const doc = await t.get(pixRef);
                if (!doc.exists) return; // Não é um PIX gerado por nós

                const data = doc.data();
                if (data.status === "paid") return; // Já processado anteriormente

                credits = data.credits;
                planName = data.planName;

                // Atualiza o documento do PIX para pago
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
            });

            // Envia o email de confirmação após a transação ser concluída
            if (emailToSend) {
                await sendPurchaseConfirmation(emailToSend, credits, planName);
            }
        }
        res.status(200).send("OK");
    } catch (error) {
        console.error("Erro no Webhook Mercado Pago:", error);
        res.status(500).send("Erro interno");
    }
};
