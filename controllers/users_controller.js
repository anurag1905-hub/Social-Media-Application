const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req,res){
    User.findById(req.user,function(err,user){
        if(err){
            console.log('Error in finding the user');
            return res.redirect('back');
        }
        if(user){
            return res.render('profile',{
               profile_user:user
            });
        }
        else{
            return res.redirect('back');
        }
    });
}

module.exports.update = async function(req,res){
    try{
        if(req.user.id==req.params.id){
            let user = await User.findById(req.user._id);
            User.uploadedAvatar(req,res,function(err){
               if(err){
                   console.log('************Multer Error:',err);
                   return res.redirect('back');
               }
               user.name = req.body.name;
               user.email = req.body.email;
               if(req.file){

                   if(user.avatar){
                      fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                   }                
                   // this is saving the path of the uploaded file into the avatar field of the user.
                   user.avatar = User.avatarPath + '/' + req.file.filename;
               }
               user.save();
            });
            req.flash('success','Updated');
            return res.redirect('back');
        }
        else{
            req.flash('error','Unauthorized');
            return res.status(401).send('Unauthorized');
        }
    }catch(err){
        req.flash('error','Error');
        return res.redirect('/user/profile');
    }
}

//Render the login page
module.exports.login = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('login');
} 

//Render the Signup Page
module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('signup');
}

//get the sign up data
module.exports.create = function(req,res){
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log('Error in finding the user ',err);
            return res.redirect('back');
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('Error in creating the user ',err);
                    return res.redirect('back');
                }
                return res.redirect('/users/login');
            });
        }
        else{
            return res.redirect('/users/login');
        }
    });
}

module.exports.feed = function (req,res){
    return res.render('feed');
}

module.exports.posts = async function (req,res){
    try{
        let user = await User.findById(req.user._id)
        .populate({
            path:'posts',
            populate:[
                {
                    path:'comments',
                    populate:{
                        path:'user'
                    },
                },
                {
                    path:'user'
                }
           ],
           options:{
               sort:{createdAt:-1},
           }
        });
        return res.render('post',{
            profileUser:user
        });
    }catch(err){
        req.flash('error','Error');
        return res.redirect('/users/feed');
    }
}

module.exports.friends = function(req,res){
    return res.render('friend');
}

module.exports.messages = function(req,res){
    return res.render('message');
}

//sign in and create a session for the user.
module.exports.createSession = function(req,res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/users/feed');
}

//sign out the current signed in user
module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','Logged out Successfully');
    return res.redirect('/');
}

module.exports.editProfile = function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('edit_profile',{
            profile_user:user
        });
    });
}

module.exports.update = async function(req,res) {
    try{
        if(req.user.id==req.params.id){
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('****Multer Error:',err);
                    req.flash('error','Unable to update Profile');
                    return res.redirect('back');
                }
                //We are able to read req.body.name because of multer. Otherwise our form consists of multipart data and we won't be able to access it.
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){
                    if(user.avatar){
                        //If the user already has an avatar, remove it.
                        const p = path.join(__dirname,'..',user.avatar);
                       if(fs.existsSync(p)){
                          //If the file exists, remove it.
                       fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                       }
                    }
                    //this is saving the path of the uploaded file into the avatar field in the user.
                    user.avatar= User.avatarPath+'/'+req.file.filename;
                }
                user.save();
                req.flash('success','Profile Updated');
                return res.redirect('/users/profile/');
            });
        }
        else{
            req.flash('error','Unable to update Profile');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error','Unable to update Profile');
        return res.redirect('back');
    }
}



