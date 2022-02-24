const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');

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

        let post = await Post.create({
            content:req.body.content,
            user:req.user._id,
            time:time
        });
        
        let profileUser = await User.findById(req.user._id);
        let obj = {
            name:req.user.name,
            time:post.createdAt.toDateString(),
            profileUser:profileUser
        };
        let user = await User.findById(req.user._id);
        user.posts.push(post);
        user.save();
        if(req.xhr){
            return res.status(200).json({
                data:{
                    post:post,
                    obj:obj
                },
                message:"Post Created!"
            });
        }
        req.flash('success','post published');
        return res.redirect('back');
    }catch(err){
        req.flash('error','cannot publish the post');
        return;
    }
 }

module.exports.destroy = async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        //.id means converting the object id into string.
        //When we are comparing two object ids both of them should be in strings.
        if(post.user==req.user.id){ 

            //We need to delete the associated likes for the post and all its comment's likes too.

            await Like.deleteMany({likeable:post._id,onModel:'Post'});

            //delete all the likes associated with every comment of the post.
            //To revise about the syntax: https://stackoverflow.com/questions/17826082/how-to-delete-multiple-ids-in-mongodb/17828822

            await Like.deleteMany({_id:{$in:post.comments}});

            await User.findByIdAndUpdate(req.user._id,{$pull:{posts:req.params.id}});
            await Comment.deleteMany({post:req.params.id});
            post.remove();
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:"Post removed"
                });
            }
            req.flash('success','post deleted');
            return res.redirect('back');
        }
        else{
            req.flash('error','cant delete the post');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error','cant delete the post');
        return;
    } 
 }

 module.exports.edit = function(req,res){
     return res.redirect('back');
 }

 module.exports.save = async function(req,res){
     let postId = req.query.id;
     let newContent = decodeURI(req.query.content);
     let post = await Post.findById(postId);
     if(!post||post.user!=req.user.id){
        if(req.xhr){
            return res.status(200).json({
                data:{
                    
                },
                message:"Error"
            });
         }
         return res.redirect('back');
     }
     else{
         post.content = newContent;
         post.save();
         if(req.xhr){
            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post Saved"
            });
         }
         return res.redirect('back');
     }
 }