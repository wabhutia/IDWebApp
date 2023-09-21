const pool = require('../models/db');

// ADMIN ONLY -- RESTRICTED ACCESS // 

const getAllDivisions = async (req, res) => {
    
    try {
        const [divisions] = await pool.query(`SELECT * FROM divisions`);
        console.log(divisions)
        res.status(200).json(divisions)
    
    } catch (error) {
        console.error("Error executing GET query: ", error);
        res.status(500).send("Error retrieving Divisions")
    }
}

const addDivision = async (req, res) => {
    
    const {division_name, department_id} = req.body;
    try {
        // CHECK IF Division EXISTS ALREADY [UNIQUE]
        const [existingDivision] = await pool.query("SELECT * FROM divisions WHERE division_name = ?", division_name);

        if (existingDivision.length > 0) {
            console.log("Division already exists.")
            return res.status(404).json({ msg: 'Error, already exists.'})
        }

        const result = await pool.query(`   INSERT INTO
                                            divisions (division_name, department_id)
                                            VALUES (?,?)`, [division_name, department_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Error, could not add.'})
        }

        res.status(200).json(result.des);
    
    } catch (error) {
        console.error("Error executing POST query: ", error);
        res.status(500).send("Error retrieving DivisionS")
    }
}


const removeDivision = async (req, res) => {

    const {division_id} = req.body;
    try {
        const result = await pool.query(`
        DELETE FROM 
        divisions
        WHERE
        division_id = (?)
        `, division_id);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Division not found.'})
        }

        res.status(200).json({ msg: "Succesfully deleted the Division."})
    } catch (error) {
        console.error("Error deleting the Division: ", error);
        res.status(500).send("Error deleting the Division.")
    }
}

// Update Division name only
const updateDivision = async (req, res) => {

    const {division_id, division_name} = req.body;

    try {

        const result = await pool.query(`
        UPDATE divisions
        SET division_name = ?
        WHERE division_id = ?`, [division_name, division_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Division ID not found'})
        }

        res.status(200).json({ msg: "Succesfully updated the Division name"})

    } catch (error) {
        console.error("Error updating: ", error);
        res.status(500).send("Error updating the division")
    }
}

module.exports = {
    getAllDivisions,
    addDivision,
    removeDivision,
    updateDivision
}