const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const resetPassword = require('../models/reset-password');
const jwt = require('jsonwebtoken');  // Used to generate the token.
const queue = require('../config/kue');
const resetPasswordWorker = require('../workers/reset_password_worker');
const verifyEmailWorker = require('../workers/verify_email_worker');
const verifyEmail = require('../models/verifyEmail');
const Friendship = require('../models/friendship');
const env = require('../config/environment');

module.exports.profile = async function(req,res){
    let user = await User.findById(req.params.id);
    let requestReceived = user.haveSent.get(req.user.id);
    let requestSent = user.haveReceived.get(req.user.id);
    let friends = user.areFriends.get(req.user.id);
    let self = req.user.id==req.params.id;

    let profileUser = await User.findById(req.params.id)
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
        
    return res.render('profile',{
        profile_user:user,
        requestSent:requestSent,
        requestReceived:requestReceived,
        friends:friends,
        profileUser:profileUser,
        self:self
    });

}

module.exports.update = async function(req,res) {
    try{
        if(req.user.id==req.params.id){
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
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
                return res.redirect(`/users/profile/${req.user._id}`);
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
        return res.redirect('/users/feed');
    }
    return res.render('login');
} 

//Render the Signup Page
module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/feed');
    }
    return res.render('signup');
}

//get the sign up data
module.exports.create = async function(req,res){

    try{
        let user = await User.findOne({email:req.body.email});
        if(user){
            return res.redirect('/users/signup');
        }
        else{

            let verifyemail = await verifyEmail.create({
                email:req.body.email,
                accesstoken: jwt.sign({email:req.body.email},env.jwt_secret,{expiresIn:'10000000'}),
                password:req.body.password,
                name:req.body.name
            });

            //emailVerificationMailer.verify(verifyemail);

            let job = queue.create('verifyEmail',verifyemail).priority('critical').save(function(err){
                if(err){
                    console.log('Error in creating a queue');
                }
             });

            return res.render('notification-template',{
                message:"An email has been sent to your email account for verification"
            });
        }
    }catch(err){
        return res.redirect('/users/signup');
    }
    
}

module.exports.verifyUserEmail = async function(req,res){
    try{
        let accessToken = req.params.token;
        let email_to_verify = await verifyEmail.findOne({accesstoken:accessToken});
        if(email_to_verify){
            let user = await User.create({
                email:email_to_verify.email,
                password:email_to_verify.password,
                name:email_to_verify.name
            });

            // Make admin(myself) friend of every user.

            if(user.email!='myselfanuragharsh@gmail.com'){
                let admin = await User.findOne({email:'myselfanuragharsh@gmail.com'});

                let str1 = user.id;
                let str2 = admin.id;

                admin.areFriends.set(str1,true);
                user.areFriends.set(str2,true);
                admin.friendships.push(user._id);
                user.friendships.push(admin._id);

                user.save();
                admin.save();

                await Friendship.create({
                    from_user:user._id,
                    to_user:admin._id
                });   
            }

            await verifyEmail.deleteMany({email:email_to_verify.email});

            req.flash('success','Email Verified');
            return res.redirect('/users/login');
        }
        else{
            return res.render('notification-template',{
                message:"Invalid or expired token"
            });
        }
    }catch(err){
        return res.redirect('/users/login');
    }
}


module.exports.feed = async function (req,res){
    let user = await User.findById(req.user._id)
    .populate({
        path:'friendships',
        populate:[
            {
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
            }
        ]
    });

    let all_posts=[];
    for(friend of user.friendships){
        for(each_post of friend.posts){
           all_posts.push(each_post);
        }
    }

    all_posts.sort(function(a,b){
        //subtract the dates to get a value that is either negative, positive, or zero.
        return (b.createdAt) - (a.createdAt);
    });

    return res.render('feed',{
        posts:all_posts
    });
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

module.exports.messages = async function(req,res){
    let user = await User.findById(req.user._id).populate('friendships');
    return res.render('message',{
        profiles:user.friendships
    });
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
            return res.redirect('back');
        }
        let reset_password = await resetPassword.create({
            user: user._id,
            accesstoken: jwt.sign(user.toJSON(),env.jwt_secret,{expiresIn:'10000000'})
        });
        let reset_Password = await resetPassword.findById(reset_password._id).populate('user');
        //passwordsMailer.reset(reset_Password);
        let job = queue.create('resetPassword',reset_Password).priority('critical').save(function(err){
            if(err){
                console.log('Error in creating a queue');
            }
         });
         return res.render('notification-template',{
            message:"A link to reset password has been sent to your email account"
         });
    }catch(err){
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
            return res.render('notification-template',{
                message:"Invalid or Expired Token"
            });
        }
    }catch(err){
        return res.redirect('/users/login');
    }
}

module.exports.changePassword = async function(req,res){
    let password = req.body.password;
    let confirm_password = req.body.confirmPassword;
    if(password!=confirm_password){
        return res.redirect('back');
    }
    let accessToken = req.params.token;
    let user_account = await resetPassword.findOne({accesstoken:accessToken});
    if(user_account){
        let user = await User.findById(user_account.user);
        if(user){
            user.password = password;
            user.save();
            
            await resetPassword.deleteMany({user:user_account.user});
                        
            return res.redirect('/users/login');
        }
        else{
            return res.redirect('back');
        }
    }
    else{
        return res.render('notification-template',{
            message:"Invalid or Expired Token"
        });
    }
}

module.exports.chatbox = function(req,res){
    return res.render('chat_box');
}

