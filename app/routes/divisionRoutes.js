const express = require('express');
const auth = require("../middlewares/auth");
const verifyRoles = require("../middlewares/verifyRoles");

const {
    getAllDivisions,
    addDivision,
    removeDivision,
    updateDivision 
} = require('../controllers/divisionController');
    
const router = express.Router();

router.get("/", getAllDivisions);
router.post("/addDivision", auth, verifyRoles("department_verifier", "super_admin"), addDivision);
router.delete("/removeDivision", auth, verifyRoles("department_verifier", "super_admin"), removeDivision);
router.patch("/updateDivision", auth, verifyRoles("department_verifier", "super_admin"), updateDivision);

module.exports = router;