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
                    let all_posts = getAllPosts(data.profileUser);
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
           let count = 0;
            $.ajax({
                type:'get',
                url:$(this).prop('href'),
                success:function(data){
                    $('.remove-friend').text("Friend Removed")
                    $('.remove-friend').attr("href","#");
                    $('.toggle-post').remove();
                    $('.view-friends').remove();
                    
                    $('.message').css('display','block');


                },error:function(err){
                    console.log('Error');
                    ++count;
                    console.log('Count= ',count);
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