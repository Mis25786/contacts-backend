const express = require("express");

const controllers = require("../../controllers/contacts");
const { isValidId } = require("../../middlewares");

const router = express.Router();

router.get("/", controllers.getAll);

router.get("/:id", isValidId, controllers.getById);

router.post("/", controllers.addContact);

router.put("/:id", isValidId, controllers.updateContact);

router.patch("/:id/favorite", isValidId, controllers.updateFavorite);

router.delete("/:id", isValidId, controllers.deleteContact);

module.exports = router;
