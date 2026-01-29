const allowedOrigins = [
	"http://localhost:5173",
	"https://auto-defesa.web.app",
	"https://auto-defesa.firebaseapp.com",
];

const cors = require("cors")({
	origin: (origin, callback) => {
		if (
			allowedOrigins.indexOf(origin) !== -1 ||
			(!origin && process.env.NODE_ENV !== "production")
		) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
});

module.exports = cors;
