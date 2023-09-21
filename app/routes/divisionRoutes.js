const express = require('express');

const {
    getAllDivisions,
    addDivision,
    removeDivision,
    updateDivision 
} = require('../controllers/divisionController')
    
const router = express.Router();

router.route("/")
    .get(getAllDivisions)
    .post(addDivision)
    .delete(removeDivision)
    .patch(updateDivision)

module.exports = router;