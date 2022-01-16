const Post = require('../models/post');
const User = require('../models/user');
//Render the home page 

module.exports.home = function(req,res){
    // Post.find({},function(err,post){
    //     if(err){
    //         console.log('Error in finding the posts ',err);
    //         return;
    //     }
    //     else{
    //         return res.render('home',{
    //             posts:post
    //         });
    //     }
    // });
    //populate the user of every post
    Post.find({})
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        }
    })
    .exec(function(err,posts){
        if(err){
            console.log('Error in finding the posts ',err);
            return;
        }
        else{
            return res.render('home',{
                posts:posts
            });
        }
    });
}