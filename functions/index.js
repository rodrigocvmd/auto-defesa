const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
require("dotenv").config();
const logger = require("firebase-functions/logger");

const infractionController = require("./src/controllers/infractionController");
const defenseController = require("./src/controllers/defenseController");
const paymentController = require("./src/controllers/paymentController");
const userService = require("./src/services/userService");
const userController = require("./src/controllers/userController");
const supportController = require("./src/controllers/supportController");
const mercadopagoController = require("./src/controllers/mercadopagoController");

// --- FUNÇÃO 1: CONSULTA ---
exports.getInfraction = onRequest(infractionController.getInfraction);

// --- FUNÇÃO PARA VERIFICAR EMAIL ---
// CORS configurado manualmente no controller para garantir acesso
exports.checkEmail = onRequest({ cors: true }, userController.checkEmail);
exports.getGuestCredits = onRequest({ cors: true }, userController.getGuestCredits);

// --- FUNÇÃO DE SUPORTE ---
exports.sendSupportEmail = onRequest({ cors: true }, supportController.sendSupportEmail);

// --- FUNÇÃO 2: MANUAL / REFINAMENTO ---
exports.generateDefense = onRequest({ timeoutSeconds: 120, cors: true }, defenseController.generateDefense);

// --- FUNÇÃO 3: CHECKOUT STRIPE ---
exports.createCheckoutSession = onRequest({ cors: true }, paymentController.createCheckoutSession);

// --- FUNÇÃO 4: OCR ---
exports.extractDataFromImage = onRequest({ cors: true }, defenseController.extractDataFromImage);

// --- FUNÇÃO 5: PRÉ-ANÁLISE ---
exports.preAnalyze = onRequest({ cors: true }, defenseController.preAnalyze);

// --- FUNÇÃO 6: ANÁLISE COMPLETA (UPLOAD) ---
exports.analyzeDocument = onRequest({ timeoutSeconds: 120, cors: true }, defenseController.analyzeDocument);

// --- FUNÇÃO 7: ENVIAR PDF POR EMAIL ---
exports.sendDefensePdfEmail = onRequest(
	{ timeoutSeconds: 60, cors: true },
	defenseController.sendDefensePdfEmail,
);

exports.confirmDefense = onRequest({ cors: true }, defenseController.confirmDefense);

// --- WEBHOOK STRIPE ---
exports.stripeWebhook = onRequest(paymentController.stripeWebhook);

// --- MERCADO PAGO ---
exports.createPreference = onRequest({ cors: true }, mercadopagoController.createPreference);
exports.createPixPayment = onRequest({ cors: true }, mercadopagoController.createPixPayment);
exports.checkPixPaymentStatus = onRequest({ cors: true }, mercadopagoController.checkPixPaymentStatus);
exports.mercadopagoWebhook = onRequest({ cors: true }, mercadopagoController.mercadopagoWebhook);

// --- CRON JOB: LIMPEZA DE USUÁRIOS ---
/* 
A rotina de limpeza de usuários não verificados foi temporariamente inativada, 
pois a verificação de e-mail não é mais obrigatória para gerar recursos, 
e manter esses dados é útil para análise de funil e conversão.

exports.cleanupUnverifiedUsers = onSchedule("every 24 hours", async (event) => {
    logger.info("Starting cleanup of unverified users...");
    try {
        const deletedCount = await userService.deleteUnverifiedUsers();
        logger.info(`Cleanup finished. Deleted ${deletedCount} unverified users.`);
    } catch (error) {
        logger.error("Error cleaning up users:", error);
    }
});
*/
