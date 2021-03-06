{
    function removeFriend(){
        $('.remove-friend').click(function(event){
           event.preventDefault();
           $.ajax({
                type:'get',
                url:$(this).prop('href'),
                success:function(data){
                   $(`.profile-${data.data.profile}`).remove();

                   new Noty({
                    theme: 'relax',
                    text: "Friend Removed",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                   }).show();
                },error:function(err){
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
    
    removeFriend();
}