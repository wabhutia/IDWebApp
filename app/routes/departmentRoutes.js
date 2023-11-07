// Test file
const express = require('express');
const auth = require("../middlewares/auth");
const verifyRoles = require("../middlewares/verifyRoles");

const {
    getAllDepartments,
    addNewDepartment,
    removeDepartment,
    updateDepartment
} = require('../controllers/departmentController');
// const { verify } = require('crypto');

const router = express.Router();

// Department Routes
router.get("/",getAllDepartments);
router.post("/", auth, verifyRoles("super_admin", "home_admin"), addNewDepartment);
router.delete("/", auth, verifyRoles("super_admin"), removeDepartment);
router.patch("/", auth, verifyRoles("super_admin"), updateDepartment);

module.exports = router