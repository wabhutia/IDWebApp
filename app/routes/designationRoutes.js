const express = require('express');
const auth = require("../middlewares/auth");
const verifyRoles = require("../middlewares/verifyRoles");

const {
    getAllDesignations,
    addDesignation,
    removeDesignation,
    updateDesignation
} = require('../controllers/designationController');

const router = express.Router();   

router.get("/",getAllDesignations);
router.post("/", auth, verifyRoles("super_admin", "home_admin"), addDesignation);
router.delete("/", auth, verifyRoles("super_admin"), removeDesignation);
router.patch("/", auth, verifyRoles("super_admin"), updateDesignation);

module.exports = router