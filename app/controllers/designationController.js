const pool = require('../models/db');
const designationModel = require('../models/designationModel'); // Import the model

// ADMIN ONLY -- RESTRICTED ACCESS // 

const getAllDesignations = async (req, res) => {
    
    try {
        // const [designations] = await pool.query(`SELECT * FROM id_designations`);
        const designations = await designationModel.getAllDesignations();
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
        const existingDesignation = await designationModel.checkExistingDesignation(designation_name);
       
        if (existingDesignation.length > 0) {
            return res.status(404).json({ msg: 'Error, Designation already exists.'})
        }

        const result = await designationModel.addDesignation(designation_name);
        console.log(result);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Error, could not add.'})
        }

        res.status(200).json(result.des);
    
    } catch (error) {
        res.status(500).send("Error adding new Designation")
    }
}


const removeDesignation = async (req, res) => {

    const {designation_id} = req.body;
    try {
        const result = await designationModel.removeDesignation(designation_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Designation ID not found.'})
        }

        res.status(200).json({ msg: "Succesfully deleted the Designation."})
    } catch (error) {
        res.status(500).send("Error deleting designation.")
    }
}

// Update designation name only
const updateDesignation = async (req, res) => {

    const {designation_id, designation_name} = req.body;

    try {

        const result = await designationModel.updateDesignation(designation_id, designation_name);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Designation ID not found'})
        }

        res.status(200).json({ msg: "Success"})

    } catch (error) {
        res.status(500).send("Error updating the designation")
    }
}

module.exports = {
    getAllDesignations,
    addDesignation,
    removeDesignation,
    updateDesignation
}