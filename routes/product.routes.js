import express from "express";
import productModel from "../models/product.model.js";
const router = express.Router();

router.get("/", async (req, res) => {
	const products = await productModel.find();
	res.json(products);
});

router.post("/", async (req, res) => {
	const { name, price } = req.body;
	if (!name || !price) {
		return res
			.status(400)
			.json({ message: "Name va price kiritish shart" });
	}
	const product = await productModel.create({ name, price });
	res.status(201).json({ message: "Product created", product });
});

router.patch("/:id", async (req, res) => {
	const { id } = req.params;
	const updated = await productModel.findByIdAndUpdate(
		id,
		req.body,
		{ new: true },
	);
	res.json({ message: "Product updated", product: updated });
});

router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	await productModel.findByIdAndDelete(id);
	res.json({ message: "Product deleted" });
});

export default router;
