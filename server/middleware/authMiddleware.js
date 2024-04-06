const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        console.log("hello")
        const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodeToken.userId;
        req.body.userId = userId;
        next();
    } catch (error) {
        res.status(401).send({
            message: "You are not authorized",
            data: error,
            success: false
        });
    }
};
