const APIError = require("../apiError");

const checkDocExistance = async (Model, key, val) => {
  let doc;
  switch (key) {
    case "id":
      doc = await Model.findById(val);
      break;
    case "email":
      doc = await Model.findOne({ email: val });
      break;
    default:
      break;
  }
  if (!doc) {
    console.log(doc);
    throw new APIError(`no ${Model.modelName} of ${key}: ${val} exists`, 404);
  }
  return doc;
};

module.exports = checkDocExistance;
