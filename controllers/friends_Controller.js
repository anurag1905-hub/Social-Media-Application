const User = require('../models/user'); 

module.exports.showFriends = function(req,res){
    return res.render('friend');
}

module.exports.users = function(req,res){
    User.find({},function(err,user){
        return res.render('user',{
            profiles:user
        });
    });
}

module.exports.requests = function(req,res){
    return res.render('requests');
}