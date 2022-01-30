const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const resetPassword = require('../models/reset-password');
const jwt = require('jsonwebtoken');  // Used to generate the token.
const queue = require('../config/kue');
const resetPasswordWorker = require('../workers/reset_password_worker');

module.exports.profile = async function(req,res){
    let user = await User.findById(req.params.id).populate('haveSent.$*').populate('haveReceived.$*');
    let requestReceived = user.haveSent.get(req.user.id);
    let requestSent = user.haveReceived.get(req.user.id);
        
    return res.render('profile',{
        profile_user:user,
        requestSent:requestSent,
        requestReceived:requestReceived
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
                return res.redirect(`../../users/profile/${req.user._id}`);
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

module.exports.reset = function(req,res){
    return res.render('reset-password');
}

module.exports.sendResetLink = async function(req,res){
    try{
        let user = await User.findOne({email:req.body.email});
        if(!user){
            console.log('User not found!');
            return res.redirect('back');
        }
        let reset_password = await resetPassword.create({
            user: user._id,
            accesstoken: jwt.sign(user.toJSON(),'socialMediaApplication',{expiresIn:'10000000'}),
            isValid: true
        });
        let reset_Password = await resetPassword.findById(reset_password._id).populate('user');
        //passwordsMailer.reset(reset_Password);
        let job = queue.create('resetPassword',reset_Password).save(function(err){
            if(err){
                console.log('Error in creating a queue');
            }
            else{
                console.log(job.id);
            }
         });
        return res.end('A link to reset password has been sent to your email account');
    }catch(err){
        console.log('Unable to send reset Password link',err);
        return res.redirect('back');
    }
}

module.exports.resetPassword = async function(req,res){
    try{
        let accessToken = req.params.token;
        let user_account = await resetPassword.findOne({accesstoken:accessToken});
        if(user_account){
            return res.render('changePassword',{
                token:accessToken
            });
        }
        else{
            return res.end('Invalid or expired token');
        }
    }catch(err){
        console.log('Error while resetting password',err);
        return res.redirect('/users/login');
    }
}

module.exports.changePassword = async function(req,res){
    let password = req.body.password;
    let confirm_password = req.body.confirmPassword;
    //console.log(req.body);
    if(password!=confirm_password){
        //console.log(password);
        //console.log(confirm_password);
        return res.redirect('back');
    }
    let accessToken = req.params.token;
    let user_account = await resetPassword.findOne({accesstoken:accessToken});
    //console.log(user_account.isValid);
    if(user_account&&user_account.isValid==true){
        let user = await User.findById(user_account.user);
        //console.log(user);
        if(user){
            user.password = password;
            user.save();
            user_account.isValid=false;
            user_account.save();
            //console.log(user_account.isValid);
            return res.redirect('/users/login');
        }
        else{
            console.log('Could not find the user');
            return res.redirect('back');
        }
    }
    else{
         return res.send('Invalid or Expired Token');
    }
}

