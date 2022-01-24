const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');


module.exports.create = async function(req,res){
    try{
        let post = await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        let user = await User.findById(req.user._id);
        user.posts.push(post);
        user.save();
        req.flash('success','post published');
        return res.redirect('back');
    }catch(err){
        req.flash('error','cannot publish the post');
        console.log('Error',err);
        return;
    }
 }

module.exports.destroy = async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        //.id means converting the object id into string.
        //When we are comparing two object ids both of them should be in strings.
        if(post.user==req.user.id){ 
            post.remove();
            await User.findByIdAndUpdate(req.user._id,{$pull:{posts:req.params.id}});
            await Comment.deleteMany({post:req.params.id});
            req.flash('success','post deleted');
            return res.redirect('back');
        }
        else{
            req.flash('error','cant delete the post');
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error',err);
        req.flash('error','cant delete the post');
        return;
    } 
 }