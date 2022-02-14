const User = require('../models/user'); 
const Friendship = require('../models/friendship');
const Message = require('../models/message');

module.exports.showFriends = async function(req,res){
    let user = await User.findById(req.user._id).populate('friendships');
    return res.render('friend',{
        profiles:user.friendships
    });
}

module.exports.users = async function(req,res){
    let user = await User.findById(req.user._id); 

    let all_users = await User.find({});

    let profiles=[];
    for(u of all_users){

        let requestReceived = user.haveSent.get(u.id);
        let requestSent = user.haveReceived.get(u.id);
        let friends = user.areFriends.get(u.id);
        let same = user.id ==u.id;           // users should not get their profile in suggestions.

        if(!requestReceived&&!requestSent&&!friends&&!same){
            profiles.push(u);
        }
    }

    console.log(profiles);

    return res.render('user',{
        profiles:profiles
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
        let str1 = req.user.id;
        let str2 = (req.params.id);
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
        if(req.xhr){
            return res.status(200).json({
                data:{
                    receiverUser:receiverUser,
                },
                message:"Request Sent"
            });
        }
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
        let str1 = req.user.id;
        let str2 = (req.params.id);
        senderUser.haveSent.set(str2,false);
        receiverUser.haveReceived.set(str1,false);
        senderUser.requestsSent.pull(req.params.id);
        receiverUser.requestsReceived.pull(req.user._id);
        senderUser.save();
        receiverUser.save();
        if(req.xhr){
            return res.status(200).json({
                data:{
                    profile:receiverUser
                },
                message:"Request Withdrawn"
            });
        }
        return res.redirect('back');
    }
}

module.exports.rejectRequest = async function(req,res){
    let senderUser = await User.findById(req.params.id);
    let receiverUser = await User.findById(req.user._id);
    if(!senderUser){
        req.flash('error','Unauthorized');
        return res.redirect('back');
    }
    else{
        let str1 = req.params.id;
        let str2 = req.user.id;
        senderUser.haveSent.set(str2,false);
        receiverUser.haveReceived.set(str1,false);
        senderUser.requestsSent.pull(req.user._id);
        receiverUser.requestsReceived.pull(req.params.id);
        senderUser.save();
        receiverUser.save();
        if(req.xhr){
            return res.status(200).json({
                data:{
                    profile:req.params.id
                },
                message:"Request Rejected"
            });
        }
        return res.redirect('back');
    }
}

module.exports.acceptRequest = async function(req,res){
    let senderUser = await User.findById(req.params.id);
    let receiverUser = await User.findById(req.user._id);
    if(!senderUser){
        req.flash('error','Unauthorized');
        return res.redirect('back');
    }
    else{

        let user = await User.findById(req.params.id)
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

        if(senderUser.areFriends.get(req.user.id)){
            return res.status(200).json({
                data:{
                    profile:req.params.id,
                    profileUser:user,
                    owner:req.user.id
                },
                message:"Request Accepted"
            });
        }
        else{
            let str1 = req.params.id;
            let str2 = req.user.id;
            senderUser.haveSent.set(str2,false);
            receiverUser.haveReceived.set(str1,false);
            senderUser.requestsSent.pull(req.user._id);
            receiverUser.requestsReceived.pull(req.params.id);
            senderUser.friendships.push(req.user._id);
            receiverUser.friendships.push(req.params.id);
            senderUser.areFriends.set(str2,true);
            receiverUser.areFriends.set(str1,true);
            senderUser.save();
            receiverUser.save();
            await Friendship.create({
                from_user:senderUser,
                to_user:receiverUser 
            });

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        profile:req.params.id,
                        profileUser:user,
                        owner:req.user.id,
                        newfriends:true
                    },
                    message:"Request Accepted"
                });
            }
            return res.redirect('back');
        }
    }
}

module.exports.removeFriend = async function(req,res){       
    let firstUser = await User.findById(req.user._id);
    let secondUser = await User.findById(req.params.id);
    if(!secondUser){
        req.flash('error','Unauthorized');
        return res.redirect('back');
    }
    else{
        firstUser.friendships.pull(req.params.id);
        secondUser.friendships.pull(req.user._id);
        let str1 = req.params.id;
        let str2 = req.user.id;
        firstUser.areFriends.set(str1,false);
        secondUser.areFriends.set(str2,false);
        firstUser.save();
        secondUser.save();
        let friendship = await Friendship.findOne({from_user:firstUser,to_user:secondUser});
        let removedSuccessfully = false;
        console.log(friendship);
        if(friendship){
            friendship.remove();
            removedSuccessfully = true;
            await Message.deleteMany({friendship:friendship});
        }
        else{
            friendship = await Friendship.findOne({from_user:secondUser,to_user:firstUser});
            console.log(friendship);
            if(friendship){
                removedSuccessfully = true;
                friendship.remove();
                await Message.deleteMany({friendship:friendship});
            }
        }
        if(req.xhr){
            return res.status(200).json({
                data:{
                    profile:req.params.id,
                    removedSuccessfully:removedSuccessfully
                },
                message:"Removed from Friends"
            });
        }

        return res.redirect('back');
    }
}

module.exports.sendMessage = async function(req,res){
    let firstUser = await User.findById(req.user._id);
    let secondUser = await User.findById(req.params.id);
    let friendship = await Friendship.findOne({from_user:firstUser,to_user:secondUser}).populate('messages');
    if(!friendship){
        friendship = await Friendship.findOne({from_user:secondUser,to_user:firstUser}).populate('messages');
        if(!friendship){
            return res.redirect('back');
        }
        else{
            console.log(friendship);
            return res.render('chat_box',{
                friendship:friendship,
                messages:friendship.messages,
                profileUser:secondUser
            });
        }
    }
    else{
        console.log(friendship);
        return res.render('chat_box',{
            friendship:friendship,
            messages:friendship.messages,
            profileUser:secondUser
        });
    }
}

module.exports.getFriends = async function(req,res){
    let firstCondition = req.params.id==req.user.id;
    let user = await User.findById(req.params.id).populate('friendships');
    let secondConditon = !user.areFriends.get(req.user.id);

    console.log('Reached');

    if(firstCondition||secondConditon){
        console.log('Li');
        return res.status(200).json({
            data: {
                friends:[]
            },
            message:"Unauthorized!"
        });
    }
    else{
        console.log('Ri');
        return res.status(200).json({
            data: {
                friends:user.friendships
            },
            message:"Friends Fetched!"
        });
    }
}

