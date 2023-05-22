const express = require("express");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
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

router.use(auth.authenticate, auth.authorize("admin", "vendor", "user"));

router.get("/getme", getLoggedUserData, getUserValidator, getUser);
router.put("/changemymassword", updateLoggedUserPassword);
router.put(
  "/updateme",
  uploadUserImage,
  updateLoggedUserData,
  updateUserValidator,
  updateUser
);
router.delete("/deleteme", deleteLoggedUserData);

router.use(auth.authorize("admin"));

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
