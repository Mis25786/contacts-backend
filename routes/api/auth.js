const express = require("express");

const ctrl = require("../../controllers/auth");
const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

// signup регістрація
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

// верифікація емейлу при регістрації
router.get("/verify/:verificationCode", ctrl.verifyEmail);

// повторне відправлення емаіл якщо не прийшло
router.post(
  "/verify",
  validateBody(schemas.emailSchema),
  ctrl.resendVerifyEmail
);

// signin логін
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

// виходимо із акаунта
router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
