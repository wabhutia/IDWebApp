const pool = require('./db');

const getAllDepartments = async () => {
    try {
        const [departments] = await pool.query(` SELECT *
                                                    FROM id_departments`);
        return departments; 
    } catch(error) {
        throw error;
    }
}

const checkExistingDepartment = async (deptName) => {
    try {
        const [existingDepartment] = await pool.query(` SELECT * 
                                                            FROM id_departments 
                                                            WHERE Dept_Name = ? `,
                                                            deptName);
        return existingDepartment;
    } catch (error) {
        throw error;
    }
}

const addNewDepartment = async (deptName) => {
    try {

        const result = await pool.query(` INSERT INTO 
                                            id_departments (dept_name)
                                            VALUES (?)
                                            `, deptName);
        return result;
    } catch(error) {
        throw error;
    }
}

const removeDepartment = async (deptID) => {
    try {

        const result = await pool.query(` DELETE FROM 
                                            id_departments
                                            WHERE
                                            Dept_ID = (?)
                                            `, deptID);
        return result;
    } catch(error) {
        throw error;
    }
}

const updateDepartment = async (deptID, deptName) => {
    try {

        const result = await pool.query(`
                                            UPDATE id_departments
                                            SET Dept_Name = ?
                                            WHERE Dept_ID = ?`, [deptName, deptID]);

        return result;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getAllDepartments,
    checkExistingDepartment,
    addNewDepartment,
    removeDepartment,
    updateDepartment
};