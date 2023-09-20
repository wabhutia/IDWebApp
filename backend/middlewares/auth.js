const jwt = require("jsonwebtoken");
const SECRET_KEY = "FORM-TESTING-THE-JWTs"

const auth = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {

        if (token) { 
            token = token.split(" ")[1];
            let user = jwt.verify(token, SECRET_KEY);
            // Check token expiration
            
            req.userId = user.id;
        }
        else {
            res.status(401).json({message: "Unauthorized User"});
        }
        
        next();

    } catch(error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        else {
            console.log(error);
            res.status(401).json({message: "Unauthorized User"});
        }
    }
}

module.exports = auth;