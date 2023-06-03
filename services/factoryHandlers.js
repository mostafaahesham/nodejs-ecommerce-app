const asyncHandler = require("express-async-handler");

const checkDocExistence = require("../utils/helpers/checkDocExistence");
const ApiFeatures = require("../utils/apiFeatures");
const APIError = require("../utils/apiError");

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ data: doc });
  });

exports.getOne = (Model, populationOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populationOptions) {
      query = query.populate(populationOptions);
    }
    const doc = await query;
    if (!doc) {
      throw new APIError(
        `no ${Model.modelName} of id: ${req.params.id} exists`,
        404
      );
    }
    res.status(200).json({ data: doc });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const count = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(count)
      .filter()
      .limitFields()
      .sort()
      .search();
    const { mongooseQuery, paginationResult } = apiFeatures;

    const docs = await mongooseQuery;
    res
      .status(200)
      .json({ paginationResult, results: docs.length, data: docs });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    let doc = await checkDocExistence(Model, "id", req.params.id);
    doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ data: doc });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    await checkDocExistence(Model, "id", req.params.id);
    await Model.findOneAndRemove(req.params.id);

    res
      .status(200)
      .json({ msg: `${Model.modelName} of id ${req.params.id} deleted` });
  });
