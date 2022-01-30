const express = require('express');
const router = express.Router();
const passport = require('passport');

const friendsController = require('../controllers/friends_Controller');

router.get('/showFriends',passport.checkAuthentication,friendsController.showFriends);
router.get('/suggestions',passport.checkAuthentication,friendsController.users);
router.get('/requests',passport.checkAuthentication,friendsController.requests);

module.exports = router;