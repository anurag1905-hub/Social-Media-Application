const Post = require('../models/post');
const User = require('../models/user');
//Render the home page 

// module.exports.home = function(req,res){
//     //populate the user of every post
//     Post.find({})
//     .populate('user')
//     .populate({
//         path:'comments',
//         populate:{
//             path:'user'
//         }
//     })
//     .exec(function(err,posts){
//         User.find({},function(err,users){
//             return res.render('home',{
//                 posts:posts,
//                 all_users:users
//             });
//         });
//     });
// }

module.exports.home = async function(req,res){
    try{
        let post = await  Post.find({})
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
            }
        });
    
        let users = await User.find({});
         
        return res.render('home',{
            posts:post,
            all_users:users
        });
    }catch(err){
        console.log('Error',err);
        return;
    }
}