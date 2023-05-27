const factory = require("./factoryHandlers");
const promoCodeModel = require("../models/promoCodeModel");

// @desc    Create promo code
// @route   POST    /api/v1/promocodes
// @access  Private
exports.createPromoCode = factory.createOne(promoCodeModel);

// @desc    Get specific promo code by id
// @route   GET /api/v1/promocodes/:id
// @access  Private
exports.getPromoCode = factory.getOne(promoCodeModel);

// @desc    Get List of promo coded
// @route   GET /api/v1/promocodes
// @access  Private
exports.getPromoCodes = factory.getAll(promoCodeModel);

// @desc    Update Specific promo code
// @route   PUT    /api/v1/promocodes/:id
// @access  Private
exports.updatePromoCode = factory.updateOne(promoCodeModel);

// @desc    Delete Specific promo code
// @route   DELETE    /api/v1/promocodes/:id
// @access  Private
exports.deletePromoCode = factory.deleteOne(promoCodeModel);
