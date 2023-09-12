const pool = require('../models/db');

const getAllForms = async (req, res) => {

    try {
        const [forms] = await pool.query(`SELECT * FROM form`);
        res.status(200).json(forms);
    } catch (error) {
        console.error("Internal Error: ", error);
        res.status(500).send("Error retrieving FORMS");
    }
}

const addForm = async (req, res) => {

    const {user_id, employment_type} = req.body;

    try {

        const result = await pool.query(`   INSERT INTO form (user_id, employment_type) 
                                            VALUES (?,?)`, [user_id,employment_type]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Error inserting.'})
        }

        res.status(200).json(result);

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
            return res.status(404).json({ msg: 'Form not found.'})
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

module.exports = {
    getAllForms,
    addForm,
    removeForm
    //updateForm
}