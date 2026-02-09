const cors = require("../middleware/cors");
const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendSupportEmail = (req, res) => {
    cors(req, res, async () => {
        try {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios." });
            }

            if (!process.env.RESEND_API_KEY) {
                console.error("RESEND_API_KEY não configurada.");
                return res.status(500).json({ error: "Serviço de email não configurado." });
            }

            const { data, error } = await resend.emails.send({
                from: "Suporte AutoDefesa <suporte@meuautodefesa.com.br>",
                to: ["rodrigocvmd@gmail.com"], // Seu email pessoal para receber o suporte
                reply_to: email, // Permite que você responda direto ao usuário
                subject: `Suporte AutoDefesa: Mensagem de ${name}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                        <h3 style="color: #2563eb;">Nova mensagem de suporte</h3>
                        <p><strong>Nome:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <br/>
                        <p><strong>Mensagem:</strong></p>
                        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #f3f4f6;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                `
            });

            if (error) {
                console.error("Erro no Resend:", error);
                return res.status(500).json({ error: "Erro ao enviar mensagem." });
            }

            return res.status(200).json({ success: true, message: "Email enviado com sucesso!" });

        } catch (error) {
            console.error("Erro ao enviar email:", error);
            return res.status(500).json({ error: "Erro ao enviar mensagem. Tente novamente mais tarde." });
        }
    });
};