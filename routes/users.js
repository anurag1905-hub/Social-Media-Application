const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/signup',usersController.signup);
router.get('/login',usersController.login);
router.post('/create',usersController.create);
router.get('/feed',usersController.feed);
router.get('/posts',usersController.posts);
router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update);
router.get('/signout',usersController.destroySession);


// Use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/login'}
),usersController.createSession);

module.exports = router;

