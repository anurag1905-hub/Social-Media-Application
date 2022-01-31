const Friendship = require('../models/friendship');
const Message = require('../models/message');

module.exports.chatSockets = async function(socketServer){
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection',function(socket){
       console.log('new connection received',socket.id);

       socket.on('disconnect',function(){
          console.log('socket disconnected');
       });

       socket.on('join_room',function(data){
          console.log('joining request recorded',data);

          socket.join(data.chatroom);

          io.in(data.chatroom).emit('user_joined',data);
       });

       socket.on('send_message',async function(data){
          let message = await Message.create({
             content:data.message,
             sender:data.sender,
             friendship:data.chatroom,
          });

          console.log(message);

          let friendship = await Friendship.findById(data.chatroom);
          console.log(friendship);
          friendship.messages.push(message);
          friendship.save();

          io.in(data.chatroom).emit('receive_message',data);
       });
       
    });
}