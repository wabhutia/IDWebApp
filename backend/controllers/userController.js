const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Test only - .env
const SECRET_KEY = "FORM-TESTING-THE-JWTs"

const signUp = async (req, res) => {

    const { username, phone_number,  password } = req.body;
    try {

        // Existing User
        const [existingUser] = await pool.query("SELECT * FROM user WHERE username = ?", username);
        if (existingUser.length != 0) {
            return res.status(403).json({
                    msg: "User data already exists -> Sign In Instead",
                    error: "Resource already exists"    
                })
        }

        // Hashed Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // User Creation
        const result = await pool.query("INSERT INTO user (username, phone_number, password) VALUES (?, ?, ?)", 
                                        [username, phone_number, hashedPassword]);                                        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Error, could not insert new User.'})
        }

        // Token Generation
        const newUserId = result.insertId;
        const token = jwt.sign({username: username, id: newUserId}, SECRET_KEY);
        res.status(200).json({ user: result, token: token})

    } catch (error) {
        console.error('Error inserting user data: ', error);
        res.status(500).send('Error inserting User data.')
    }
}

const signIn = async (req, res) => {
 
    const { username, password } = req.body;
    try {
        
        // Check Existing User
        const [existingUser] = await pool.query("SELECT * FROM user WHERE username = ?", username)
        if (existingUser.length == 0) {
            return res.status(404).json({
                    msg: "User not found"    
                })
        }
        const matchPassword = await bcrypt.compare(password, existingUser[0].password);
        if (!matchPassword) {
            return res.status(400).json({
                msg: "Invalid Credentials",
                error: "Incorrect Password"
            })
        }
        
        console.log(existingUser[0].user_id);
        const token = jwt.sign({ username: existingUser[0].username, id: existingUser[0].user_id}, SECRET_KEY)
        res.status(201).json({user: existingUser[0], token: token});

    } catch (err) {
        console.log(err);
        res.status(500).send('Incorrect username or password')
    }
}

module.exports = {
    signUp,
    signIn
}