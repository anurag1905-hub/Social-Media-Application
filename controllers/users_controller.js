const User = require('../models/user');

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

module.exports.update = function(req,res){
    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            return res.redirect('back');
        });
    }
    else{
        return res.status(401).send('Unauthorized');
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

module.exports.posts = function (req,res){
    return res.render('post');
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


