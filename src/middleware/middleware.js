const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Không tìm thấy token" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token không hợp lệ" });
        }

        req.userId = decoded.id;
        next();
    });
};

const verifyTokenQuery = (req, res, next) => {
    const token = req.query.token;

    if (!token) {
        return res.status(403).json({ message: "Không tìm thấy token" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token không hợp lệ" });
        }

        req.userId = decoded.id;
        next();
    });
};


module.exports = {
    verifyToken, verifyTokenQuery
};
