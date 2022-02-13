{
    function getPost(post,profileUser){
        return $(`<div class="container-fluid toggle-post" id="post-${post._id}" style="padding-left:1rem;padding-right:1rem;">
        <div class="card" style="padding:1rem;margin-bottom:2rem;">
            <div class="card-header post-info flex-wrapper" style="height:3rem;background-color: lightblue;">
                <div class="profile-link-post" style="font-weight:700;">
                    <img src="${profileUser.avatar}" width="30" height="30" class="rounded-circle"> &nbsp; <a href="/users/profile/${post.user._id}">${post.user.name}</a>
                </div>
                <div style="font-weight:750;">
                     at ${post.time}
                </div>
            </div>
            <!-- convert string to html -->
            <div class="card-body post-content-${post._id}" style="min-height:10rem;height:auto;color:black;">
                ${post.content}  
            </div>
            <div class="card-footer">
                <div class="posts-footer">
                    <div>
                        <a class="toggle-like-button" data-likes="${post.likes.length}" href="/likes/toggle/?id=${post._id}&type=Post">Like <span class="badge badge-info">${post.likes.length}</span></a>
                        <a data-toggle="collapse" class="toggle-comments-button-${post._id}" data-comments="${post.comments.length}"  href="#collapse${post._id}">Comments <span class="badge badge-info">${post.comments.length}</span></a><br> 
                    </div>
                    <div id="delete">
                        
                    </div>
                </div>
            </div>

            <div id="collapse${post._id}" class="panel-collapse collapse container-fluid group-comments" style="padding-left:2rem;background-color: lightgrey;">

                <form action="/comments/create/" method="post" class="post-${post._id}-comments-form" style="margin-top:1rem;margin-bottom:1rem;">
                    <div class="form-group">
                        <input type="text" name="content" class="form-control comment-content-input-${post._id}" placeholder="Add a comment" required>
                    </div>
                    <div class="form-group">
                        <input type="hidden" name="post" value="${post._id}">
                    </div>
                    <button type="submit" class="btn btn-success">Add Comment</button>
                </form>

                <br>

                <div class="comments-section${post._id}">
                     
                </div>
            </div>  
        </div>
    </div>`);
    }

    function getComment(comment,post){
        return $(`<div class="card  comments-list-container${post._id} comment-group" id="comment-${comment._id}" style="margin-right:0px;margin-bottom:1rem;">
                <div class="card-header bg-success comment-info flex-wrapper" style="height:3rem;"> 
                    <div class="profile-link-comment" style="font-weight:700;">
                        <img src="${comment.user.avatar}" width="30" height="30" class="rounded-circle"> &nbsp; <a href="/users/profile/${comment.user._id}">${comment.user.name}</a>&nbsp;
                    </div>
                    <div>
                        at ${comment.time}
                    </div>
                </div>
                <div class="card-body comment-content-${comment._id}">    
                    <!-- Convert string to html -->
                    ${comment.content}       
                </div>
                <div class="card-footer">
                    <div id="delete">
                        <a class="toggle-like-button" data-likes="${comment.likes.length}" href="/likes/toggle/?id=${comment._id}&type=Comment">Like <span class="badge badge-info">${comment.likes.length}</span></a>
                    </div>
                 </div>
            </div>`
        );
    }

    function getCompletePost(post,profileUser,owner){
        let postToBeAdded = getPost(post,profileUser);

        new ToggleLike($(' .toggle-like-button', postToBeAdded));


        let target = $(postToBeAdded).find(`.comments-section${post._id}`);
        
        for(comment of post.comments){
            let commentToBeAdded = getComment(comment,post);
            if(comment.user._id==owner){
                let targetComment = $(commentToBeAdded).find(`#delete`);
                targetComment.append(
                `
                    <div>
                    <a href="/comments/edit/${comment._id}" class="edit-comment target-comment-${comment._id}" data-targetComment="${comment._id}">Edit <i class="fas fa-edit"></i></a> &nbsp;
                    <a href="/comments/destroy/${comment._id}" class="delete-comment-button" data-test="${comment._id}">Delete <i class="fas fa-trash"></i></a> 
                    </div>
                `
                );
            }
            editComment();
            saveComment();
            $(target).append(commentToBeAdded);
        }

        return postToBeAdded;
    }

    function sendFriendRequest(){
        $('.send-friend-request').click(function(event){
            event.preventDefault();
            console.log('Clicked',this);
            console.log($(this).prop('href'));
            let targetUser = $(this).attr("data-targetUser");
            $.ajax({
               type:'get',
               url:$(this).prop('href'),
               success:function(data){
                    
                },error:function(err){
                    console.log('Error');
                }
            });
            //Since AJAX is asynchronous

            $('.send-friend-request').replaceWith(`
                <a href="/users/friends/withdrawRequest/${targetUser}" class="btn btn-danger withdraw-friend-request" data-targetUser="${targetUser}">Withdraw Friend Request</a>
            `);

             withdrawFriendRequest();
        });
    }

    function withdrawFriendRequest(){
        $('.withdraw-friend-request').click(function(event){
            event.preventDefault();
            console.log('Withdrawal Prevented');
            console.log($(this).prop('href'));
            let targetUser = $(this).attr("data-targetUser");
            $.ajax({
                type:'get',
                url:$(this).prop('href'),
                success:function(data){ 
                    
                },error:function(err){
                    console.log('Error');
                }
            });
            $('.withdraw-friend-request').replaceWith(`
                <a href="/users/friends/sendRequest/${targetUser}" class="btn btn-success send-friend-request" data-targetUser="${targetUser}">Send Friend Request</a>
            `);
            sendFriendRequest();
        });
    }

    function acceptFriendRequest(){
       $('.accept-friend-request').click(function(event){
            event.preventDefault();
            console.log('Accepting Prevented');
            console.log($(this).prop('href'));
            let targetUser = $(this).attr("data-targetUser");;
            $.ajax({
                type:'get',
                url:$(this).prop('href'),
                success:function(data){
                    $('.accept-friend-request').text("Request Accepted")
                    $('.accept-friend-request').attr("href","#");
                    $('.reject-friend-request').remove();
                    $('.message').remove();

                    
                    for(post of data.data.profileUser.posts){
                        let newpost = getCompletePost(post,data.data.profileUser,data.data.owner);

                        $('.post-group').append(newpost);

                        new PostComments(post._id);
                    }

                },error:function(err){
                        console.log('Error')
                }
            });
            $('.accept-friend-request').replaceWith(`
               <a href="/users/friends/viewFriends/${targetUser}" class="btn btn-success view-friends" data-targetUser="${targetUser}">View Friends</a>
               <a href="/users/friends/removeFriend/${targetUser}" class="btn btn-danger remove-friend" data-targetUser="${targetUser}">Remove Friend</a>
            `);
            removeFriend();
       })
    }

    function rejectFriendRequest(){
        $('.reject-friend-request').click(function(event){
            event.preventDefault();
            console.log('Rejection Prevented');
            console.log($(this).prop('href'));
            let targetUser = $(this).attr("data-targetUser");
            $.ajax({
                type:'get',
                url:$(this).prop('href'),
                success:function(data){
                    $('.accept-friend-request').remove();
                },error:function(err){
                        console.log('Error')
                }
            });
            $('.reject-friend-request').replaceWith(`
               <a href="/users/friends/sendRequest/${targetUser}" class="btn btn-success send-friend-request" data-targetUser="${targetUser}">Send Friend Request</a>
            `);
            sendFriendRequest();
        });
    }

    function removeFriend(){
        $('.remove-friend').click(function(event){
           event.preventDefault();
           console.log('Friend Removal Prevented');
           let targetUser = $(this).attr("data-targetUser");
            $.ajax({
                type:'get',
                url:$(this).prop('href'),
                success:function(data){
                    $('.toggle-post').remove();
                    $('.view-friends').remove();
                    
                    $('.message').css('display','block');


                },error:function(err){
                    console.log('Error');
                }
            });
            $('.remove-friend').replaceWith(`
               <a href="/users/friends/sendRequest/${targetUser}" class="btn btn-success send-friend-request" data-targetUser="${targetUser}">Send Friend Request</a>
            `);
            sendFriendRequest();
        });
    }
    
    removeFriend();
    rejectFriendRequest();
    acceptFriendRequest();
    withdrawFriendRequest();
    sendFriendRequest();
}