const { User, registerSchema, loginSchema } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    const errMessage = `missing required "${error.details[0].path[0]}" field`;
    throw HttpError(400, errMessage);
  }

  const newUser = await User.create(req.body);

  res.json({
    email: newUser.email,
    name: newUser.name,
  });
};

module.exports = {
  register: ctrlWrapper(register),
};
