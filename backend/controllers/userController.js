const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "TESTING-THE-JWTs"


const signUp = async (req, res) => {

    const { username, phone_number,  password } = req.body;
    try {

        // Existing User
        const [existingUser] = await pool.query("SELECT * FROM user WHERE phone_number = ?", phone_number);
        if (existingUser.length != 0) {
            return res.status(400).json({msg: "User already exists!"})
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
        const token = jwt.sign({phoneNumber: phone_number, id: newUserId}, SECRET_KEY);
        res.status(200).json({ user: result, token: token})


    } catch (error) {
        console.error('Error inserting user data: ', error);
        res.status(500).send('Error inserting User data.')
    }
}

const signIn = async (req, res) => {
    try {
        // const { username, phone_number, password } = req.body;
        
    } catch (err) {
        
    }
}

module.exports = {
    signUp,
    signIn
}