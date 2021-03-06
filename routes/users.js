const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/signup',usersController.signup);
router.get('/login',usersController.login);
router.post('/create',usersController.create);
router.get('/feed',passport.checkAuthentication,usersController.feed);
router.get('/posts',passport.checkAuthentication,usersController.posts);
router.get('/messages',passport.checkAuthentication,usersController.messages);
router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.get('/logout',passport.checkAuthentication,usersController.destroySession);
router.get('/edit_profile/:id',passport.checkAuthentication,usersController.editProfile);
router.post('/update/:id',passport.checkAuthentication,usersController.update);
router.use('/friends',require('./friends'));

// Use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/login'}
),usersController.createSession);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/login'}),usersController.createSession);
router.get('/reset-password',usersController.reset);
router.post('/reset-password',usersController.sendResetLink);
router.get('/reset-password/:token',usersController.resetPassword);
router.post('/changePassword/:token',usersController.changePassword);
router.get('/chatbox',passport.checkAuthentication,usersController.chatbox);
router.get('/verify-email/:token',usersController.verifyUserEmail);


router.get('*',function(req,res){
   return res.render('notification-template',{
      message:"Not Found!"
   });
});

module.exports = router;

