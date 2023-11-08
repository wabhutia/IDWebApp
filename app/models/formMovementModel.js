const pool = require('./db');

const getSubmittedFormsDivVerifier = async (departmentName, divisionName) => {
    // Retrieve forms from division within department
    try {
        const [result] = await pool.query(`SELECT f.*, s.form_status
                                                FROM id_form_details f
                                                JOIN id_form_status s ON f.form_id = s.form_id
                                                WHERE f.department_name = ? 
                                                AND f.division_name = ?
                                                AND s.form_status = 'submitted';`, 
                                                [departmentName, divisionName]);
        return result;
    } catch (error) {
        throw error;
    }
}

const getSubmittedFormsDeptVerifier = async (departmentName) => {
    
    // Retrieve forms with no division assigned
    try {
        const [result] = await pool.query(`SELECT f.*, s.form_status
                                                    FROM id_form_details f
                                                    JOIN id_form_status s ON f.form_id = s.form_id
                                                    WHERE f.department_name = ? 
                                                    AND f.division_name is NULL
                                                    AND s.form_status = 'submitted';`, 
                                                    [departmentName]);
        return result;

    } catch (error) {
        throw error;
    }
}

const getApprovedFormsHomeVerifier = async () => {

    try {

        const [result] = await pool.query(`SELECT f.*, s.form_status
                                                    FROM id_form_details f
                                                    JOIN id_form_status s ON f.form_id = s.form_id
                                                    WHERE (s.form_status = 'approved_department' OR s.form_status = 'approved_divisional');`);
        return result;                               

    } catch (error) {
        throw error;
    }
}

const getApprovedFormsHomeAdmin = async () => {
    try {
        const [result] = await pool.query(`SELECT f.*, s.form_status
                                                    FROM id_form_details f
                                                    JOIN id_form_status s ON f.form_id = s.form_id
                                                    WHERE s.form_status = 'approved_home';`);
        return result;                 
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getSubmittedFormsDivVerifier,
    getSubmittedFormsDeptVerifier,
    getApprovedFormsHomeVerifier,
    getApprovedFormsHomeAdmin,

}