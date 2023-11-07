const pool = require('./db');

const getAllDesignations = async () => {
    try {
        const [designations] = await pool.query(` SELECT *
                                                    FROM id_designations`);
        return designations; 
    } catch(error) {
        throw error;
    }
}

const checkExistingDesignation = async (designationName) => {
    try {
        const [existingDesignation] = await pool.query(` SELECT * 
                                                            FROM id_designations 
                                                            WHERE designation = ? `,
                                                            designationName);
        return existingDesignation;
    } catch (error) {
        throw error;
    }
}

const addDesignation = async (designationName) => {
    try {

        const result = await pool.query(` INSERT INTO
                                            id_designations (designation)
                                            VALUES (?)`,
                                            designationName);
        return result;
    } catch(error) {
        throw error;
    }
}

const removeDesignation = async (designationID) => {
    try {

        const result = await pool.query(` DELETE FROM 
                                            id_designations
                                            WHERE
                                            desig_id = (?)
                                            `, designationID);
        return result;
    } catch(error) {
        throw error;
    }
}

const updateDesignation = async (designationID, designationName) => {
    try {

        const result = await pool.query(`
                                            UPDATE id_designations
                                            SET designation = ?
                                            WHERE desig_id = ?`, [designationName, designationID]);

        return result;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getAllDesignations,
    checkExistingDesignation,
    addDesignation,
    removeDesignation,
    updateDesignation
};