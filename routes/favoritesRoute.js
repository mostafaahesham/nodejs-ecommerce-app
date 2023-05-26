const express = require("express");

const {
  updateFavorites,
  getLoggedUserFavorites,
} = require("../services/favoritesService");
const {
  updateFavoritesValidator,
} = require("../utils/validators/favoritesValidator");

const auth = require("../services/authService");

const router = express.Router();

router.use(auth.authenticate, auth.authorize("user"));

router
  .put("/:productId", updateFavoritesValidator, updateFavorites)
  .get("/", getLoggedUserFavorites);

module.exports = router;
