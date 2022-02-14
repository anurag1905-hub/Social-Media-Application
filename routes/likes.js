const express = require('express');
const router = express.Router();

const likesController = require('../controllers/likes_controller');

router.post('/toggle',likesController.toggleLike);

router.get('*',function(req,res){
    return res.render('notification-template',{
       message:"Not Found!"
    });
 });

module.exports = router;