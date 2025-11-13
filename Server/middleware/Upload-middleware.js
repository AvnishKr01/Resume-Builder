// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'upload/')
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// })

// // File filter to allow only images
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']; 
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     }   else {
//         cb(new Error('Only .jpeg, .jpg and .png files are allowed'), false);
//     }
// }

// const upload = multer({ storage, fileFilter });

// module.exports = upload;    


const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(process.cwd(), 'upload');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only jpeg, jpg, png files allowed'), false);
};

module.exports = multer({ storage, fileFilter }); // ✅ correct export
