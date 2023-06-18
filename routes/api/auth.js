const express = require("express");

const controllers = require("../../controllers/auth");
const isValidId = require("../../middlewares/isValidId");
// const { schemas } = require("../../models/user");

const router = express.Router();

router.post("/register", isValidId, controllers.register);

module.exports = router;
