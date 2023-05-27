const categoryRoute = require("./categoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const brandRoute = require("./brandRoute");
const productRoute = require("./productRoute");
const reviewRoute = require("./reviewRoute");
const favoritesRoute = require("./favoritesRoute");
const promoCodeRoute = require("./promoCodeRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/favorites", favoritesRoute);
  app.use("/api/v1/promoCodes", promoCodeRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
};

module.exports = mountRoutes;
