const jwt = require("jsonwebtoken")
// middleware for protected routes to verify jwt token
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: "no token provided" })
    }
    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: "Invalid token format" });


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // now req.user.id is available
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = authMiddleware
