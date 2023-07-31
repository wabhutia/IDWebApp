const pool = require('../models/db');

// ADMIN ONLY -- RESTRICTED ACCESS // 

const getAllDesignations = async (req, res) => {
    
    try {
        const [designations] = await pool.query(`SELECT * FROM designations`);
        res.status(200).json(designations)
    
    } catch (error) {
        console.error("Error executing GET query: ", error);
        res.status(500).send("Error retrieving DESIGNATIONS")
    }
}

const addDesignation = async (req, res) => {
    
    const {designation_name} = req.body;
    try {

        // CHECK IF DESIGNATION EXISTS ALREADY [UNIQUE]
        const [existingDesignation] = await pool.query("SELECT * FROM designations WHERE designation_name = ?", designation_name);

        if (existingDesignation.length > 0) {
            console.log("Designation already exists.")
            return res.status(404).json({ msg: 'Error, already exists.'})
        }


        const result = await pool.query(`   INSERT INTO
                                            designations (designation_name)
                                            VALUES (?)`, designation_name);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Error, could not add.'})
        }

        res.status(200).json(result.des);
    
    } catch (error) {
        console.error("Error executing POST query: ", error);
        res.status(500).send("Error retrieving DESIGNATIONS")
    }
}


const removeDesignation = async (req, res) => {

    const {designation_id} = req.body;
    try {
        const result = await pool.query(`
        DELETE FROM 
        designations
        WHERE
        designation_id = (?)
        `, designation_id);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Designation not found.'})
        }

        res.status(200).json({ msg: "Succesfully deleted the Designation."})
    } catch (error) {
        console.error("Error deleting the designation: ", error);
        res.status(500).send("Error deleting the designation.")
    }
}

// Update designation name only
const updateDesignation = async (req, res) => {

    const {designation_id, designation_name} = req.body;

    try {

        const result = await pool.query(`
        UPDATE designations
        SET designation_name = ?
        WHERE designation_id = ?`, [designation_name, designation_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Designation ID not found'})
        }

        res.status(200).json({ msg: "Succesfully updated the designation name"})

    } catch (error) {
        console.error("Error updating: ", error);
        res.status(500).send("Error updating the designation")
    }
}

module.exports = {
    getAllDesignations,
    addDesignation,
    removeDesignation,
    updateDesignation
}