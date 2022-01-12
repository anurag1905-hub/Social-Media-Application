const User = require('../models/user');



//Render the login page
module.exports.login = function(req,res){
    return res.render('login');
} 

//Render the Signup Page
module.exports.signup = function(req,res){
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
    
}


