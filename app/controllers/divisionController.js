const pool = require('../models/db');

// SUPER ADMIN & DEPARTMENTAL ADMINS ONLY // 

const getAllDivisions = async (req, res) => {
    
    try {

        const [divisions] = await pool.query(`SELECT * FROM id_divisions`);
        res.status(200).json(divisions);
    
    } catch (error) {
        
        console.error("Error executing GET query: ", error);
        res.status(500).send("Error retrieving Divisions")
    
    }
}

const addDivision = async (req, res) => {
    
    // Retrieve Department ID
    const {division_name, dept_id} = req.body;
    const adminDepartmentID = req.department_id;
    const roles = req.roles;
    
    try {
        if (dept_id === adminDepartmentID || roles.includes('super_admin')) {
            
            // CHECK IF Division EXISTS ALREADY [UNIQUE]
            const [existingDivision] = await pool.query("SELECT * FROM id_divisions WHERE division_name = ?", [division_name]);
            if (existingDivision.length > 0) {
                console.log("Division already exists.")
                return res.status(404).json({ msg: 'Error, already exists.'})
            }

            const result = await pool.query(`   INSERT INTO
                                                id_divisions (division_name, dept_id)
                                                VALUES (?,?)`, [division_name, dept_id]);

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
    const adminDepartmentID = req.department_id;
    const roles = req.roles;
    
    try {

        const [deptIDQuery] = await pool.query("SELECT dept_id from id_divisions WHERE division_id = ?", [division_id]);    
        if (deptIDQuery === undefined || deptIDQuery.length === 0 ) {
            return res.status(404).json({msg: 'Division not found'})
        }

        const dept_id = deptIDQuery[0].dept_id;
    
        if (dept_id === adminDepartmentID || roles.includes('super_admin')) {
    
            const result = await pool.query("DELETE FROM id_divisions WHERE division_id = (?)", division_id);
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Division not found.'});
            }
    
            res.status(200).json({ msg: "Succesfully deleted the Division."});
    
        } else {
            res.status(401).json({msg: "Cannot delete division outside users own department"});
        }
        
    } catch (error) {
        console.error("Error deleting the Division: ", error);
        res.status(500).send("Error deleting the Division.")
    }
}

// Update Division name only
const updateDivision = async (req, res) => {

    const {division_id, division_name} = req.body;
    const adminDepartmentID = req.department_id;
    const roles = req.roles;

    try {

        const [deptIDQuery] = await pool.query("SELECT dept_id from id_divisions WHERE division_id = ?", [division_id]);    
        if (deptIDQuery === undefined || deptIDQuery.length === 0 ) {
            return res.status(404).json({msg: 'Division not found'})
        }

        if (dept_id === adminDepartmentID || roles.includes('super_admin')) {

            const result = await pool.query("UPDATE id_divisions SET division_name = ? WHERE division_id = ?", 
                                            [division_name, division_id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Division ID not found'})
            }

            res.status(200).json({ msg: "Succesfully updated the Division name"})
        } else {
            return res.status(401).json({ msg: "Cannot update division outside users own department"});
        }
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