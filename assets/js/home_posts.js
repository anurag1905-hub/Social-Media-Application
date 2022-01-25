class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    
    constructor(postId){
          this.postId = postId;
          this.postContainer = (`.comments-section${postId}`);
          this.newCommentForm = $(`.post-${postId}-comments-form`);
          this.helper = (`.post-${postId}-comments-form`);
          //console.log(this.newCommentForm);
          this.createComment(postId);
          let self = this;
          // call for all the existing comments
          // $('.delete .delete-comment-button').hide();
          //   $(' .delete-comment-button', this.postContainer).each(function(){
          //     //console.log('hey');
        //       self.deleteComment($(this));
        //   });
        // console.log($(this.postContainer).find('.delete-comment-button').length);
            $(this.postContainer).find('.delete-comment-button').each(function(){
               // console.log('FFFF');
                self.deleteComment($(this));
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
                  let newComment = pSelf.newCommentDom(data.data.obj,data.data.comment);
                  $(`.comments-section${postId}`).append(newComment);
                  pSelf.deleteComment($(' .delete-comment-button', newComment));
                  console.log($(' .delete-comment-button', newComment));
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
          <div style="font-weight:700;">
              ${obj.name}&nbsp;
          </div>
          <div>
              ${obj.time}
          </div>
      </div>
      <div class="card-body"> 
          <div class="comments-footer">
              <div>
                  ${comment.content}
              </div>
              <div id="delete">
                    <a href="/comments/destroy/${comment._id}" class="delete-comment-button" data-test="${comment.id}">Delete <i class="fas fa-trash"></i></a> 
              </div>
          </div>
      </div>
  </div>`);
  }
  
  deleteComment(deleteLink){
      console.log('Reached');
      $(deleteLink).click(function(e){
        console.log('prevented');
          e.preventDefault();
          $.ajax({
              type: 'get',
              url: $(deleteLink).prop('href'),
              success: function(data){
                console.log('DELETED');
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

                    // call the create comment class
                    new PostComments(data.data.post._id);
                    //console.log(data.data.post._id);

                    new ToggleLike($(' .toggle-like-button', newPost));

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
        return $(`<div class="container" id="post-${post._id}" style="padding:0px;">
        <div class="card" style="padding:1rem;margin-bottom:2rem;">
            <div class="card-header post-info flex-wrapper" style="height:3rem;background-color: lightblue;">
                <div style="font-weight:700;">
                    ${ obj.name }
                </div>
                <div style="font-weight:750;">
                    ${obj.time}
                </div>
            </div>
            <div class="card-body" style="min-height:10rem;height:auto;">
                ${ post.content }
            </div>
            <div class="card-footer">
                <div class="posts-footer">
                    <div>
                        <a data-toggle="collapse" href="#collapse${post.id}">Comments <span class="badge">${post.comments.length}</span></a><br> 
                    </div>

                    <div id="delete">
                        <a href="/posts/destroy/${post._id}" class="delete-post-button">Delete <i class="fas fa-trash"></i></a> 
                    </div>
                </div>
            </div>

            <div id="collapse${post.id}" class="panel-collapse collapse container-fluid group-comments" style="padding-left:2rem;background-color: lightgrey;">

                <form action="/comments/create/" method="post" class="post-${post._id}-comments-form" style="margin-top:1rem;margin-bottom:1rem;">
                    <div class="form-group">
                        <input type="text" name="content" class="form-control" placeholder="Add a comment" required>
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
        //console.log(deleteLink);
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
            //console.log(postId);
             new PostComments(postId);
             
        });
    }



    createPost();
    convertPostsToAjax();

}