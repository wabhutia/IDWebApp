const pool = require('../models/db');

// ----x---- STATUS ----x----

const getFormStatus = async (req, res) => {
    try {

        const user_id = req.userId;

        const [formStatus] = await pool.query('SELECT * FROM status where user_id = ?', user_id);
        
        if (formStatus.affectedRows === 0) {
            res.status(404).json({ msg: 'No associated forms found with the given user ID'})
        }
        res.status(200).json(formStatus);

    } catch (error) {
        res.status(500).send("Error retrieving status");
    }
}

// ----x---- STATUS ----x----

// ----x---- FORMS ----x----

const getForm = async (req, res) => {

    // All forms associated with the User ID
    try {
        const userId = req.userId;
        const [form] = await pool.query(`SELECT * FROM form WHERE user_id = ?`, userId);

        // const formData = rows.map(row => {
        //     const { _buf, ...formData } = row;  // Exclude the _buf property
        //     console.log(formData);
        // });
        console.log(form);
        res.status(200).json(form);

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
            return res.status(404).json({ msg: "Employee Record does not exist"})
        }
        
        // Check if form already exists
        const [formExists] = await pool.query(`SELECT * FROM form
                                            WHERE user_id = ?`, userId);
        if (formExists.length > 0) {
            return res.status(409).json({ msg: "Form associated with User already exists"});
        }

        // Required information for the ID Card issuance
        const extractedData = empResult.map(({ present_designation, department, type_of_employment}) => ({
            present_designation,
            department,
            type_of_employment
            // Add more properties as needed
        }));

        // Fetch User details as required
        // Add Passport photo and Signature paths too
        const [userResult] = await pool.query(`SELECT permanent_address, blood_group, phone_number
                                       FROM user
                                       WHERE user_id = ?`, userId);
        if (userResult && userResult.length > 0) {
            const { permanent_address, blood_group, phone_number } = userResult[0];
            // Add the additional fields to the extracted data
            extractedData.forEach((item) => {
                item.permanent_address = permanent_address;
                item.blood_group = blood_group;
                item.phone_number = phone_number;
            });
        }

        const values = [
            userId,
            extractedData[0].present_designation,
            extractedData[0].department,
            extractedData[0].type_of_employment,
            extractedData[0].permanent_address,
            extractedData[0].blood_group,
            extractedData[0].phone_number
          ];
        
        // TRANSACTION QUERY - ROLLBACK IF ERROR, ELSE COMMIT
        await pool.query('START TRANSACTION');

        const [result] = await pool.query(`   INSERT INTO form 
                                            (user_id, present_designation, department, 
                                            type_of_employment, permanent_address, blood_group,
                                            phone_number) 
                                            VALUES (?,?,?,?,?,?,?)`, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Error inserting.'})
        }

          // Get the auto-incremented form_id
        const formId = result.insertId;
        console.log(result);
        // SQL query to insert into the status table
        const insertStatusQuery = `
            INSERT INTO status (user_id, form_id, form_status, payment_status)
            VALUES (?, ?, ?, ?);
        `;

        const valuesStatus = [userId, formId, 'Submitted', 'Pending']; // Assuming a default status of 'Pending'

        // Insert into the status table
        await pool.query(insertStatusQuery, valuesStatus);
        await pool.query('COMMIT');

        return res.status(201).json({msg: "Application submitted"});

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error executing POST query: ", error);
        res.status(500).send("Error submitting FORM")
    } 
}

// -- UPDATE -- Check designations
// const updateForm = async (req, res) => {

//     const {form_id, user_id} = req.body;

//     try {

//         //Check designations
// }


// ----x---- FORMS ----x----

// ----x---- ADMIN APIs ----x----

const getAllForms = async (req, res) => {

    // All forms associated with the User ID
    try {
        
        const [forms] = await pool.query(`SELECT * FROM form`);
        res.status(200).json(forms);

    } catch (error) {

        res.status(500).send("Error retrieving forms");
    }
}

const removeForm = async (req, res) => {

    try {
        const {user_id, form_id} = req.body;
        
        const deleteFormResult = await pool.query(`
        DELETE FROM 
        form
        WHERE
        (user_id, form_id) = (?, ?)
        `, [user_id, form_id]);
        
        if (deleteFormResult.affectedRows === 0) {
            res.status(404).json({ msg: 'Form not found.'})
        }

        // Associated Status entry is deleted on cascade when deleting the form
        res.status(200).json({ msg: "Succesfully deleted the Form."})
    } catch (error) {
        console.error("Error deleting the form: ", error);
        res.status(500).send("Error deleting the form.")
    }
}
// ----x---- ADMIN APIs ----x----



module.exports = {
    getForm,
    createForm,
    getFormStatus,
    removeForm,
    getAllForms
    //updateForm
}