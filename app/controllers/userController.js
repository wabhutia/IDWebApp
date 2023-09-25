const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Test only - .env
const SECRET_KEY = "FORM-TESTING-THE-JWTs";

const signUp = async (req, res) => {

    const { username, phone_number,  password } = req.body;
    try {

        // Existing User
        const [existingUser] = await pool.query("SELECT * FROM user WHERE username = ?", username);
        if (existingUser.length != 0) {
            return res.status(403).json({
                    msg: "User data already exists -> Sign In Instead",
                    error: "Resource already exists"    
                });
        }

        // Hashed Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // New User Registration
        const [result] = await pool.query("INSERT INTO user (username, phone_number, password) VALUES (?, ?, ?)", 
                                        [username, phone_number, hashedPassword]);                                        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Error, could not insert new User.'});
        }
        
        const newUserId = result.insertId;

        // Assign the default role "user" with "id: 2" to the new user
        const roleInsertQuery = await pool.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
                                        [newUserId, 2]);
        if (roleInsertQuery.affectedRows === 0) {
            return res.status(500).json({ msg: 'Internal server error.'});
        }

        // Token Generation for automatic sign in after sign up is complete
        const token = jwt.sign({username: username, id: newUserId}, SECRET_KEY, {expiresIn: '1h'});
        res.status(200).json({ user: result, token: token});

    } catch (error) {
        console.error('Error inserting user data: ', error);
        res.status(500).send('Error inserting User data.');
    }
}

const signIn = async (req, res) => {
 
    const { username, password } = req.body;
    try {
        
        // Check Existing User
        const [existingUser] = await pool.query("SELECT * FROM user WHERE username = ?", username);
        if (existingUser.length == 0) {
            return res.status(404).json({
                    msg: "User not found"    
                });
        }
        const matchPassword = await bcrypt.compare(password, existingUser[0].password);
        if (!matchPassword) {
            return res.status(400).json({
                msg: "Invalid Credentials",
                error: "Incorrect Password"
            });
        }
        
        // Token Expiry
        // https://www.geeksforgeeks.org/how-long-jwt-token-valid/ 
        
        // Retrieve assigned roles of the user
        const [userRoles] = await pool.query(`SELECT R.role_name 
                                                FROM User_Roles UR 
                                                JOIN Roles R ON UR.role_id = R.role_id 
                                                WHERE UR.user_id = ?`, existingUser[0].user_id);
        
        if (userRoles.length == 0) {
            return res.status(500).json({
                    msg: "Error Retrieving Roles"    
                });
        }        
        
        const roles = userRoles.map(userRoles => userRoles.role_name);

        console.log(roles);

        const token = jwt.sign({ username: existingUser[0].username, 
                                    id: existingUser[0].user_id, 
                                    roles: roles}, SECRET_KEY, 
                                    {expiresIn: '1h'});

        res.status(201).json({user: existingUser[0], token: token});

    } catch (err) {
        console.log(err);
        res.status(500).send('Incorrect username or password');
    }
}

module.exports = {
    signUp,
    signIn
}