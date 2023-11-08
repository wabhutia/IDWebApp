const pool = require('../models/db');
const retrievalModel = require('../models/retrievalModel');
const formMovementModel = require('../models/formMovementModel');
// ==== TO DO ====
// 1. GET VIA FORM STATUS 
// 2. APPROVE FORMS
// 3. REJECT FORMS
// ==== TO DO ====

// ----X---- RETRIEVAL USING FORM STATUS ----X---- 
const getAssociatedForms = async (req, res) => {
    
    const roles = req.roles;
    const userID = req.userID;
    
    //Perform role-specific actions
    try {

        // Department/Division of querying admins
        const result = await retrievalModel.getAdminDivDept(userID); 

        if (result.length === 0) { 
            return res.status(404).json({ msg: 'No associated department/division found for user'});
        }

        const departmentName = result[0].department_name;

        // CHECK
        if (roles.includes('divisional_verifier')) {
            const divisionName = result[0].division_name;

            if (divisionName) {
                const submittedForms = await formMovementModel.getSubmittedFormsDivVerifier(departmentName, divisionName);                                      
                if (submittedForms.length === 0) {
                    return res.status(404).json({ error: 'No forms available.' });
                }
                return res.status(200).send(submittedForms);
            } else {
                return res.status(404).json({error: 'Division not added'});
            }

        } else if (roles.includes('department_verifier')) {
            
            const submittedForms = await formMovementModel.getSubmittedFormsDeptVerifier(departmentName);
                                                    
            if (submittedForms.length === 0 ) {
                return res.status(404).json({ error: 'No forms available.' });
            }
            return res.status(200).json({submittedForms});

        } else if (roles.includes('home_verifier')) {
            
            const approvedForms = await formMovementModel.getSubmittedFormsHomeVerifier();

            if (approvedForms.length === 0 ) {
                return res.status(404).json({ error: 'No forms available.' });
            }
            
            return res.status(200).json(approvedForms);
        
        } else if (roles.includes('home_admin')) {

            const homeApprovedForms = await formMovementModel.getApprovedFormsHomeAdmin();
            if (homeApprovedForms.length === 0 ) {
                return res.status(404).json({ error: 'No forms available.' });
            }
            return res.status(200).json({homeApprovedForms});

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
    const userID = req.userID;

    try {
        
        const [pendingForms] = await pool.query(`SELECT f.*, s.form_status
                                                    FROM id_form_details f
                                                    JOIN id_form_status s ON f.form_id = s.form_id
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

const approveForm = async (req, res) => {

    const roles = req.roles;
    const userID = req.userID;
    const { formID, remarks } = req.body;

    try {
            


    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const rejectForm = async (req, res) => {

}


module.exports = { 
    getAssociatedForms, 
    getFormsForIssuance 
};