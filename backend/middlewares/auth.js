const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey";

const authMiddleware = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // Check if the userType is "authority"
        if (decoded.userType !== "authority") {
            return res.status(403).json({ message: "Forbidden: Not an authority user" });
        }

        // Attach the decoded userId to the request object
        req.userId = decoded.userId;
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
