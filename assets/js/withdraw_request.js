{
    function withdrawFriendRequest(){
        $('.withdraw-friend-request').click(function(event){
            event.preventDefault();
            console.log('Withdrawal Prevented');
            console.log($(this).prop('href'));
            $.ajax({
                type:'get',
                url:$(this).prop('href'),
                success:function(data){
                   $(`.target-${data.data.profile._id}`).remove();

                   new Noty({
                    theme: 'relax',
                    text: "Request Withdrawn",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                   }).show();
                },error:function(err){
                    console.log('Error')

                    new Noty({
                        theme: 'relax',
                        text: "Error",
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }
            });
        });
    }

    withdrawFriendRequest();
}