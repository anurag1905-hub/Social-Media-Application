const express = require('express');
const router = express.Router();
const passport = require('passport');

const comments_Controller = require('../controllers/comments_controller');

router.post('/create',passport.checkAuthentication,comments_Controller.create);
router.get('/destroy/:id',passport.checkAuthentication,comments_Controller.destroy);
router.get('/edit',passport.checkAuthentication,comments_Controller.edit);
router.get('/save',passport.checkAuthentication,comments_Controller.save);


router.get('*',function(req,res){
    return res.render('notification-template',{
       message:"Not Found!"
    });
 });

module.exports = router;