const newUser = require("./newUser");
const loginUser = require("./loginUser");
const validateUser = require("./validateUser");
const getUser = require("./getUser");
const editAvatar = require("./editAvatar");
const editPassword = require("./editPassword");
const sendRecoverPassword = require("./sendRecoverPassword");
const editEmail = require("./editEmail");
const sendRecoverEmail = require("./sendRecoverEmail");

module.exports = {
  newUser,
  loginUser,
  validateUser,
  getUser,
  editAvatar,
  editPassword,
  sendRecoverPassword,
  editEmail,
  sendRecoverEmail,
};
