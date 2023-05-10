const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const APIError = require("../utils/apiError");

exports.uploadSingleImage = (fieldName, prefix, path) => {
  const memoryStorage = multer.memoryStorage();

  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `static/images/${path}`);
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      const filename = `${prefix}-${uuidv4()}-${Date.now()}.${ext}`;
      req.body.image = filename;
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

  const upload = multer({ storage: diskStorage, fileFilter: multerFilter });

  return upload.single(fieldName);
};
