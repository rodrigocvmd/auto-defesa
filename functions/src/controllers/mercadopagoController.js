const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const { db } = require("../services/firebase");
const { verifyAuth } = require("../middleware/auth");
const { sendPurchaseConfirmation } = require("../services/emailService");
const cors = require("../middleware/cors");

// Inicialização lazy do client
const getMPClient = () => {
	return new MercadoPagoConfig({
		accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
	});
};

const PRICE_MAP = {
	price_1SxBbqRTHGPeccd9D66pZoXs: { credits: 1, name: "Recurso Expresso", amount: 17.9 },
	price_1SuFi7RTHGPeccd987NViaZP: { credits: 3, name: "Proteção Completa", amount: 27.9 },
	price_1SuFiORTHGPeccd9HKTxjPO7: { credits: 10, name: "Pacote Profissional", amount: 47.9 },
	price_1TL2dLRTHGPeccd9tAHX77rE: { credits: 1, name: "Recurso Expresso (50%)", amount: 8.95 },
	price_1TL2dqRTHGPeccd9IvRUpANK: { credits: 3, name: "Proteção Completa (50%)", amount: 13.95 },
	price_1TL2eARTHGPeccd9ub7jSux7: { credits: 10, name: "Pacote Profissional (50%)", amount: 23.95 },
	price_H5ggYwtDq4fbrJ: { credits: 1, name: "Plano Teste", amount: 1.0 },
};

exports.createPreference = (req, res) => {
	cors(req, res, async () => {
		try {
			const { priceId, guestEmail, successUrl, cancelUrl } = req.body;
			let userId = null;
			const authHeader = req.headers.authorization;

			if (authHeader && authHeader.startsWith("Bearer ")) {
				try {
					userId = await verifyAuth(req);
				} catch (e) {
					console.log("Token inválido no checkout, prosseguindo como convidado.");
				}
			}

			const planInfo = PRICE_MAP[priceId || "price_H5ggYwtDq4fbrJ"];
			if (!planInfo) {
				return res.status(400).json({ error: "Produto inválido." });
			}

			const client = getMPClient();
			const preference = new Preference(client);

			// Garantir URLs válidas para o back_urls
			const fallbackSuccess = "https://meuautodefesa.com.br/credit-success";
			const fallbackCancel = "https://meuautodefesa.com.br/pricing";

			const finalSuccessUrl =
				successUrl && successUrl.includes("http") ? successUrl.split("?")[0] : fallbackSuccess;
			const finalCancelUrl =
				cancelUrl && cancelUrl.includes("http") ? cancelUrl.split("?")[0] : fallbackCancel;

			const externalReference = JSON.stringify({
				userId: userId || "",
				guestEmail: guestEmail || "",
				credits: planInfo.credits,
				planName: planInfo.name,
			});

			const preferenceData = {
				body: {
					items: [
						{
							id: priceId || "price_H5ggYwtDq4fbrJ",
							title: planInfo.name,
							unit_price: Number(planInfo.amount),
							quantity: 1,
							currency_id: "BRL",
						},
					],
					payer: {
						email:
							guestEmail || (userId ? "usuario@autodefesa.com.br" : "cliente@autodefesa.com.br"),
					},
					back_urls: {
						success: finalSuccessUrl,
						failure: finalCancelUrl,
						pending: finalCancelUrl,
					},
					// Removido auto_return completamente
					notification_url: "https://us-central1-auto-defesa.cloudfunctions.net/mercadopagoWebhook",
					external_reference: externalReference,
					metadata: {
						userId: userId || "",
						guestEmail: guestEmail || "",
						credits: planInfo.credits,
						planName: planInfo.name,
					},
				},
			};

			const result = await preference.create(preferenceData);

			res.status(200).json({
				id: result.id,
				init_point: result.init_point,
				sandbox_init_point: result.sandbox_init_point,
			});
		} catch (error) {
			console.error("Erro detalhado Mercado Pago:", error);
			res.status(500).json({ error: error.message || "Erro interno ao gerar preferência" });
		}
	});
};

exports.createPixPayment = (req, res) => {
	cors(req, res, async () => {
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
					payer: { email: guestEmail || "cliente@autodefesa.com.br" },
				},
			});

			await db
				.collection("pix_payments")
				.doc(result.id.toString())
				.set({
					userId: userId || null,
					guestEmail: guestEmail || null,
					credits: planInfo.credits,
					planName: planInfo.name,
					status: "pending",
					createdAt: new Date().toISOString(),
				});

			res.status(200).json({
				paymentId: result.id,
				qrCode: result.point_of_interaction.transaction_data.qr_code,
				qrCodeBase64: result.point_of_interaction.transaction_data.qr_code_base64,
			});
		} catch (error) {
			console.error("Erro Mercado Pago:", error);
			res.status(500).json({ error: error.message || "Erro interno ao processar pagamento PIX" });
		}
	});
};

exports.mercadopagoWebhook = async (req, res) => {
	const paymentId = req.body?.data?.id || req.query?.["data.id"];
	const type = req.body?.type || req.query?.type;

	if (type && type !== "payment") {
		return res.status(200).send("OK");
	}

	if (!paymentId) {
		return res.status(200).send("Ignorado: Sem ID.");
	}

	try {
		const client = getMPClient();
		const paymentObj = new Payment(client);
		const paymentData = await paymentObj.get({ id: paymentId });

		if (paymentData.status === "approved") {
			const metadata = paymentData.metadata || {};
			let credits = parseInt(metadata.credits || 0, 10);
			let planName = metadata.plan_name || metadata.planName || "Plano Adquirido";
			let userId = metadata.user_id || metadata.userId;
			let guestEmail = metadata.guest_email || metadata.guestEmail;

			if (!userId && !guestEmail && paymentData.external_reference) {
				try {
					const extRef = JSON.parse(paymentData.external_reference);
					userId = extRef.userId;
					guestEmail = extRef.guestEmail;
					credits = extRef.credits;
					planName = extRef.planName;
				} catch (e) {
					console.log("Falha ao parsear external_reference");
				}
			}

			if (!userId && !guestEmail) {
				return res.status(200).send("OK: Não identificado.");
			}

			const mpPaymentRef = db.collection("mp_payments").doc(paymentId.toString());
			let emailToSend = null;

			await db.runTransaction(async (t) => {
				const doc = await t.get(mpPaymentRef);
				if (doc.exists && doc.data().status === "paid") return;

				t.set(
					mpPaymentRef,
					{
						status: "paid",
						paidAt: new Date().toISOString(),
						userId: userId || null,
						guestEmail: guestEmail || null,
						credits,
						planName,
						paymentId: paymentId.toString(),
					},
					{ merge: true },
				);

				if (userId) {
					const userRef = db.collection("users").doc(userId);
					const userDoc = await t.get(userRef);
					if (userDoc.exists) {
						const currentCredits = userDoc.data().credits || 0;
						t.set(userRef, { credits: currentCredits + credits }, { merge: true });
						emailToSend = userDoc.data().email;
					}
				} else if (guestEmail) {
					const guestRef = db.collection("guest_credits").doc(guestEmail);
					const guestDoc = await t.get(guestRef);
					const currentCredits = guestDoc.exists ? guestDoc.data().credits || 0 : 0;
					t.set(
						guestRef,
						{
							credits: currentCredits + credits,
							updatedAt: new Date().toISOString(),
						},
						{ merge: true },
					);
					emailToSend = guestEmail;
				}
			});

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
