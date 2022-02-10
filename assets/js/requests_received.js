{
    function acceptRequest(){
       $('.accept-request').click(function(event){
          event.preventDefault();
          console.log('Friend Acceptance Prevented');

          console.log($(this).prop('href'));
          $.ajax({
                type:'get',
                url:$(this).prop('href'),
                success:function(data){
                    console.log(data);
                   $(`.profile-${data.data.profile}`).remove();

                   new Noty({
                    theme: 'relax',
                    text: "Request Accepted",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                   }).show();

                },error:function(err){
                    console.log('Error');
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

    function rejectRequest(){
        $('.reject-request').click(function(event){
           event.preventDefault();
           console.log('prevented');

           console.log($(this).prop('href'));
           
           $.ajax({
            type:'get',
            url:$(this).prop('href'),
            success:function(data){
                console.log(data);
               $(`.profile-${data.data.profile}`).remove();

               new Noty({
                theme: 'relax',
                text: "Request Rejected",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
                
               }).show();
             
            },error:function(err){
                console.log('Error');
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

    acceptRequest();
    rejectRequest();

}