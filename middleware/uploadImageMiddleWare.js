const multer = require("multer");
const APIError = require("../utils/apiError");
const { v4: uuidv4 } = require("uuid");

exports.uploadSingleImage = (fieldName) => {
  const memoryStorage = multer.memoryStorage();

  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "static/images/categories");
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
      cb(null, filename);
    },
  });

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith(fieldName)) {
      cb(null, true);
    } else {
      cb(new APIError("Invalid file Format", 404), false);
    }
  };

  const upload = multer({ storage: memoryStorage, fileFilter: multerFilter });

  return upload.single(fieldName);
};
