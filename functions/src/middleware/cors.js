const allowedOrigins = [
	"http://localhost:5173",
	"http://127.0.0.1:5173",
	"https://auto-defesa.web.app",
	"https://auto-defesa.firebaseapp.com",
    "https://meuautodefesa.com.br",
    "https://www.meuautodefesa.com.br",
];

const corsHandler = require("cors")({
	origin: (origin, callback) => {
        // Permitir requisições sem origem (como mobile apps ou curl) ou se a origem estiver na lista
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
            console.error(`CORS Blocked: Origin '${origin}' not allowed.`);
			callback(new Error("Not allowed by CORS"));
		}
	},
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
});

const corsMiddleware = (req, res, next) => {
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Origin', req.headers.origin || "*");
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.set('Access-Control-Allow-Credentials', 'true');
        res.status(204).send('');
        return;
    }
    return corsHandler(req, res, next);
};

module.exports = corsMiddleware;
