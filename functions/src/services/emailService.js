const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

/**
 * Envia um email de confirmação de compra de créditos.
 * @param {string} toEmail - Email do destinatário.
 * @param {number} creditsAmount - Quantidade de créditos comprados.
 * @param {string} planName - Nome do plano adquirido.
 */
async function sendPurchaseConfirmation(toEmail, creditsAmount, planName) {
	if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
		console.warn("⚠️ Credenciais de email não configuradas. Pulando envio de confirmação.");
		return;
	}

	const mailOptions = {
		from: `"AutoDefesa" <${process.env.EMAIL_USER}>`,
		to: toEmail,
		subject: "Confirmação de Compra - AutoDefesa",
		text: `Olá! Recebemos a confirmação do seu pagamento. Foram adicionados ${creditsAmount} crédito(s) (${planName}) à sua conta. Agora você já pode gerar seus recursos de multa!`,
		html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 12px;">
                <h2 style="color: #2563eb; text-align: center;">Pagamento Confirmado!</h2>
                <p>Olá,</p>
                <p>Recebemos a confirmação do seu pagamento referente ao plano <strong>${planName}</strong>.</p>
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 1.25rem; font-weight: bold; color: #166534;">
                        +${creditsAmount} ${creditsAmount === 1 ? "crédito adicionado" : "créditos adicionados"}
                    </span>
                </div>
                <p>Seus créditos já estão disponíveis e você pode começar a gerar seus recursos de multa agora mesmo acessando o painel.</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://autodefesa.net.br/upload" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Gerar Recurso Agora
                    </a>
                </div>
                <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e5e7eb;" />
                <p style="font-size: 0.875rem; color: #6b7280; text-align: center;">
                    Equipe AutoDefesa <br>
                    Precisa de ajuda? Responda a este email ou acesse nossa página de ajuda.
                </p>
            </div>
        `,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log(`📧 Email de confirmação enviado para: ${toEmail}`);
	} catch (error) {
		console.error("❌ Erro ao enviar email de confirmação:", error);
	}
}

module.exports = { sendPurchaseConfirmation };
