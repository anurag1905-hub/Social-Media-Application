{
    function sendFriendRequest(){
        $('.send-friend-request').click(function(event){
            event.preventDefault();
            console.log('Clicked',this);
           console.log($(this).prop('href'));
           $.ajax({
               type:'get',
               url:$(this).prop('href'),
               success:function(data){
                    $('.send-friend-request').text("Request Sent")
                    $('.send-friend-request').attr("href","#");
               },error:function(err){
                    console.log('Error')
               }
           })

        });
    }

    function withdrawFriendRequest(){
        $('.withdraw-friend-request').click(function(event){
            event.preventDefault();
            console.log('Withdrawal Prevented');
            console.log($(this).prop('href'));
            $.ajax({
                type:'get',
                url:$(this).prop('href'),
                success:function(data){
                    $('.withdraw-friend-request').text("Request Withdrawn")
                    $('.withdraw-friend-request').attr("href","#");
               },error:function(err){
                    console.log('Error')
               }
            })
        });
    }
    
    withdrawFriendRequest();
    sendFriendRequest();
}