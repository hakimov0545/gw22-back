import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
	const { email, password, name } = req.body;
	if (!email || !password || !name) {
		return res.status(400).json({
			message: "Name email va password kiritish shart",
		});
	}
	const exist = await userModel.findOne({ email });
	if (exist) {
		return res.status(400).json({
			message: "Bunday email avval ro'yxatdan o'tgan",
		});
	}
	const hashed = await bcrypt.hash(password, 10);
	const user = await userModel.create({
		email,
		name,
		password: hashed,
	});
	const token = jwt.sign({ id: user._id }, JWT_SECRET);
	res.cookie("token", token, {
		maxAge: 1000 * 60 * 60,
		httpOnly: true,
		sameSite: "strict",
	});
	res.status(201).json({ message: "User created", token, user });
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({
			message: "Email va password kiritish shart",
		});
	}
	const user = await userModel.findOne({ email });
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		return res
			.status(400)
			.json({ message: "Email yoki password hato" });
	}
	const token = jwt.sign({ id: user._id }, JWT_SECRET);
	res.cookie("token", token, {
		maxAge: 1000 * 60 * 60,
		httpOnly: true,
		sameSite: "strict",
	});
	res.status(201).json({
		message: "Login successful",
		token,
		user,
	});
});

router.get("/me", async (req, res) => {
	const { token } = req.cookies;
	if (!token) {
		return res
			.status(401)
			.json({ message: "Token not provided" });
	}
	const data = jwt.verify(token, JWT_SECRET);
	const user = await userModel.findById(data.id);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	res.json({ user });
});

export default router;
