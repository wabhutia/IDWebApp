const express = require('express');

const auth = require("../middlewares/auth");
const verifyRoles = require("../middlewares/verifyRoles");
const { signUp, signIn, logOut, addEmployeeDetails } = require('../controllers/userController')


const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", auth, logOut);
router.post("/employeedetails", auth, verifyRoles("user"), addEmployeeDetails);

module.exports = router