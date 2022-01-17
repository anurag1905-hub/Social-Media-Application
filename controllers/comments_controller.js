const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req,res){
    Post.findById(req.body.post,function(err,post){
        if(err||!post){
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

module.exports.destroy = function(req,res){
    Comment.findById(req.params.id,function(err,comment){
       if(comment.user==req.user.id){
           let postId = comment.post;
           comment.remove();
           Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post){
              return res.redirect('back');
           });
       }
       else{
        return res.redirect('back');
       }
    });
}
