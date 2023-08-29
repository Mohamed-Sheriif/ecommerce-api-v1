const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  // DiskStorage engine gives you full control on storing files to disk.
  // const multerStorage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: (req, file, cb) => {
  //     // category-${uuid}-${date}.ext
  //     const ext = file.mimetype.split("/")[1];
  //     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, fileName);
  //   },
  // });
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    // Accept image only
    if (file.mimetype.startsWith("image")) {
      return cb(null, true);
    }
    return cb(
      new ApiError("Not an image! Please upload an image.", 400),
      false
    );
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMultipleImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
