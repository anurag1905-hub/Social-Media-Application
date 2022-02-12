{
    function editPost(){
        $('.edit-post').click(function(event){
           event.preventDefault();
           console.log('prevented');
           let targetPost = $(this).attr("data-targetPost");
           $(`.post-content-${targetPost}`).attr('contenteditable','true');
           $(`.post-content-${targetPost}`).css("border","2px solid black");
           $(`.target-post-${targetPost}`).replaceWith(`
              <a href="#" class="save-post target-post-${targetPost}" data-targetPost="${targetPost}">Save <i class="fas fa-save"></i></a>
           `)
           savePost();
        });
    }
    
    function savePost(){
        $('.save-post').click(function(event){
            event.preventDefault();
            console.log('Saving post prevented');
            let targetPost = $(this).attr("data-targetPost");
            // To pass html code with QueryString use encodeURIComponent otherwise full html is not sent.
            let newtext = encodeURIComponent($(`.post-content-${targetPost}`).html());
            if(newtext!=''){
                $.ajax({
                type:'get',
                url:`/posts/save/?id=${targetPost}&&content=${newtext}`,
                success: function(data){
                    console.log('post saved');
                    // decodeURIComponent is used to decode the URI
                    $(`.post-content-${targetPost}`).html(decodeURIComponent(newtext));
                },
                error:function(error){
                    console.log(error.responseText);
                }
                });
                $(`.post-content-${targetPost}`).attr('contenteditable','false');
                $(`.post-content-${targetPost}`).css("border","none");
                $(`.target-post-${targetPost}`).replaceWith(`
                    <a href="/posts/edit/${targetPost}" class="edit-post target-post-${targetPost}" data-targetPost="${targetPost}">Edit <i class="fas fa-edit"></i></a>
                `)
                editPost();
             }
        });
    }
    savePost();
    editPost();

}