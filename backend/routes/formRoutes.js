const express = require('express');

const {
    getAllForms,
    addForm,
    removeForm
    //updateForm
} = require('../controllers/formController');

const router = express.Router();

router.route("/")
    .get(getAllForms)
    .post(addForm)
    .delete(removeForm)
//.patch(updateForm)    

module.exports = router