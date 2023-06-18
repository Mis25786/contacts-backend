const { User } = require("../models/user");
// const { User, registerSchema, loginSchema } = require("../models/user");

const { ctrlWrapper } = require("../helpers");

const register = async (req, res) => {
  const newUser = await User.create(req.body);
  console.log(newUser);

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

module.exports = {
  register: ctrlWrapper(register),
};
