const verifyRoles = (...allowedRoles) => {

    // Middleware function requires next
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);

        // Passed from route functions
        const rolesArray = [...allowedRoles];
        console.log(rolesArray);

        // Passed from access token
        console.log(req.roles);

        const result = req.roles.map( role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return res.sendStatus(401);
        next();

    }
}

module.exports = verifyRoles;