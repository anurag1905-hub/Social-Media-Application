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

module.exports.requestsSent = async function(req,res){
    let user = await User.findById(req.user._id).populate('requestsSent');
    return res.render('requestsSent',{
        profiles:user.requestsSent
    });
}

module.exports.requestsReceived = async function(req,res){
    let user = await User.findById(req.user._id).populate('requestsReceived');
    return res.render('requestsReceived',{
        profiles:user.requestsReceived
    });
}

module.exports.sendRequest = async function(req,res){
    let receiverUser = await User.findById(req.params.id);
    if(!receiverUser||req.params.id==req.user.id){
        req.flash('error','Unauthorized');
        return res.redirect('back');
    }
    else{
        let senderUser = await User.findById(req.user._id);
        var str1 = req.user.id;
        var str2 = (req.params.id);
        if(senderUser.haveSent.get(receiverUser)){
            req.flash('error','Unauthorized');
            return res.redirect('back');
        }
        senderUser.requestsSent.push(receiverUser);
        senderUser.haveSent.set(str2,true);
        senderUser.save();
        receiverUser.requestsReceived.push(senderUser);
        receiverUser.haveReceived.set(str1,true);
        receiverUser.save();
        console.log('Reached till the end');
        return res.redirect('back');
    }
    
}

module.exports.withdrawRequest = async function(req,res){
    let senderUser = await User.findById(req.user._id);
    let receiverUser = await User.findById(req.params.id);
    if(!receiverUser){
        req.flash('error','Unauthorized');
        return res.redirect('back');
    }
    else{
        var str1 = req.user.id;
        var str2 = (req.params.id);
        senderUser.haveSent.set(str2,false);
        receiverUser.haveReceived.set(str1,false);
        senderUser.requestsSent.pull(req.params.id);
        receiverUser.requestsReceived.pull(req.user._id);
        senderUser.save();
        receiverUser.save();
    }
    return res.redirect('back');
}