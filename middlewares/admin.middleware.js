export function adminMiddleware(req, res, next) {
	try {
		const user = req.user;
		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		if (user.role !== "admin") {
			return res
				.status(403)
				.json({ message: "Admin bolishi kerak" });
		}
		next();
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
}
