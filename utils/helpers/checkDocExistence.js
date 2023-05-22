const APIError = require("../apiError");

const checkDocExistance = async (Model, key, val) => {
  let doc;
  if (key == "id") {
    doc = await Model.findById(val);
  }
  if (key == "email") {
    doc = await Model.findOne({ email: val });
  }
  if (!doc) {
    return new APIError(`no ${Model.modelName} of ${key}: ${val} exists`, 404);
  }
  return doc;
};

module.exports = checkDocExistance;
