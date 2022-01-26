const express = require('express');
const router = express.Router();
const passport = require('passport');

const comments_Controller = require('../controllers/comments_controller');

router.post('/create',passport.checkAuthentication,comments_Controller.create);
router.get('/destroy/:id',passport.checkAuthentication,comments_Controller.destroy);

module.exports = router;