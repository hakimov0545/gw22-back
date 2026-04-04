import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();
const DB_URI = process.env.DB_URI;
const slower = slowDown({
	windowMs: 1000 * 60,
	delayAfter: 5,
	delayMs: () => 500,
	message: {
		status: 429,
		error: "Judayam kop so'rov yubordingiz, keyinroq urunib koring",
	},
});
const limiter = rateLimit({
	windowMs: 1000 * 60,
	max: 10,
	message: {
		status: 429,
		error: "Judayam kop so'rov yubordingiz, keyinroq urunib koring",
	},
});

app.use(express.json());
// app.use(limiter);
// app.use(slower);
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://localhost:3000",
			"https://gw22-front.vercel.app",
		],
		credentials: true,
	}),
);
app.use(helmet());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

function starter() {
	try {
		mongoose.connect(DB_URI).then(() => {
			console.log("DB connected");
		});
	} catch (error) {
		console.error("Error connecting DB: ", error.message);
	}

	app.listen(3000, () => {
		console.log("Server: http://localhost:3000");
	});
}

starter();
