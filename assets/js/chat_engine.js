function gotoBottom(id){
    var element = $(`#${id}`);
    var height = element.prop('scrollHeight');
    element.animate({scrollTop: height},0);
 }

class ChatEngine{
    constructor(chatBoxId,userEmail,chatRoom,sender){
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        this.chatRoom = chatRoom;
        this.sender = sender;
        //this.socket = io.connect('http://localhost:5000');
        this.socket=io('http://18.221.30.176:8000/:5000', { transports: ['websocket', 'polling', 'flashsocket'] });
        if(this.userEmail){
            this.connectionHandler();
        }
        gotoBottom('chat-messages-list');
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: self.chatRoom
            });

            self.socket.on('user_joined', function(data){
                
            });

            $('#send-message').click(function(){
                let msg = $('#chat-message-input').val();
                $('#chat-message-input').val("");
                var ul_element = $('#chat-messages-list');

                if (msg != ''){
                    self.socket.emit('send_message', {
                        message: msg,
                        user_email: self.userEmail,
                        chatroom: self.chatRoom,
                        sender:self.sender,
                    });
                    gotoBottom('chat-messages-list');
                }
            });
    
            self.socket.on('receive_message', function(data){
                let newMessage = $('<li>');
                let messageType = 'other-message';
                if (data.user_email == self.userEmail){
                    messageType = 'self-message';
                }
                newMessage.append($('<span>', {
                    'html': data.message
                }));
                newMessage.addClass(messageType);
                $('#chat-messages-list').append(newMessage);
                gotoBottom('chat-messages-list');
            })

        });
    }
}