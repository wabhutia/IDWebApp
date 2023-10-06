const express = require('express');
const auth = require("../middlewares/auth");
const verifyRoles = require("../middlewares/verifyRoles");
const { getForm, createForm, getFormStatus, removeForm, getAllForms} = require('../controllers/formController');
//, updateForm - Pending 

const formRouter = express.Router(); 

formRouter.get("/", auth, getForm);
formRouter.post("/", auth, verifyRoles("user"), createForm);
// formRouter.put("/:id", auth, updateForm);
formRouter.get("/getformstatus", auth, verifyRoles("user"), getFormStatus);

// ----X---- ADMIN ROLES ----X----
formRouter.get("/allForms", auth, verifyRoles("admin"), getAllForms);
formRouter.delete("/", auth, verifyRoles("admin"), removeForm);

module.exports = formRouter