const express = require('express');
const auth = require("../middlewares/auth");
const verifyRoles = require("../middlewares/verifyRoles");
const { getAssociatedForms, getFormsForIssuance } = require('../controllers/formMovementController');

const formMovementRouter = express.Router(); 

formMovementRouter.get('/', auth, verifyRoles('home_admin', 'home_verifier', 'department_verifier', 'divisional_verifier'), getAssociatedForms);
formMovementRouter.get('/issuance', auth, verifyRoles('home_verifier'), getFormsForIssuance);

// Approval and rejection
// formMovementRouter.post();


module.exports = formMovementRouter;