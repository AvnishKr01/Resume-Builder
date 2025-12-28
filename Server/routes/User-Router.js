const express = require('express');
const router = express.Router();
const userController = require('../Controller/User-Controller');
const authMiddleware = require('../middleware/User-Middleware')

//Routes   
router.route('/register').post(userController.Register);
router.route('/login').post(userController.Login);

// Protecting routes can be done here using middleware
router.route('/getprofile').get(authMiddleware, userController.GetUserProfile);

module.exports = router;