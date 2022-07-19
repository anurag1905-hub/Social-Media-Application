function getPost(e,t,s){return $(`<div class="container-fluid toggle-post" id="post-${e._id}" style="padding-left:1rem;padding-right:1rem;">
        <div class="card" style="padding:1rem;margin-bottom:2rem;">
            <div class="card-header post-info flex-wrapper" style="height:3rem;background-color: lightblue;">
                <div class="profile-link-post" style="font-weight:700;">
                    <img src="${t.avatar}" width="30" height="30" class="rounded-circle"> &nbsp; <a href="/users/profile/${e.user._id}">${e.user.name}</a>
                </div>
                <div style="font-weight:750;">
                    ${s} at ${e.time}
                </div>
            </div>
            <!-- convert string to html -->
            <div class="card-body post-content-${e._id}" style="min-height:10rem;height:auto;color:black;">
                ${e.content}  
            </div>
            <div class="card-footer">
                <div class="posts-footer">
                    <div>
                        <a class="toggle-like-button" data-likes="${e.likes.length}" href="/likes/toggle/?id=${e._id}&type=Post">Like <span class="badge badge-info">${e.likes.length}</span></a>
                        <a data-toggle="collapse" class="toggle-comments-button-${e._id}" data-comments="${e.comments.length}"  href="#collapse${e._id}">Comments <span class="badge badge-info">${e.comments.length}</span></a><br> 
                    </div>
                    <div id="delete">
                        
                    </div>
                </div>
            </div>

            <div id="collapse${e._id}" class="panel-collapse collapse container-fluid group-comments" style="padding-left:2rem;background-color: lightgrey;">

                <form action="/comments/create/" method="post" class="post-${e._id}-comments-form" style="margin-top:1rem;margin-bottom:1rem;">
                    <div class="form-group">
                        <input type="text" name="content" class="form-control comment-content-input-${e._id}" placeholder="Add a comment" required>
                    </div>
                    <div class="form-group">
                        <input type="hidden" name="post" value="${e._id}">
                    </div>
                    <button type="submit" class="btn btn-success">Add Comment</button>
                </form>

                <br>

                <div class="comments-section${e._id}">
                     
                </div>
            </div>  
        </div>
    </div>`)}function getComment(e,t,s){return $(`<div class="card  comments-list-container${t._id} comment-group" id="comment-${e._id}" style="margin-right:0px;margin-bottom:1rem;">
                <div class="card-header bg-success comment-info flex-wrapper" style="height:3rem;"> 
                    <div class="profile-link-comment" style="font-weight:700;">
                        <img src="${e.user.avatar}" width="30" height="30" class="rounded-circle"> &nbsp; <a href="/users/profile/${e.user._id}">${e.user.name}</a>&nbsp;
                    </div>
                    <div>
                       ${s} at ${e.time}
                    </div>
                </div>
                <div class="card-body comment-content-${e._id}">    
                    <!-- Convert string to html -->
                    ${e.content}       
                </div>
                <div class="card-footer">
                    <div id="delete">
                        <a class="toggle-like-button" data-likes="${e.likes.length}" href="/likes/toggle/?id=${e._id}&type=Comment">Like <span class="badge badge-info">${e.likes.length}</span></a>
                    </div>
                 </div>
            </div>`)}function getCompletePost(t,e,s){let r=new Date(t.createdAt);var e=getPost(t,e,r.toDateString()),i=(new ToggleLike($(" .toggle-like-button",e)),$(e).find(".comments-section"+t._id));for(comment of t.comments){let e=new Date(comment.createdAt);e=e.toDateString();var n=getComment(comment,t,e);if(comment.user._id==s){let e=$(n).find("#delete");e.append(`
                    <div>
                    <a href="/comments/edit/${comment._id}" class="edit-comment target-comment-${comment._id}" data-targetComment="${comment._id}">Edit <i class="fas fa-edit"></i></a> &nbsp;
                    <a href="/comments/destroy/${comment._id}" class="delete-comment-button" data-test="${comment._id}">Delete <i class="fas fa-trash"></i></a> 
                    </div>
                `)}editComment(),saveComment(),$(i).append(n)}return e}function sendFriendRequest(){$(".send-friend-request").click(function(e){e.preventDefault();e=$(this).attr("data-targetUser");$.ajax({type:"get",url:$(this).prop("href"),success:function(e){},error:function(e){console.log(e.responseText)}}),$(".send-friend-request").replaceWith(`
                <a href="/users/friends/withdrawRequest/${e}" class="btn btn-danger withdraw-friend-request" data-targetUser="${e}">Withdraw Friend Request</a>
            `),withdrawFriendRequest()})}function withdrawFriendRequest(){$(".withdraw-friend-request").click(function(e){e.preventDefault();e=$(this).attr("data-targetUser");$.ajax({type:"get",url:$(this).prop("href"),success:function(e){},error:function(e){console.log(e.responseText)}}),$(".withdraw-friend-request").replaceWith(`
                <a href="/users/friends/sendRequest/${e}" class="btn btn-success send-friend-request" data-targetUser="${e}">Send Friend Request</a>
            `),sendFriendRequest()})}function acceptFriendRequest(){$(".accept-friend-request").click(function(e){e.preventDefault();e=$(this).attr("data-targetUser");let s;$.ajax({async:!1,type:"get",url:$(this).prop("href"),success:function(e){$(".reject-friend-request").remove(),$(".media").remove(),$(".message").remove(),$(".text").html("POSTS"),s=e.data.newfriends;for(post of e.data.profileUser.posts){var t=getCompletePost(post,e.data.profileUser,e.data.owner);$(".post-group").append(t),new PostComments(post._id)}0==e.data.profileUser.posts.length&&$(".text").append(`
                           <p class="message responsive-text"> No posts yet :) </p>
                        `)},error:function(e){console.log(e.responseText)}}),s?$(".accept-friend-request").replaceWith(`
                <a href="/users/friends/getFriends/${e}" class="btn btn-success view-friends" data-targetUser="${e}">View Friends</a>
                <a href="/users/friends/removeFriend/${e}" class="btn btn-danger remove-friend" data-targetUser="${e}">Remove Friend</a>
                `):$(".accept-friend-request").replaceWith(`
                    <a href="/users/friends/getFriends/${e}" class="btn btn-success view-friends" data-targetUser="${e}">View Friends</a>
                `),removeFriend(),viewFriends()})}function rejectFriendRequest(){$(".reject-friend-request").click(function(e){e.preventDefault();e=$(this).attr("data-targetUser");$.ajax({type:"get",url:$(this).prop("href"),success:function(e){$(".accept-friend-request").remove()},error:function(e){console.log(e.responseText)}}),$(".reject-friend-request").replaceWith(`
               <a href="/users/friends/sendRequest/${e}" class="btn btn-success send-friend-request" data-targetUser="${e}">Send Friend Request</a>
            `),sendFriendRequest()})}function removeFriend(){$(".remove-friend").click(function(e){e.preventDefault();e=$(this).attr("data-targetUser");$.ajax({type:"get",url:$(this).prop("href"),success:function(e){$(".toggle-post").remove(),$(".view-friends").remove(),$(".media").remove(),$(".view-friends").remove(),$(".accept-friend-request").remove()},error:function(e){console.log(e.responseText)}}),$(".remove-friend").replaceWith(`
               <a href="/users/friends/sendRequest/${e}" class="btn btn-success send-friend-request" data-targetUser="${e}">Send Friend Request</a>
            `),0==$(".message").length?$(".text").append(`
                    <p class="message responsive-text">Private Account :(</p>
                `):$(".message").html("Private Account :("),sendFriendRequest()})}function getFriendDom(e){return $(`<div class="media border p-3 mb-3">
        <img src="${e.avatar}" alt="profile pic" class="mr-3 rounded-circle" style="width:60px;height:60px;">
        <div class="media-body">
            <div class="d-flex">
                <div class="p-2" style="font-weight:800;font-size:1rem;">
                    <a href="/users/profile/${e._id}" class="p-2">${e.name}</a>
                </div>
                <div class="ml-auto bg-success success-button">
                    <a href="/users/profile/${e._id}" class="p-2">View Profile</a>
                </div>
            </div>
        </div>
    </div>
    `)}function viewFriends(){$(".view-friends").click(function(e){e.preventDefault(),$(".text").html("FRIENDS"),$(".toggle-post").remove();e=$(this).attr("data-targetUser");$.ajax({type:"get",url:$(this).prop("href"),success:function(e){for(friend of e.data.friends){var t=getFriendDom(friend);$(".post-group").append(t)}},error:function(e){console.log(e.responseText)}}),$(".view-friends").replaceWith(`
                <a href="/users/friends/acceptRequest/${e}" class="btn btn-success accept-friend-request" data-targetUser="${e}">View Posts</a>
            `),acceptFriendRequest(),removeFriend()})}removeFriend(),rejectFriendRequest(),acceptFriendRequest(),withdrawFriendRequest(),sendFriendRequest(),viewFriends();