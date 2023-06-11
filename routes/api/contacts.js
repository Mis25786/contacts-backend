const express = require("express");

const controllers = require("../../controllers/contacts");

const router = express.Router();

router.get("/", controllers.getAll);

router.get("/:id", controllers.getById);

router.post("/", controllers.addContact);

router.put("/:id", controllers.updateContact);

router.delete("/:id", controllers.deleteContact);

module.exports = router;
