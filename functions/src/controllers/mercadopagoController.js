const { MercadoPagoConfig, Payment } = require('mercadopago');
const { db } = require('../services/firebase');
const cors = require('../middleware/cors');

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

exports.createPixPayment = async (req, res) => {
  // To be implemented
};

exports.mercadopagoWebhook = async (req, res) => {
  // To be implemented
};
