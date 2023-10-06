const jwt = require("jsonwebtoken");
const SECRET_KEY = "FORM-TESTING-THE-JWTs"

const auth = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log(token);
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {

        const data = jwt.verify(token, SECRET_KEY);
        req.userId = data.id;
        req.userName = data.username;
        req.roles = data.roles;
        
        next();

    } catch(error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        else {
            console.error('JWT Verification Error:', error);
            res.status(401).json({message: "Unauthorized User"});
        }
    }
}

module.exports = auth;