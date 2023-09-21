const express = require('express');
const auth = require("../middlewares/auth");
const { getForm, createForm, removeForm} = require('../controllers/formController');
//, updateForm - Pending 

const formRouter = express.Router(); 

formRouter.get("/", auth, getForm);
formRouter.post("/", auth, createForm);
formRouter.delete("/:id", auth, removeForm);
// formRouter.put("/:id", auth, updateForm);


module.exports = formRouter