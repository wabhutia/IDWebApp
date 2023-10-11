const express = require('express');
const auth = require("../middlewares/auth");
const verifyRoles = require("../middlewares/verifyRoles");
const { getForm, createForm, getFormStatus, removeForm, getAllForms} = require('../controllers/formController');
//, updateForm - Pending 

const formRouter = express.Router(); 

// ----X---- USER ROLES ----X----
formRouter.post("/", auth, verifyRoles("user"), createForm);
// formRouter.put("/:id", auth, updateForm);
formRouter.get("/getformstatus", auth, verifyRoles("user"), getFormStatus);

// ----X---- ADMIN ROLES ----X----
formRouter.get("/", auth, getForm);
formRouter.get("/allForms", auth, verifyRoles("super_admin"), getAllForms);
formRouter.delete("/", auth, verifyRoles("super_admin"), removeForm);

module.exports = formRouter