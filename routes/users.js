const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users_controller');

router.get('/signup',usersController.signup);
router.get('/login',usersController.login);
router.post('/create',usersController.create);

module.exports = router;

