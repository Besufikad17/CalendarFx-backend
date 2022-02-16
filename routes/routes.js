const express = require('express');
const router = express.Router();
const auth_middleware = require('../middleware/auth');
const auth = require('./auth');
const userController = require('../controller/userController');
const apiController = require('../controller/apiController');


//user end points

router.post('/auth', auth.auth);
router.get('/user', auth_middleware.auth, auth.getCurrentUser);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.put('/update', userController.updateProfile);
router.put('/change_password', userController.changePassword);

// admin end points

router.get('/users', userController.getAllUsers);
router.get('/user/id/:id',  userController.getUserById);
router.get('/user/:username',  userController.getUserByUsername);
router.delete('/remove', userController.removeUser);


//api end points

router.get('/current', auth_middleware.auth_api_key, apiController.getCurrentDate);
router.get('/previous_year', auth_middleware.auth_api_key, apiController.getPreviousYear);
router.get('/next_year', auth_middleware.auth_api_key, apiController.getNextYear);
router.get('/previous_month', auth_middleware.auth_api_key, apiController.getPreviousMonth);
router.get('/next_month', auth_middleware.auth_api_key, apiController.getNextMonth);
router.get('/evange', auth_middleware.auth_api_key, apiController.getEvange);
router.get('/holidays', auth_middleware.auth_api_key, apiController.getAllHolidays);
router.get('/to_geez/', auth_middleware.auth_api_key, apiController.toGeez);

router.post('/toEC', apiController.toEC);

module.exports = router;
