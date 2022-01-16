const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req,res){
    Post.findById(req.body.post,function(err,post){
        if(err){
            console.log('The post for which comment is intended could not be found ',err);
            return;
        }
        else{
            Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:post._id
            },function(err,comment){
                if(err){
                    console.log('Error in creating the comment',err);
                    return;
                }
                else{
                    post.comments.push(comment);
                    post.save();
                    return res.redirect('back');
                }
            })
        }
    });
}