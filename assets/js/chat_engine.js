class ChatEngine{
    constructor(chatBoxId,userEmail,chatRoom){
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        this.chatRoom = chatRoom;

        //this.socket = io.connect('http://localhost:5000');
        this.socket=io('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] });
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: self.chatRoom
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })

            $('#send-message').click(function(){
                let msg = $('#chat-message-input').val();
    
                if (msg != ''){
                    self.socket.emit('send_message', {
                        message: msg,
                        user_email: self.userEmail,
                        chatroom: self.chatRoom
                    });
                }
            });
    
            self.socket.on('receive_message', function(data){
                console.log('message received', data.message);
    
    
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
            })

        });
    }
}