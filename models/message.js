const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    friendship:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Friendship',
        required:true
    }
},{
    timestamps:true
});

const Message = mongoose.model('Message',messageSchema);

module.exports = Message;