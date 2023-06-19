const express = require("express");

const controllers = require("../../controllers/contacts");
const { isValidId, authenticate } = require("../../middlewares");

const router = express.Router();

router.get("/", authenticate, controllers.getAll);

router.get("/:id", authenticate, isValidId, controllers.getById);

router.post("/", authenticate, controllers.addContact);

router.put("/:id", authenticate, isValidId, controllers.updateContact);

router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  controllers.updateStatusContact
);

router.delete("/:id", authenticate, isValidId, controllers.deleteContact);

module.exports = router;
