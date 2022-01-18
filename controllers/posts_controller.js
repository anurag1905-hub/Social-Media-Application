const Post = require('../models/post');
const Comment = require('../models/comment');

// module.exports.create = function(req,res){
//    Post.create({
//        content:req.body.content,
//        user:req.user._id
//    },function(err,post){
//        if(err){
//            console.log('Error in creating a post',err);
//            return;
//        }
//        return res.redirect('back');
//    });
// }

module.exports.create = async function(req,res){
    try{
        let post = await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        req.flash('success','post published');
        return res.redirect('back');
    }catch(err){
        req.flash('error','cannot publish the post');
        console.log('Error',err);
        return;
    }
 }
 

// module.exports.destroy = function(req,res){
//    Post.findById(req.params.id,function(err,post){
//        //.id means converting the object id into string.
//        //When we are comparing two object ids both of them should be in strings.
//       if(post.user==req.user.id){ 
//           post.remove();
//           Comment.deleteMany({post:req.params.id},function(err){
//              return res.redirect('back');
//           });
//       }
//       else{
//         return res.redirect('back');
//       }
//    });
// }

module.exports.destroy = async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        //.id means converting the object id into string.
        //When we are comparing two object ids both of them should be in strings.
        if(post.user==req.user.id){ 
            post.remove();
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