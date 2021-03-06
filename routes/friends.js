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
router.get('/acceptRequest/:id',passport.checkAuthentication,friendsController.acceptRequest);
router.get('/removeFriend/:id',passport.checkAuthentication,friendsController.removeFriend);
router.get('/getFriends/:id',passport.checkAuthentication,friendsController.getFriends);
router.get('/sendMessage/:id',passport.checkAuthentication,friendsController.sendMessage);



router.get('*',function(req,res){
    return res.render('notification-template',{
       message:"Not Found!"
    });
 });

module.exports = router;