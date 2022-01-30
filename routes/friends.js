const express = require('express');
const router = express.Router();
const passport = require('passport');

const friendsController = require('../controllers/friends_Controller');

router.get('/showFriends',passport.checkAuthentication,friendsController.showFriends);
router.get('/suggestions',passport.checkAuthentication,friendsController.users);
router.get('/requestsSent',passport.checkAuthentication,friendsController.requestsSent);
router.get('/requestsReceived',passport.checkAuthentication,friendsController.requestsReceived);
router.get('/sendRequest/:id',passport.checkAuthentication,friendsController.sendRequest);
router.get('/withdrawRequest/:id',passport.checkAuthentication,friendsController.withdrawRequest);
router.get('/rejectRequest/:id',passport.checkAuthentication,friendsController.rejectRequest);

module.exports = router;