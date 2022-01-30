const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema =  new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    avatar:{
        type:String
    },
    friendships:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    requestsSent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    requestsReceived:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    haveSent:{
        type:Map,
        of:Boolean,
        default: () => ({}) //user.haveSent is null. So we should set a default for haveSent.So Mongoose will initialize it to an empty map for us.
    },
    haveReceived:{
        type:Map,
        of:Boolean,
        default: () => ({}) //user.haveReceived is null. So we should set a default for haveReceived.So Mongoose will initialize it to an empty map for us.
    },
    areFriends:{
        type:Map,
        of:Boolean,
        default: () => ({}) //user.areFriends is null. So we should set a default for areFriends.So Mongoose will initialize it to an empty map for us.
    }
},{
    timestamps:true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

//static methods
userSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH; 

const User = mongoose.model('User',userSchema);

module.exports = User;