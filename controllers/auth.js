const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;
console.log("SECRET_KEY :>> ", SECRET_KEY);

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  // console.log(newUser);

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
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

  // повертаємо токен
  res.json({ token });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
};
