const express = require("express");

const controllers = require("../../controllers/auth");
const { validateBody } = require("../../middlewares");
console.log("validateBody-fc :>> ", validateBody);
const { schemas } = require("../../models/user");
// console.log("schemas :>> ", schemas);

const router = express.Router();

// router.post("/register", isValidId, controllers.register);
router.post(
  "/register",
  validateBody(schemas.registerSchema),
  controllers.register
);

module.exports = router;
