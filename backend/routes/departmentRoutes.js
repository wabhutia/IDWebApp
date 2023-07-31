// Test file

const express = require('express');

const {
    getAllDepartments,
    addNewDepartment,
    removeDepartment,
    updateDepartment
} = require('../controllers/departmentController')

const router = express.Router();

// Department Routes
router.route("/")
    .get(getAllDepartments)
    .post(addNewDepartment)
    .delete(removeDepartment)
    .patch(updateDepartment)    

module.exports = router