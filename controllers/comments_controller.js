const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const User = require('../models/user');

const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');

module.exports.create = async function(req,res){
    try{

        let date = new Date();
        let hours = date.getHours().toString();
        if(hours.length==1){
            hours="0"+hours;
        }

        let minutes = date.getMinutes().toString();
        if(minutes.length==1){
            minutes="0"+minutes;
        }

        let seconds = date.getSeconds().toString();
        if(seconds.length==1){
            seconds="0"+seconds;
        }
        let time = hours+":"+minutes+":"+seconds;
        
        let post = await Post.findById(req.body.post).populate('user');

        if(post){
            let comment = await Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:post._id,
                time:time
            });
            let profileUser = await User.findById(req.user._id);
            let job = queue.create('emails',post).save(function(err){
               if(err){
                   console.log('Error in creating a queue');
               }
               else{
                   console.log(job.id);
               }
            });
            let obj = {
                name:req.user.name,
                time:post.createdAt.toDateString(),
                avatar:profileUser.avatar
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
        console.log(req.params.id);
        let comment = await Comment.findById(req.params.id);
        if(comment&&(comment.user==req.user.id)){
            let postId = comment.post;
            let post = await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});
            //destroy the associated likes for this comment
            await Like.deleteMany({likeable:comment._id,onModel:'Comment'});
            comment.remove();
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

