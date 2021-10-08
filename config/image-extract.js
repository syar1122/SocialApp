const multer = require('multer');

const MIME_TYPE = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    const isValid = MIME_TYPE[file.mimetype];
    let err = new Error('Invalid mime type. /n (png, jpg, jpeg) are valid type');
    if(isValid){
      err = null;
    }
    cb(err, "bucket/images/");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_').split('.')[0];
    const ext = MIME_TYPE[file.mimetype];
    cb(null,name + '_' + Date.now() + '.' + ext);
  }
});

module.exports = multer({storage:storage}).single("image");