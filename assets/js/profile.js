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
           });

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
            });
        });
    }

    function acceptFriendRequest(){
       $('.accept-friend-request').click(function(event){
            event.preventDefault();
            console.log('Accepting Prevented');
            console.log($(this).prop('href'));
            $.ajax({
                type:'get',
                url:$(this).prop('href'),
                success:function(data){
                    $('.accept-friend-request').text("Request Accepted")
                    $('.accept-friend-request').attr("href","#");
                    $('.reject-friend-request').remove();
                },error:function(err){
                        console.log('Error')
                }
            });
       })
    }

    function rejectFriendRequest(){
        $('.reject-friend-request').click(function(event){
            event.preventDefault();
            console.log('Rejection Prevented');
            console.log($(this).prop('href'));
            $.ajax({
                type:'get',
                url:$(this).prop('href'),
                success:function(data){
                    $('.reject-friend-request').text("Request Rejected")
                    $('.reject-friend-request').attr("href","#");
                    $('.accept-friend-request').remove();
                },error:function(err){
                        console.log('Error')
                }
            });
        });
    }

    function removeFriend(){
        $('.remove-friend').click(function(event){
           event.preventDefault();
           console.log('Friend Removal Prevented');
           console.log($(this).prop('href'));
            $.ajax({
                type:'get',
                url:$(this).prop('href'),
                success:function(data){
                    $('.remove-friend').text("Friend Removed")
                    $('.remove-friend').attr("href","#");
                },error:function(err){
                    console.log('Error')
                }
            });
        });
    }
    
    removeFriend();
    rejectFriendRequest();
    acceptFriendRequest();
    withdrawFriendRequest();
    sendFriendRequest();
}