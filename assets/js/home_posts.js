class PostComments{
    
    
    constructor(postId){
          this.postId = postId;
          this.postContainer = (`.comments-section${postId}`);
          this.newCommentForm = $(`.post-${postId}-comments-form`);
          this.helper = (`.post-${postId}-comments-form`);
          this.createComment(postId);
          let self = this;
          
            $(this.postContainer).find('.delete-comment-button').each(function(){
                
                self.deleteComment($(this),postId);
            });
     }
  
     createComment(postId){
      let pSelf = this;
      this.newCommentForm.submit(function(e){
          e.preventDefault();
          let self = this;
          $.ajax({
              type: 'post',
              url: '/comments/create',
              data: $(self).serialize(),
              success: function(data){
                let commentsCount = parseInt($(`.toggle-comments-button-${postId}`).attr('data-comments'));
                commentsCount+=1;
                $(`.toggle-comments-button-${postId}`).attr('data-comments',commentsCount);
                $(`.toggle-comments-button-${postId}`).children().html(`${commentsCount}`);

                let newComment = pSelf.newCommentDom(data.data.obj,data.data.comment);

                new ToggleLike($(' .toggle-like-button', newComment));

                $(`.comments-section${postId}`).prepend(newComment);
                pSelf.deleteComment($(' .delete-comment-button', newComment),postId);

                editComment();
                saveComment();

                $(`.comment-content-input-${postId}`).val("");

                new Noty({
                    theme: 'relax',
                    text: "Comment published!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();
  
              }, error: function(error){
                  console.log(error.responseText);
              }
          });
  
  
      });
  }
  
   newCommentDom(obj,comment){
      return $(`<div class="card  comments-list-container comment-group" id="comment-${comment._id}" style="margin-right:0px;margin-bottom:1rem;">
      <div class="card-header bg-success comment-info flex-wrapper" style="height:3rem;"> 
          <div class="profile-link-comment" style="font-weight:700;">
                <img src="${obj.avatar}" width="30" height="30" class="rounded-circle"> &nbsp; <a href="/users/profile/${comment.user}">${obj.name}</a>&nbsp;
          </div>
          <div>
              ${obj.time} at ${comment.time}
          </div>
      </div>
      <div class="card-body comment-content-${comment._id}">    
          ${comment.content}       
      </div>
      <div class="card-footer">
            <div id="delete">
                <a class="toggle-like-button" data-likes=${comment.likes.length} href="/likes/toggle/?id=${comment._id}&&type=Comment">Like <span class="badge badge-info">${comment.likes.length}</span></a>
                <div>
                    <a href="/comments/edit/${comment._id}" class="edit-comment target-comment-${comment._id}" data-targetComment="${comment._id}">Edit <i class="fas fa-edit"></i></a> &nbsp;
                    <a href="/comments/destroy/${comment._id}" class="delete-comment-button" data-test="${comment._id}">Delete <i class="fas fa-trash"></i></a> 
                </div>
            </div>
      </div>
  </div>`);
  }
  
  deleteComment(deleteLink,postId){
      $(deleteLink).click(function(e){
          e.preventDefault();
          $.ajax({
              type: 'get',
              url: $(deleteLink).prop('href'),
              success: function(data){
                 let commentsCount = parseInt($(`.toggle-comments-button-${postId}`).attr('data-comments'));
                 commentsCount-=1;
                 $(`.toggle-comments-button-${postId}`).attr('data-comments',commentsCount);
                 $(`.toggle-comments-button-${postId}`).children().html(`${commentsCount}`);
                  $(`#comment-${data.data.comment_id}`).remove();
                  new Noty({
                      theme: 'relax',
                      text: "Comment Deleted",
                      type: 'success',
                      layout: 'topRight',
                      timeout: 1500
                      
                  }).show();
              },error: function(error){
                  console.log(error.responseText);
              }
          });
      });
  }
  
  }
 
 
 
 {
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post,data.data.obj);
                    $('#posts-list-container').prepend(newPost);
                    deletePost($(' .delete-post-button',newPost)); 
                    editPost();
                    savePost();

                    
                    new PostComments(data.data.post._id);

                    new ToggleLike($(' .toggle-like-button', newPost));

                    $('.post-content-input').val("");

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

     // method to create a post in DOM
     let newPostDom = function(post,obj){
        return $(`<div class="container-fluid" id="post-${post._id}" style="padding:0px;">
        <div class="card" style="padding:1rem;margin-bottom:2rem;">
            <div class="card-header post-info flex-wrapper" style="height:3rem;background-color: lightblue;">
                <div class="profile-link-post" style="font-weight:700;">
                    <img src="${obj.profileUser.avatar}" width="30" height="30" class="rounded-circle"> &nbsp; <a href="/users/profile/${obj.profileUser._id}">${ obj.name }</a>&nbsp;
                </div>
                <div style="font-weight:750;">
                    ${obj.time} at ${post.time}
                </div>
            </div>
            <div class="card-body post-content-${post._id}" style="min-height:10rem;height:auto;">
                ${ post.content }
            </div>
            <div class="card-footer">
                <div class="posts-footer">
                    <div>
                        <a class="toggle-like-button" data-likes=${post.likes.length} href="/likes/toggle/?id=${post._id}&&type=Post">Like <span class="badge badge-info">${post.likes.length}</span></a>
                        <a data-toggle="collapse" class="toggle-comments-button-${post._id}" data-comments="${post.comments.length}"  href="#collapse${post._id}">Comments <span class="badge badge-info">${post.comments.length}</span></a><br>
                    </div>

                    <div id="delete">
                        <a href="/posts/edit/${post._id}" class="edit-post target-post-${post._id}" data-targetPost="${post._id}">Edit <i class="fas fa-edit"></i></a> &nbsp;
                        <a href="/posts/destroy/${post._id}" class="delete-post-button">Delete <i class="fas fa-trash"></i></a> 
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

                <div class="comments-section${post._id}">

                </div>
            </div>
        </div>`);
      }

      // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
// loop over all the existing posts on the page (when the window loads
// for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('#posts-list-container>div').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1];
             new PostComments(postId);
             
        });
    }



    createPost();
    convertPostsToAjax();

}