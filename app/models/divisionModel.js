const pool = require('./db');

const getAllDivisions = async () => {
    try {
        const [divisions] = await pool.query(` SELECT *
                                                    FROM id_divisions`);
        return divisions; 
    } catch(error) {
        throw error;
    }
}

const checkExistingDivision = async (divisionName) => {
    try {
        const [existingDivision] = await pool.query(` SELECT * 
                                                            FROM id_divisions 
                                                            WHERE division_name = ? `,
                                                            divisionName);
        return existingDivision;
    } catch (error) {
        throw error;
    }
}

const addNewDivision = async (divisionName) => {
    try {

        const result = await pool.query(` INSERT INTO 
                                            id_divisions (division_name)
                                            VALUES (?)
                                            `, divisionName);
        return result;
    } catch(error) {
        throw error;
    }
}

const removeDivision = async (divisionID) => {
    try {

        const result = await pool.query(` DELETE FROM 
                                            id_divisions
                                            WHERE
                                            division_id = (?)
                                            `, divisionID);
        return result;
    } catch(error) {
        throw error;
    }
}

const updateDivision = async (divisionID, divisionName) => {
    try {

        const result = await pool.query(` UPDATE id_divisions
                                            SET division_name = ?
                                            WHERE division_id = ?`, [divisionName, divisionID]);

        return result;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getAllDivisions,
    checkExistingDivision,
    addNewDivision,
    removeDivision,
    updateDivision
};