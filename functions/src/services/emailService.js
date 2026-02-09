const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envia um email de confirmação de compra de créditos usando Resend.
 * @param {string} toEmail - Email do destinatário.
 * @param {number} creditsAmount - Quantidade de créditos comprados.
 * @param {string} planName - Nome do plano adquirido.
 */
async function sendPurchaseConfirmation(toEmail, creditsAmount, planName) {
	if (!process.env.RESEND_API_KEY) {
		console.warn("⚠️ RESEND_API_KEY não configurada. Pulando envio de confirmação.");
		return;
	}

	try {
		const { data, error } = await resend.emails.send({
			from: "AutoDefesa <suporte@meuautodefesa.com.br>",
			to: [toEmail],
			subject: "Confirmação de Compra - AutoDefesa",
			reply_to: "suporte@meuautodefesa.com.br",
			html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
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
                    <a href="https://meuautodefesa.com.br/upload" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Gerar Recurso Agora
                    </a>
                </div>
                <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e5e7eb;" />
                <p style="font-size: 0.875rem; color: #6b7280; text-align: center;">
                    Equipe AutoDefesa <br>
                    Precisa de ajuda? Responda a este email ou acesse nossa <a href="https://meuautodefesa.com.br/help" target="_blank" style="color: #2563eb; text-decoration: underline;">página de ajuda</a>.
                </p>
            </div>
        `,
		});

		if (error) {
			console.error("❌ Erro no Resend ao enviar email de confirmação:", error);
			return;
		}

		console.log(`📧 Email de confirmação enviado via Resend para: ${toEmail}`, data.id);
	} catch (error) {
		console.error("❌ Erro ao enviar email de confirmação:", error);
	}
}

module.exports = { sendPurchaseConfirmation };