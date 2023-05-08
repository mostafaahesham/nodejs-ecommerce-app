const asyncHandler = require("express-async-handler");
const APIError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ data: doc });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(
        new APIError(`No ${Model.modelName} of id ${req.params.id} exists`, 404)
      );
    }
    res.status(200).json({ data: doc });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    const apiFeatures = new ApiFeatures(Model.find(), req.query)
      .search()
      .paginate()
      .filter()
      .limitFields()
      .sort();

    const docs = await apiFeatures.mongooseQuery;
    res.status(200).json({ results: docs.length, data: docs });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc) {
      return next(
        new APIError(`No ${Model.modelName} of id ${req.params.id} exists`, 404)
      );
    }
    res.status(200).json({ data: doc });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(
        new APIError(`No ${Model.modelName} of id ${id} exists`, 404)
      );
    }
    res.status(200).json({ msg: `${Model.modelName} of id ${id} deleted` });
  });
