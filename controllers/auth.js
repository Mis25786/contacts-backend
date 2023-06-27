const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
// const jimp = require("jimp");
const { v4 } = require("uuid");

const { User } = require("../models/user");

// const { HttpError, ctrlWrapper } = require("../helpers");
const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

// const { SECRET_KEY } = process.env;
const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email); // генеруємо тимчасаву аватарку
  const verificationCode = v4();
  console.log("verificationCode", verificationCode);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode, // записали юзера в базу
  });
  console.log("newUser", newUser);

  // створюємо емейл для підтвердження
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    // html: `<a target="_blank" href="https://contacts-backend-8yby.onrender.com/auth/verify/${verificationCode}" >Click verify email</a>`,
    html: `<a target="_blank" href="${BASE_URL}/auth/verify/${verificationCode}" >Click verify email</a>`,
  };

  await sendEmail(verifyEmail); // відсилаємо підтвердження

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const verifyEmail = async (req, res) => {
  // в контролері емейл береме останню частину код
  const { verificationCode } = req.params;

  const user = await User.findOne({ verificationCode });

  // дивимось чи така людина є якщо ні викидаємо помилку
  if (!user) {
    throw HttpError(401, "Email not found");
  }

  // якщо є то оновлюємо базу данних
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });

  // відправляємо повідомлення що веріфікація пройдена
  res.json({
    message: "Email verify success",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // провіряємо чи є в базі юзер який пробується залогінити
  const user = await User.findOne({ email });
  console.log("user :>> ", user);

  // якщо ні виводимо помилку
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  // провіряємо чи людина підтвердила емаіл при регістрації
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  // якщо є то порівнюємо пароль що прийшов з тим що в базі
  const passwordCompare = await bcrypt.compare(password, user.password);

  // якщо паролі не співпадають виводимо помилку
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  // якщо співпадають записуємо ід користувача
  const payload = {
    id: user._id,
  };

  // якщо співпадають створюємо хешований токен
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  // повертаємо токен
  res.json({ token });
};

const getCurrent = async (req, res) => {
  const { name, email } = req.user;

  res.json({
    name,
    email,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout successful",
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`; // додаємо до імені ід

  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
