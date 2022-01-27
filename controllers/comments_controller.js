const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');

module.exports.create = async function(req,res){
    try{
        let post = await Post.findById(req.body.post);

        if(post){
            let c = await Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:post._id
            });
            let comment = await Comment.findById(c._id).populate('user');
            commentsMailer.newComment(comment);
            let obj = {
                name:req.user.name,
                time:post.createdAt.toDateString(),
            };
            post.comments.push(comment);
            post.save();
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment:comment,
                        obj:obj,
                        post:post
                    },
                    message:"Comment Created!"
                });
            }
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error',err);
        return;
    }
}

module.exports.destroy = async function(req,res){
    try{
    let comment = await Comment.findById(req.params.id);
    if(comment&&(comment.user==req.user.id)){
        let postId = comment.post;
        comment.remove();
        let post = await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});
        if(req.xhr){
            return res.status(200).json({
                data:{
                    comment_id:req.params.id
                },
                message:"Comment removed"
            });
        }
        return res.redirect('back');
    }
    else{
        req.flash('error','Unable to delete comment');
        return res.redirect('back');
    }
    }catch(err){
        req.flash('error','Unable to delete comment');
        return res.redirect('back');
    }
}

