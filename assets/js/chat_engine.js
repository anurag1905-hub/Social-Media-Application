jQuery.fn.scrollTo = function(elem) {
    //Reference: https://stackoverflow.com/questions/54768752/autoscroll-div-when-content-is-added
    if( this[0].scrollTop > this[0].scrollHeight - this[0].offsetHeight - $(elem).height() - 10) {
        $(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top);
    }
    return this; 
};

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
        this.socket=io('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] });
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

                if (msg != ''){
                    self.socket.emit('send_message', {
                        message: msg,
                        user_email: self.userEmail,
                        chatroom: self.chatRoom,
                        sender:self.sender,
                    });
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
    
                $('#chat-messages-list').append(newMessage).scrollTo(newMessage);
            })

        });
    }
}