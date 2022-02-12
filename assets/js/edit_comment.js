{
    function editComment(){
        $('.edit-comment').click(function(event){
           event.preventDefault();
           console.log('prevented');
           let targetComment = $(this).attr("data-targetComment");
           $(`.comment-content-${targetComment}`).attr('contenteditable','true');
           $(`.comment-content-${targetComment}`).css("border","2px solid black");
           $(`.target-comment-${targetComment}`).replaceWith(`
              <a href="#" class="save-comment target-comment-${targetComment}" data-targetComment="${targetComment}">Save <i class="fas fa-save"></i></a>
           `)
           saveComment();
        });
    }

    function saveComment(){
        $('.save-comment').click(function(event){
            event.preventDefault();
            console.log('Saving comment prevented');
            let targetComment = $(this).attr("data-targetComment");
            // To pass html code with QueryString use encodeURIComponent otherwise full html is not sent.
            let newtext = encodeURIComponent($(`.comment-content-${targetComment}`).html());
            if(newtext!=''){
                $.ajax({
                type:'get',
                url:`/comments/save/?id=${targetComment}&&content=${newtext}`,
                success: function(data){
                    console.log('comment saved');
                    // decodeURIComponent is used to decode the URI
                    $(`.comment-content-${targetComment}`).html(decodeURIComponent(newtext));
                },
                error:function(error){
                    console.log(error.responseText);
                }
                });
                $(`.comment-content-${targetComment}`).attr('contenteditable','false');
                $(`.comment-content-${targetComment}`).css("border","none");
                $(`.target-comment-${targetComment}`).replaceWith(`
                    <a href="/comments/edit/${targetComment}" class="edit-comment target-comment-${targetComment}" data-targetComment="${targetComment}">Edit <i class="fas fa-edit"></i></a>
                `)
                editComment();
             }
        });
    }
    
    editComment();
    saveComment();
}