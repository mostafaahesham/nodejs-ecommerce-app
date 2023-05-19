const asyncHandler = require("express-async-handler");
const APIError = require("../apiError");

const checkDocumentExistance = async (Model, id) => {
    const doc = await Model.findById(id);
    if (!doc) {
      throw new APIError(`No ${Model.modelName} of id ${id} exists`, 404);
    }
    return doc;
  };

module.exports = checkDocumentExistance;
