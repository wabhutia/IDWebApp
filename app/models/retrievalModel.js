const pool = require('./db');

const getUserDepartmentID = async (userID) => {

    try {
        // const [result] = await pool.query(` SELECT department_name FROM employee_details WHERE user_id=?`, [userID]);
        const [result] = await pool.query(` SELECT e.user_id, d.dept_id
                                            FROM employee_details AS e
                                            JOIN id_departments AS d ON e.department_name = d.dept_name
                                            WHERE e.user_id = ?;
                                            `, [userID]);
        return result;

    } catch(error) {
        throw error;
    }
}

const getDivDeptID = async (divisionID) => {
    try {
        const [result] = await pool.query(` SELECT dept_id
                                                FROM id_divisions
                                                WHERE division_id = ?`,
                                                [divisionID]);
        return result;
    } catch(error) {
        throw error;
    }
}

const getAdminDivDept = async (userID) => {
    try {
        const [result] = await pool.query(` SELECT department_name, division_name
                                            FROM employee_details 
                                            WHERE user_id = ?`, userID);
         return result;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getUserDepartmentID,
    getDivDeptID,
    getAdminDivDept
};