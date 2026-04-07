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

// --- FUNÇÃO 1: CONSULTA ---
exports.getInfraction = onRequest(infractionController.getInfraction);

// --- FUNÇÃO PARA VERIFICAR EMAIL ---
// CORS configurado manualmente no controller para garantir acesso
exports.checkEmail = onRequest(userController.checkEmail);

// --- FUNÇÃO DE SUPORTE ---
exports.sendSupportEmail = onRequest(supportController.sendSupportEmail);

// --- FUNÇÃO 2: MANUAL / REFINAMENTO ---
exports.generateDefense = onRequest({ timeoutSeconds: 120 }, defenseController.generateDefense);

// --- FUNÇÃO 3: CHECKOUT STRIPE ---
exports.createCheckoutSession = onRequest(paymentController.createCheckoutSession);

// --- FUNÇÃO 4: OCR ---
exports.extractDataFromImage = onRequest(defenseController.extractDataFromImage);

// --- FUNÇÃO 5: PRÉ-ANÁLISE ---
exports.preAnalyze = onRequest(defenseController.preAnalyze);

// --- FUNÇÃO 6: ANÁLISE COMPLETA (UPLOAD) ---
exports.analyzeDocument = onRequest({ timeoutSeconds: 120 }, defenseController.analyzeDocument);

// --- FUNÇÃO 7: ENVIAR PDF POR EMAIL ---
exports.sendDefensePdfEmail = onRequest({ timeoutSeconds: 60 }, defenseController.sendDefensePdfEmail);

// --- WEBHOOK STRIPE ---
exports.stripeWebhook = onRequest(paymentController.stripeWebhook);

// --- CRON JOB: LIMPEZA DE USUÁRIOS ---
exports.cleanupUnverifiedUsers = onSchedule("every 24 hours", async (event) => {
    logger.info("Starting cleanup of unverified users...");
    try {
        const deletedCount = await userService.deleteUnverifiedUsers();
        logger.info(`Cleanup finished. Deleted ${deletedCount} unverified users.`);
    } catch (error) {
        logger.error("Error cleaning up users:", error);
    }
});