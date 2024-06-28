const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    try {
        jwt.verify(token, process.env.SECRET, function (error, data) {
            if (data) {
                req.user = data;
                next();
            }
            else if (error) {
                throw new Error(error);
            }
        });
    }
    catch (error) {
        res.status(401).redirect("/login");
    }

}

module.exports = authMiddleware;