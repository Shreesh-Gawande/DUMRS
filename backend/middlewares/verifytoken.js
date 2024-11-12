const jwt=require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY||"Shreesh";
const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Get the token from the cookies
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Attach decoded token data (e.g., userId and userType) to req.user
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token." });
    }
};

module.exports={verifyToken}