const express = require('express');

const auth = require("../middlewares/auth");
const verifyRoles = require("../middlewares/verifyRoles");
const { assignRole,removeRole } = require('../controllers/superAdminController')

const superAdminRouter = express.Router();

superAdminRouter.post('/assignrole', auth, verifyRoles('super_admin'), assignRole);
superAdminRouter.post('/removerole', auth, verifyRoles('super_admin'), removeRole);


module.exports = superAdminRouter;