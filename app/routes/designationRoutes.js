const express = require('express');

const {
    getAllDesignations,
    addDesignation,
    removeDesignation,
    updateDesignation
} = require('../controllers/designationController');

const router = express.Router();

router.route("/")
    .get(getAllDesignations)
    .post(addDesignation)
    .delete(removeDesignation)
    .patch(updateDesignation)    

module.exports = router