const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../utils/s3");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    key: function (req, file, cb) {
      const userId = req.user.id;
      const featureFolder = req.body.featureFolder || "ai design generation"; // default folder name
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, `${userId}/${featureFolder}/${fileName}`);
    },
  }),
});

module.exports = upload;
