import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export async function authMiddleware(req, res, next) {
	const { token } = req.cookies;
	if (!token) {
		return res
			.status(401)
			.json({ message: "Token not provided" });
	}
	try {
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		const user = await userModel.findById(decode.id);
		if (!user) {
			return res
				.status(404)
				.json({ message: "User not found" });
		}
		req.user = user;
		next();
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
}
