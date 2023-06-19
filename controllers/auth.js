const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

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

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
};
