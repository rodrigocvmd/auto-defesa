const cors = require("../middleware/cors");
const { verifyAuth } = require("../middleware/auth");
const { db } = require("../services/firebase");
const { sendPurchaseConfirmation } = require("../services/emailService");

// NOTE: Ensure STRIPE_SECRET_KEY is set in your environment variables
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = (req, res) => {
	cors(req, res, async () => {
		const { priceId, successUrl, cancelUrl, mode, guestEmail } = req.body;

		let userId = null;
		const authHeader = req.headers.authorization;

		// Só tenta verificar se houver um header de autorização
		if (authHeader && authHeader.startsWith("Bearer ")) {
			try {
				userId = await verifyAuth(req);
			} catch (e) {
				console.log("Token de autenticação inválido, prosseguindo como convidado se houver email.");
			}
		}

		if (!userId && !guestEmail) {
			res.status(401).json({ error: "Usuário não autenticado e email de convidado não fornecido." });
			return;
		}

		const PRICE_CREDITS_MAP = {
			price_1SxBbqRTHGPeccd9D66pZoXs: { credits: 1, name: "Recurso Expresso" },
			price_1SuFi7RTHGPeccd987NViaZP: { credits: 3, name: "Proteção Completa" },
			price_1SuFiORTHGPeccd9HKTxjPO7: { credits: 10, name: "Pacote Profissional" },
			// Discount prices
			price_1TL2dLRTHGPeccd9tAHX77rE: { credits: 1, name: "Recurso Expresso (50% de desconto)" },
			price_1TL2dqRTHGPeccd9IvRUpANK: { credits: 3, name: "Proteção Completa (50% de desconto)" },
			price_1TL2eARTHGPeccd9ub7jSux7: {
				credits: 10,
				name: "Pacote Profissional (50% de desconto)",
			},
			// Fallback default for testing if needed
			price_H5ggYwtDq4fbrJ: { credits: 1, name: "Plano Teste" },
		};

		const selectedPriceId = priceId || "price_H5ggYwtDq4fbrJ";
		const planInfo = PRICE_CREDITS_MAP[selectedPriceId];

		if (!planInfo) {
			console.error(`❌ Tentativa de compra com preço inválido: ${selectedPriceId}`);
			res.status(400).json({ error: "Produto inválido." });
			return;
		}

		try {
			const session = await stripe.checkout.sessions.create({
				payment_method_types: ["card", "boleto"],
				locale: "pt-BR",
				line_items: [
					{
						price: selectedPriceId,
						quantity: 1,
					},
				],
				mode: mode || "payment",
				success_url: successUrl || "http://localhost:5173/credit-success?success=true",
				cancel_url: cancelUrl || "http://localhost:5173/pricing?canceled=true",
				client_reference_id: userId || guestEmail,
				customer_email: userId ? undefined : guestEmail,
				metadata: {
					userId: userId || "",
					guestEmail: guestEmail || "",
					credits: planInfo.credits,
					planName: planInfo.name,
				},
			});

			res.status(200).json({ sessionId: session.id, url: session.url });
		} catch (error) {
			console.error("Erro Stripe:", error);
			res.status(500).json({ error: error.message });
		}
	});
};

exports.stripeWebhook = async (req, res) => {
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

	if (!endpointSecret) {
		console.error("❌ ERRO CRÍTICO: STRIPE_WEBHOOK_SECRET não está definido.");
		res.status(500).send("Configuration Error: Webhook Secret missing.");
		return;
	}

	let event;
	const sig = req.headers["stripe-signature"];

	if (!req.rawBody) {
		console.error("❌ ERRO CRÍTICO: req.rawBody está undefined.");
		res.status(400).send("Webhook Error: req.rawBody is missing.");
		return;
	}

	try {
		event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
	} catch (err) {
		console.error(`❌ Webhook Signature Error: ${err.message}`);
		res.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object;
		const userId = session.metadata.userId;
		const guestEmail = session.metadata.guestEmail;
		const creditsToAdd = parseInt(session.metadata.credits || "1", 10);
		const planName = session.metadata.planName || "Plano Adquirido";

		if (userId) {
			try {
				const userRef = db.collection("users").doc(userId);
				let userEmail = null;

				await db.runTransaction(async (t) => {
					const doc = await t.get(userRef);
					if (doc.exists) {
						const userData = doc.data();
						userEmail = userData.email;
						const currentCredits = userData.credits || 0;
						const newCredits = currentCredits + creditsToAdd;
						t.set(userRef, { credits: newCredits }, { merge: true });
					} else {
						// Caso o documento não exista (improvável se ele logou)
						t.set(userRef, { credits: creditsToAdd }, { merge: true });
					}
				});

				console.log(`🎉 Créditos adicionados para ${userId}: +${creditsToAdd}`);

				// Enviar email de confirmação se tivermos o email do usuário
				if (userEmail) {
					await sendPurchaseConfirmation(userEmail, creditsToAdd, planName);
				} else {
					console.warn(
						`⚠️ Email não encontrado para o usuário ${userId}. Não foi possível enviar confirmação.`,
					);
				}
			} catch (error) {
				console.error("❌ ERRO ao atualizar créditos no Firestore:", error);
				return res.status(500).send("Erro interno ao atualizar créditos");
			}
		} else if (guestEmail) {
			try {
				const normalizedEmail = guestEmail.trim().toLowerCase();
				const guestRef = db.collection("guest_credits").doc(normalizedEmail);

				await db.runTransaction(async (t) => {
					const doc = await t.get(guestRef);
					if (doc.exists) {
						const guestData = doc.data();
						const currentCredits = guestData.credits || 0;
						const newCredits = currentCredits + creditsToAdd;
						t.set(
							guestRef,
							{ credits: newCredits, email: normalizedEmail, updatedAt: new Date().toISOString() },
							{ merge: true },
						);
					} else {
						t.set(
							guestRef,
							{
								credits: creditsToAdd,
								email: normalizedEmail,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							},
							{ merge: true },
						);
					}
				});

				console.log(`🎉 Créditos de convidado adicionados para ${normalizedEmail}: +${creditsToAdd}`);

				// Enviar email de confirmação para o convidado
				await sendPurchaseConfirmation(normalizedEmail, creditsToAdd, planName);
			} catch (error) {
				console.error("❌ ERRO ao atualizar créditos de convidado no Firestore:", error);
				return res.status(500).send("Erro interno ao atualizar créditos de convidado");
			}
		} else {
			console.error("❌ ERRO: Nem UserId nem guestEmail encontrados nos metadados.");
		}
	}

	res.send();
};
