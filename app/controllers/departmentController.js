const pool = require('../models/db')
const departmentModel = require('../models/departmentModel'); // Import the model


const getAllDepartments = async (req, res) => {
    try {
        const allDepartments = await departmentModel.getAllDepartments();
        
        res.status(200).json(allDepartments);
    }
    catch (error) {
        console.error("Error executing QUERY: ", error);
        res.status(500).send("## Error retrieving DEPARTMENTS ##")
    }
}

const addNewDepartment = async (req, res) => {
    
    const { department_name } = req.body;

    try {
        const existingDepartment = await departmentModel.checkExistingDepartment(department_name);
       
        if (existingDepartment.length > 0) {
            return res.status(404).json({ msg: 'Department already exists.'})
        }

        const result = await departmentModel.addNewDepartment(department_name);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Error, could not add.'})
        }

        res.status(200).json({ msg: "Succesfully added the new department."})

    } catch(error) {

        res.status(500).send('Error INSERTING Data.')
    }
}

const removeDepartment = async (req, res) => {

    const {department_id} = req.body;

    try {
        const result = await departmentModel.removeDepartment(department_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Department not found.'})
        }

        res.status(200).json({ msg: "Succesfully deleted the department."})
    }
    catch (error) {
        console.error("Error deleting the department: ", error);
        res.status(500).send("Error deleting the department.")
    }
}

// Update department name only
const updateDepartment = async (req, res) => {

    const {department_id, department_name} = req.body;

    try {

        const result = await departmentModel.updateDepartment(department_id, department_name);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Department ID not found.'})
        }

        res.status(200).json({ msg: "Succesfully updated the department name."})

    } catch (error) {
        console.error("Error updating : ", error);
        res.status(500).send("Error updating the department.")
    }
}

module.exports = {
    getAllDepartments,
    addNewDepartment,
    removeDepartment,
    updateDepartment
}