const {
  Contact,
  addSchema,
  updateFavoriteSchema,
} = require("../models/contact");

const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    const errMessage = `missing required "${error.details[0].path[0]}" field`;
    throw HttpError(400, errMessage);
  }
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { error } = addSchema.validate(req.body);
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    throw HttpError(400, "missing fields");
  }
  if (error) {
    const errMessage = `missing required "${error.details[0].path[0]}" field`;
    throw HttpError(400, errMessage);
  }

  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { error } = updateFavoriteSchema.validate(req.body);
  if (error) {
    const errMessage = "missing field favorite";
    throw HttpError(400, errMessage);
  }

  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  console.log(result);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteContact: ctrlWrapper(deleteContact),
};
