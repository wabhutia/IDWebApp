const pool = require('../models/db');

// ==== TO DO ====
// 1. GET VIA FORM STATUS 
// 2. APPROVE FORMS
// 3. REJECT FORMS
// ==== TO DO ====

// ----X---- RETRIEVAL USING FORM STATUS ----X---- 
const getAssociatedForms = async (req, res) => {
    
    const roles = req.roles;
    const userId = req.userId;
    
    //Perform role-specific actions
    try {

        // Department/Division of querying admins
        const [result] = await pool.query(`SELECT department_name, division_name
                                                            FROM employee_details where user_id = ?`, userId); 

        if (result.length === 0) { 
            return res.status(404).json({ msg: 'No associated department/division found for user'});
        }
        const departmentName = result[0].department_name;

        // CHECK
        if (roles.includes('divisional_verifier')) {
            const divisionName = result[0].division_name;

            if (divisionName) {
                const [submittedForms] = await pool.query(`SELECT f.*, s.form_status
                                                                FROM form f
                                                                JOIN status s ON f.form_id = s.form_id
                                                                WHERE f.department_name = ? 
                                                                AND f.division_name = ?
                                                                AND s.form_status = 'submitted';`, 
                                                                [departmentName, divisionName]);

                                                            
                if (submittedForms.length === 0) {
                    return res.status(404).json({ error: 'No forms available.' });
                }
                return res.status(200).send(submittedForms);
            }

        } else if (roles.includes('department_verifier')) {
            
            const [submittedForms] = await pool.query(`SELECT f.*, s.form_status
                                                    FROM form f
                                                    JOIN status s ON f.form_id = s.form_id
                                                    WHERE f.department_name = ? 
                                                    AND f.division_name is NULL
                                                    AND s.form_status = 'submitted';`, 
                                                    [departmentName]);
                                                    
            if (submittedForms.length === 0 ) {
                return res.status(404).json({ error: 'No forms available.' });
            }
            return res.status(200).json({ msg: submittedForms});

        } else if (roles.includes('home_verifier')) {
            
            const [homeForms] = await pool.query(`SELECT f.*, s.form_status
                                                    FROM form f
                                                    JOIN status s ON f.form_id = s.form_id
                                                    WHERE (s.form_status = 'approved_department' OR s.form_status = 'approved_divisional');`);
                                                    
            if (homeForms.length === 0 ) {
                return res.status(404).json({ error: 'No forms available.' });
            }
            return res.status(200).json({ msg: homeForms});
        
        } else if (roles.includes('home_admin')) {

            const [homeVerifiedForms] = await pool.query(`SELECT f.*, s.form_status
                                                    FROM form f
                                                    JOIN status s ON f.form_id = s.form_id
                                                    WHERE s.form_status = 'approved_home';`);
                                                    
            if (homeVerifiedForms.length === 0 ) {
                return res.status(404).json({ error: 'No forms available.' });
            }
            return res.status(200).json({ msg: homeVerifiedForms});

        } else {
            res.status(403).json({ error: 'Unauthorized access.' });
        }
        // ('submitted', 'approved_department', 'approved_divisional', 'approved_home', 'approved_final'
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getFormsForIssuance = async (req, res) => {
    const roles = req.roles;
    const userId = req.userId;

    try {
        
        const [pendingForms] = await pool.query(`SELECT f.*, s.form_status
                                                    FROM form f
                                                    JOIN status s ON f.form_id = s.form_id
                                                    WHERE s.form_status = 'approved_final';`);
                                                    
        if (pendingForms.length === 0 ) {
            return res.status(404).json({ error: 'No forms available.' });
        }
        return res.status(200).json({ msg: pendingForms});

    } catch(error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// ----X---- RETRIEVAL USING FORM STATUS ----X---- 

// ----X---- REJECTION API ----X----

// ----X---- REJECTION API ----X----

module.exports = { getAssociatedForms, getFormsForIssuance };