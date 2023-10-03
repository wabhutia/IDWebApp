const pool = require('../models/db');

const getForm = async (req, res) => {

    // All forms associated with the User ID
    try {
        const userId = req.userId;
        const [forms] = await pool.query(`SELECT * FROM form WHERE user_id = ?`, [userId]);
        res.status(200).json(forms);

    } catch (error) {
        
        console.error("Internal Error: ", error);
        res.status(500).send("Error retrieving forms");

    }

}

const createForm = async (req, res) => {

    try {
        // Check if employment details exist
        const userId = req.userId;
        const [empResult] = await pool.query(`SELECT * FROM employee_details
                                            WHERE user_id = ?`, userId);
        if (!empResult || empResult.length === 0) {
            res.status(404).json({ msg: "Employee Record does not exist"})
        }

        // Required information for the ID Card issuance
        const extractedData = empResult.map(({ present_designation, department, type_of_employment, 
                                                permanent_address, blood_group, phone_number
                                                }) => ({
            present_designation,
            department,
            type_of_employment,
            permanent_address,
            blood_group,
            phone_number
            // Add more properties as needed
        }));

        console.log(empResult)

        
        // const result = await pool.query(`   INSERT INTO form (user_id, employment_type) 
        //                                     VALUES (?,?)`, [userId, employment_type]);
        
        // if (result.affectedRows === 0) {
        //     res.status(404).json({ msg: 'Error inserting.'})
        // }
        
        res.status(201).json({msg: "Application submitted"});

    } catch (error) {

        console.error("Error executing POST query: ", error);
        res.status(500).send("Error submitting FORM")
    } 
}

const removeForm = async (req, res) => {

    const {form_id} = req.body;
    try {
        const result = await pool.query(`
        DELETE FROM 
        form
        WHERE
        form_id = (?)
        `, form_id);
        
        if (result.affectedRows === 0) {
            res.status(404).json({ msg: 'Form not found.'})
        }

        res.status(200).json({ msg: "Succesfully deleted the Form."})
    } catch (error) {
        console.error("Error deleting the form: ", error);
        res.status(500).send("Error deleting the form.")
    }
}

// -- UPDATE -- Check designations
// const updateForm = async (req, res) => {

//     const {form_id, user_id} = req.body;

//     try {

//         //Check designations
// }

const getFormStatus = async (req, res) => {
    try {

        const user_id = req.userId;
        const fetchStatusQuery = "SELECT * FROM status where user_id = ?";
        
        const result = await pool.query(fetchStatusQuery, user_id);
        console.log(result);
        if (result.affectedRows === 0) {
            res.status(404).json({ msg: 'No associated forms found with the given user ID'})
        }

        res.status(200).json(result);

    } catch (error) {
        res.status(500).send("Error retrieving status");
    }
}

// Admin API

const getAllForms = async (req, res) => {

    // All forms associated with the User ID
    try {
        
        const [forms] = await pool.query(`SELECT * FROM form`);
        res.status(200).json(forms);

    } catch (error) {

        res.status(500).send("Error retrieving forms");
    }

}

module.exports = {
    getForm,
    createForm,
    getFormStatus,
    removeForm,
    getAllForms
    //updateForm
}