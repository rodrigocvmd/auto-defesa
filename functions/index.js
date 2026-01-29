const { onRequest } = require("firebase-functions/v2/https");
require("dotenv").config();
const logger = require("firebase-functions/logger");

const infractionController = require("./src/controllers/infractionController");
const defenseController = require("./src/controllers/defenseController");
const paymentController = require("./src/controllers/paymentController");
const pdfController = require("./src/controllers/pdfController");

// --- FUNÇÃO 1: CONSULTA ---
exports.getInfraction = onRequest(infractionController.getInfraction);

// --- FUNÇÃO 2: MANUAL / REFINAMENTO ---
exports.generateDefense = onRequest(defenseController.generateDefense);

// --- FUNÇÃO 3: CHECKOUT STRIPE ---
exports.createCheckoutSession = onRequest(paymentController.createCheckoutSession);

// --- FUNÇÃO 4: OCR ---
exports.extractDataFromImage = onRequest(defenseController.extractDataFromImage);

// --- FUNÇÃO 5: PRÉ-ANÁLISE ---
exports.preAnalyze = onRequest(defenseController.preAnalyze);

// --- FUNÇÃO 6: ANÁLISE COMPLETA (UPLOAD) ---
exports.analyzeDocument = onRequest(defenseController.analyzeDocument);

// --- FUNÇÃO 7: GERAR PDF ---
exports.generatePdf = onRequest({ memory: "1GiB" }, pdfController.generatePdf); // Mais memória para Chrome Headless

// --- WEBHOOK STRIPE ---
exports.stripeWebhook = onRequest(paymentController.stripeWebhook);