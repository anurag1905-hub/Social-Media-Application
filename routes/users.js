const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/signup',usersController.signup);
router.get('/login',usersController.login);
router.post('/create',usersController.create);
router.get('/feed',passport.checkAuthentication,usersController.feed);
router.get('/posts',passport.checkAuthentication,usersController.posts);
router.get('/friends',passport.checkAuthentication,usersController.friends);
router.get('/messages',passport.checkAuthentication,usersController.messages);
router.get('/profile',passport.checkAuthentication,usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update);
router.get('/signout',passport.checkAuthentication,usersController.destroySession);


// Use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/login'}
),usersController.createSession);

module.exports = router;

