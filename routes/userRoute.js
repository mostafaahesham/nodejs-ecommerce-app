const express = require("express");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  uploadUserImage,
} = require("../services/userService");
const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  createUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");

const auth = require("../services/authService");

const router = express.Router();

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
