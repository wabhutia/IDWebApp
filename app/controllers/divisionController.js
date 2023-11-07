const pool = require('../models/db');
const divisionModel = require('../models/divisionModel');
const retrievalModel = require('../models/retrievalModel');

// SUPER ADMIN & DEPARTMENTAL ADMINS ONLY // 

const getAllDivisions = async (req, res) => {
    
    try {

        const divisions = await divisionModel.getAllDivisions();
        res.status(200).json(divisions);
    
    } catch (error) {
        
        console.error("Error executing GET query: ", error);
        res.status(500).send("Error retrieving Divisions")
    
    }
}

const addDivision = async (req, res) => {
    
    // Retrieve Department ID
    const {division_name, dept_ID} = req.body;
    const roles = req.roles;
    const userID = req.userID;
    
    try {
        // Retrieve department ID from user ID 
        const userDepartmentID = await retrievalModel.getUserDepartmentID(userID);

        if (userDepartmentID[0].dept_id === dept_ID || roles.includes('super_admin')) {
            
            // CHECK IF Division EXISTS ALREADY [UNIQUE]
            const existingDivision = await divisionModel.checkExistingDivision(division_name);
            if (existingDivision.length > 0) {
                return res.status(404).json({ msg: 'Division already exists.'})
            }

            const result = await divisionModel.addNewDivision(division_name);
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Error, could not add.'})
            }
            res.status(200).json(result);
    
        } else {
            return res.status(401).json({ msg: 'Cannot add division outside users own department'})
        }
    } catch (error) {
    
        console.error("Error executing POST query: ", error);
        res.status(500).send("Error retrieving DivisionS")
    
    }
}


const removeDivision = async (req, res) => {

    const {division_id} = req.body;
    // const adminDepartmentID = req.department_id;
    const roles = req.roles;
    const userID = req.userID;
    
    try {

        const userDepartmentID = await retrievalModel.getUserDepartmentID(userID);
        const divDeptID = await retrievalModel.getDivDeptID(division_id);

        if (divDeptID === undefined) {
            return res.status(404).json({msg: 'Division not found'})
        }

        if (divDeptID[0].dept_id === userDepartmentID[0].dept_id || roles.includes('super_admin')) {
    
            const result = await divisionModel.removeDivision(division_id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Division not found.'});
            }
    
            res.status(200).json({ msg: "Succesfully deleted the Division."});
    
        } else {
            res.status(401).json({msg: "Cannot delete division outside users own department"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting the Division.")
    }
}

// Update Division name only
const updateDivision = async (req, res) => {

    const {division_id, division_name} = req.body;
    const roles = req.roles;
    const userID = req.userID;

    try {

        const userDepartmentID = await retrievalModel.getUserDepartmentID(userID);
        const divDeptID = await retrievalModel.getDivDeptID(division_id);
        if (divDeptID === undefined || divDeptID.length === 0 ) {
            return res.status(404).json({msg: 'Division not found'})
        }

        if (divDeptID[0].dept_id === userDepartmentID[0].dept_id || roles.includes('super_admin')) {

            const result = await divisionModel.updateDivision(division_id, division_name);

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Division ID not found'})
            }

            res.status(200).json({ msg: "Succesfully updated Division name"})
        } else {
            return res.status(401).json({ msg: "Cannot update division outside users own department"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating the division")
    }
}

module.exports = {
    getAllDivisions,
    addDivision,
    removeDivision,
    updateDivision
}