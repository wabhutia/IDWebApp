const pool = require('../models/db');

const assignRole = async (req, res) => {

    try {

        const {user_id, role_id} = req.body;

        // ONLY 1 SUPER ADMIN
        if (role_id === 1) {
            return res.status(403).json({error:"Super admin not assignable"});
        }

        // Check if the user already has the specified role
        const [existingUserRole] = await pool.query(
            `SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?`,
            [user_id, role_id]
        );
    
        if (existingUserRole.length !== 0) {
            return res.status(400).json({
            msg: "User already has this role",
            error: "Conflict"
            });
        }

        const [updateRole] = await pool.query(`INSERT INTO user_roles (user_id, role_id)
                                                VALUES (?, ?)`, [user_id, role_id]);
        
        if (updateRole.affectedRows === 0) {
            return res.status(500).json({
                msg: "Failed to assign role to the user",
                error: "Internal Server Error"    
            });
        }

        res.status(200).json({
            msg: "Role assigned successfully",
            data: { user_id, role_id }
        });

    } catch(error) {
        console.error("Error in assigning role:", error);
        res.status(500).json({
            msg: "An unexpected error occurred",
            error: "Internal Server Error"
        });
    }
}


const removeRole = async (req, res) => {
    try {
        const { user_id, role_id } = req.body;
        // Ensure not removing SUPER ADMIN role
        if (role_id === 1) {
            return res.status(403).json({ error: "Cannot remove Super admin role" });
        }
    
        // Check if the user has the specified role
        const [existingUserRole] = await pool.query(
            `SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?`,
            [user_id, role_id]
        );
    
        if (existingUserRole.length === 0) {
            return res.status(400).json({
            msg: "User does not have this role",
            error: "Bad Request"
            });
        }
    
        // Remove the role from the user
        const [deletedRole] = await pool.query(
            `DELETE FROM user_roles WHERE user_id = ? AND role_id = ?`,
            [user_id, role_id]
        );
    
        // Check if the role removal was successful
        if (deletedRole.affectedRows === 0) {
            return res.status(500).json({
            msg: "Failed to remove role from the user",
            error: "Internal Server Error"
            });
        }
    
        res.status(200).json({
            msg: "Role removed successfully",
            data: { user_id, role_id }
        });
        
        } catch (error) {
        console.error("Error in removing role:", error);
        res.status(500).json({
            msg: "An unexpected error occurred",
            error: "Internal Server Error"
        });
    }
};

module.exports = {
    assignRole,
    removeRole
}