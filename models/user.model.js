import { Schema, model } from "mongoose";

const userSchema = new Schema({
	email: String,
	password: String,
	name: String,
	role: { type: String, default: "user" },
});

export default model("User", userSchema);
