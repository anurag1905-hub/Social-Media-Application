const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/users/feed');
    }
    else{
       let profileUser = await User.findOne({email:'myselfanuragharsh@gmail.com'})
       .populate({
            path:'posts',
            populate:[
               {
                     path:'comments',
                     populate:[
                        {
                           path:'user'
                        },
                        {
                           path:'likes'
                        }
                     ],
               },
               {
                     path:'user'
               },
               {
                     path:'likes'
               }
            ],
            options:{
               sort:{createdAt:-1},
            }
       });
     console.log(profileUser);
     return res.render('landingPage',{
        profileUser:profileUser
     });
    }
}