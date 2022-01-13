const e = require('express');
const User = require('../models/user');

module.exports.profile = function(req,res){
    User.findById(req.user,function(err,user){
        if(err){
            console.log('Error in finding the user');
            return res.redirect('back');
        }
        if(user){
            return res.render('profile',{
               user:user
            });
        }
        else{
            return res.redirect('back');
        }
    });
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
    })
}

//sign in and create a session for the user.
module.exports.createSession = function(req,res){
    return res.redirect('/');
}

//sign out the current signed in user
module.exports.destroySession = function(req,res){
    req.logout();
    return res.redirect('/');
}


