const express = require('express');

const { signUp, signIn, addEmployeeDetails } = require('../controllers/userController')
const auth = require("../middlewares/auth");
const verifyRoles = require("../middlewares/verifyRoles");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/employeedetails", auth, verifyRoles("user"), addEmployeeDetails);

module.exports = router