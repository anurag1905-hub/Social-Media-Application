const express = require('express');
const router = express.Router();


const homeController = require('../controllers/home_controller');

router.get('/',homeController.home);

router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/likes',require('./likes'));
router.use('/comments',require('./comments'));

router.get('*',function(req,res){
    return res.render('notification-template',{
       message:"Not Found!"
    });
 });

module.exports = router;