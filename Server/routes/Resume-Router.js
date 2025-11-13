const express = require('express');
const router = express.Router();
const resumeController = require('../Controller/Resume-Controller');
const uploadImages = require('../Controller/Upload-Images');
const authMiddleware = require('../middleware/User-Middleware');
const upload = require('../middleware/Upload-middleware');


//Routes
router.route('/').post(authMiddleware, resumeController.createResume);

router.route('/').get(authMiddleware, resumeController.getResumes);
router.route('/:id').get(authMiddleware, resumeController.getResumeById);

router.route('/:id').put(authMiddleware, resumeController.updateResume);
router.route('/:id/upload-image').put( authMiddleware,  uploadImages.uploadProfileImage);

router.route('/:id').delete(authMiddleware, resumeController.deleteResume);

module.exports = router;