class PostComments{constructor(t){this.postId=t,this.postContainer=".comments-section"+t,this.newCommentForm=$(`.post-${t}-comments-form`),this.helper=`.post-${t}-comments-form`,this.createComment(t);let e=this;$(this.postContainer).find(".delete-comment-button").each(function(){e.deleteComment($(this),t)})}createComment(o){let s=this;this.newCommentForm.submit(function(t){t.preventDefault();$.ajax({type:"post",url:"/comments/create",data:$(this).serialize(),success:function(t){var e=parseInt($(".toggle-comments-button-"+o).attr("data-comments")),e=(e+=1,$(".toggle-comments-button-"+o).attr("data-comments",e),$(".toggle-comments-button-"+o).children().html(""+e),s.newCommentDom(t.data.obj,t.data.comment));new ToggleLike($(" .toggle-like-button",e)),$(".comments-section"+o).prepend(e),s.deleteComment($(" .delete-comment-button",e),o),editComment(),saveComment(),$(".comment-content-input-"+o).val(""),new Noty({theme:"relax",text:"Comment published!",type:"success",layout:"topRight",timeout:1500}).show()},error:function(t){console.log(t.responseText)}})})}newCommentDom(t,e){return $(`<div class="card  comments-list-container comment-group" id="comment-${e._id}" style="margin-right:0px;margin-bottom:1rem;">
      <div class="card-header bg-success comment-info flex-wrapper" style="height:3rem;"> 
          <div class="profile-link-comment" style="font-weight:700;">
                <img src="${t.avatar}" width="30" height="30" class="rounded-circle"> &nbsp; <a href="/users/profile/${e.user}">${t.name}</a>&nbsp;
          </div>
          <div>
              ${t.time} at ${e.time}
          </div>
      </div>
      <div class="card-body comment-content-${e._id}">    
          ${e.content}       
      </div>
      <div class="card-footer">
            <div id="delete">
                <a class="toggle-like-button" data-likes=${e.likes.length} href="/likes/toggle/?id=${e._id}&&type=Comment">Like <span class="badge badge-info">${e.likes.length}</span></a>
                <div>
                    <a href="/comments/edit/${e._id}" class="edit-comment target-comment-${e._id}" data-targetComment="${e._id}">Edit <i class="fas fa-edit"></i></a> &nbsp;
                    <a href="/comments/destroy/${e._id}" class="delete-comment-button" data-test="${e._id}">Delete <i class="fas fa-trash"></i></a> 
                </div>
            </div>
      </div>
  </div>`)}deleteComment(e,o){$(e).click(function(t){t.preventDefault(),$.ajax({type:"get",url:$(e).prop("href"),success:function(t){var e=parseInt($(".toggle-comments-button-"+o).attr("data-comments"));--e,$(".toggle-comments-button-"+o).attr("data-comments",e),$(".toggle-comments-button-"+o).children().html(""+e),$("#comment-"+t.data.comment_id).remove(),new Noty({theme:"relax",text:"Comment Deleted",type:"success",layout:"topRight",timeout:1500}).show()},error:function(t){console.log(t.responseText)}})})}}{let t=function(){let e=$("#new-post-form");e.submit(function(t){t.preventDefault(),$.ajax({type:"post",url:"/posts/create",data:e.serialize(),success:function(t){var e=o(t.data.post,t.data.obj);$("#posts-list-container").prepend(e),s($(" .delete-post-button",e)),editPost(),savePost(),new PostComments(t.data.post._id),new ToggleLike($(" .toggle-like-button",e)),$(".post-content-input").val(""),new Noty({theme:"relax",text:"Post published!",type:"success",layout:"topRight",timeout:1500}).show()},error:function(t){console.log(t.responseText)}})})},o=function(t,e){return $(`<div class="container-fluid" id="post-${t._id}" style="padding:0px;">
        <div class="card" style="padding:1rem;margin-bottom:2rem;">
            <div class="card-header post-info flex-wrapper" style="height:3rem;background-color: lightblue;">
                <div class="profile-link-post" style="font-weight:700;">
                    <img src="${e.profileUser.avatar}" width="30" height="30" class="rounded-circle"> &nbsp; <a href="/users/profile/${e.profileUser._id}">${e.name}</a>&nbsp;
                </div>
                <div style="font-weight:750;">
                    ${e.time} at ${t.time}
                </div>
            </div>
            <div class="card-body post-content-${t._id}" style="min-height:10rem;height:auto;">
                ${t.content}
            </div>
            <div class="card-footer">
                <div class="posts-footer">
                    <div>
                        <a class="toggle-like-button" data-likes=${t.likes.length} href="/likes/toggle/?id=${t._id}&&type=Post">Like <span class="badge badge-info">${t.likes.length}</span></a>
                        <a data-toggle="collapse" class="toggle-comments-button-${t._id}" data-comments="${t.comments.length}"  href="#collapse${t._id}">Comments <span class="badge badge-info">${t.comments.length}</span></a><br>
                    </div>

                    <div id="delete">
                        <a href="/posts/edit/${t._id}" class="edit-post target-post-${t._id}" data-targetPost="${t._id}">Edit <i class="fas fa-edit"></i></a> &nbsp;
                        <a href="/posts/destroy/${t._id}" class="delete-post-button">Delete <i class="fas fa-trash"></i></a> 
                    </div>
                </div>
            </div>

            <div id="collapse${t._id}" class="panel-collapse collapse container-fluid group-comments" style="padding-left:2rem;background-color: lightgrey;">

                <form action="/comments/create/" method="post" class="post-${t._id}-comments-form" style="margin-top:1rem;margin-bottom:1rem;">
                    <div class="form-group">
                        <input type="text" name="content" class="form-control comment-content-input-${t._id}" placeholder="Add a comment" required>
                    </div>
                    <div class="form-group">
                        <input type="hidden" name="post" value="${t._id}">
                    </div>
                    <button type="submit" class="btn btn-success">Add Comment</button>
                </form>

                <div class="comments-section${t._id}">

                </div>
            </div>
        </div>`)},s=function(e){$(e).click(function(t){t.preventDefault(),$.ajax({type:"get",url:$(e).prop("href"),success:function(t){$("#post-"+t.data.post_id).remove(),new Noty({theme:"relax",text:"Post Deleted",type:"success",layout:"topRight",timeout:1500}).show()},error:function(t){console.log(t.responseText)}})})},e=function(){$("#posts-list-container>div").each(function(){let t=$(this);var e=$(" .delete-post-button",t),e=(s(e),t.prop("id").split("-")[1]);new PostComments(e)})};t(),e()}