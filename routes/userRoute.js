const express = require("express");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../services/userService");
const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  createUserValidator,
} = require("../utils/validators/userValidator");


const router = express.Router();

router
  .route("/")
  .get(getUsers)
  .post(createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
