const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');
console.log('Reached');
router.post('/create',passport.checkAuthentication,postsController.create);

module.exports = router;