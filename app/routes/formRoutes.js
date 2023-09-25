const express = require('express');
const auth = require("../middlewares/auth");
const verifyRoles = require("../middlewares/verifyRoles");
const { getForm, createForm, removeForm, getAllForms} = require('../controllers/formController');
//, updateForm - Pending 

const formRouter = express.Router(); 

formRouter.get("/", auth, getForm);
formRouter.post("/", auth, createForm);
formRouter.delete("/:id", auth, verifyRoles("admin"), removeForm);
// formRouter.put("/:id", auth, updateForm);
formRouter.get("/allForms", auth,verifyRoles("admin"), getAllForms);


module.exports = formRouter