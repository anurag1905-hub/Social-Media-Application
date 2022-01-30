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

module.exports.requestsSent = function(req,res){
    return res.render('requestsSent');
}

module.exports.requestsReceived = function(req,res){
    return res.render('requestsReceived');
}

module.exports.sendRequest = async function(req,res){
    let receiverUser = await User.findById(req.params.id);
    if(!receiverUser||req.params.id==req.user.id){
        req.flash('error','Unauthorized');
        return res.redirect('back');
    }
    else{
        let senderUser = await User.findById(req.user._id);
        senderUser.requestsSent.push(receiverUser);
        var str1 = req.user.id;
        var str2 = (req.params.id);
        senderUser.progress.set(str2,true);
        senderUser.save();
        receiverUser.requestsReceived.push(senderUser);
        receiverUser.progress.set(str1,true);
        receiverUser.save();
        console.log('Reached till the end');
        return res.redirect('back');
    }
    
}