const cors = require("../middleware/cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendSupportEmail = (req, res) => {
    cors(req, res, async () => {
        try {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios." });
            }

            // Se as credenciais não estiverem configuradas, avisar no log mas não crashar se possível (ou retornar erro)
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.error("Credenciais de email não configuradas (EMAIL_USER, EMAIL_PASS).");
                return res.status(500).json({ error: "Serviço de email não configurado." });
            }

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: `"${name}" <${process.env.EMAIL_USER}>`, 
                replyTo: email,
                to: "rodrigocvmd@gmail.com",
                subject: `Suporte AutoDefesa: Mensagem de ${name}`,
                text: `
Nome: ${name}
Email: ${email}

Mensagem:
${message}
                `,
                html: `
                    <h3>Nova mensagem de suporte</h3>
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <br/>
                    <p><strong>Mensagem:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                `
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ success: true, message: "Email enviado com sucesso!" });

        } catch (error) {
            console.error("Erro ao enviar email:", error);
            return res.status(500).json({ error: "Erro ao enviar mensagem. Tente novamente mais tarde." });
        }
    });
};
