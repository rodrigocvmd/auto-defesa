const allowedOrigins = [
	"http://localhost:5173",
	"https://auto-defesa.web.app",
	"https://auto-defesa.firebaseapp.com",
    "https://meuautodefesa.com.br",
    "https://www.meuautodefesa.com.br",
];

const cors = require("cors")({
	origin: (origin, callback) => {
        // Permitir requisições sem origem (como mobile apps ou curl) ou se a origem estiver na lista
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
            console.error(`CORS Blocked: Origin '${origin}' not allowed.`);
			callback(new Error("Not allowed by CORS"));
		}
	},
    credentials: true, // Importante para enviar cookies/tokens se necessário
});

module.exports = cors;
