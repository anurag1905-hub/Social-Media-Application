{function editPost(){$(".edit-post").click((function(t){t.preventDefault();let e=$(this).attr("data-targetPost");$(`.post-content-${e}`).attr("contenteditable","true"),$(`.post-content-${e}`).css("border","2px solid black"),$(`.target-post-${e}`).replaceWith(`\n              <a href="#" class="save-post target-post-${e}" data-targetPost="${e}">Save <i class="fas fa-save"></i></a>\n           `),savePost()}))}function savePost(){$(".save-post").click((function(t){t.preventDefault();let e=$(this).attr("data-targetPost"),s=encodeURIComponent($(`.post-content-${e}`).html());""!=s&&($.ajax({type:"get",url:`/posts/save/?id=${e}&&content=${s}`,success:function(t){$(`.post-content-${e}`).html(decodeURIComponent(s))},error:function(t){console.log(t.responseText)}}),$(`.post-content-${e}`).attr("contenteditable","false"),$(`.post-content-${e}`).css("border","none"),$(`.target-post-${e}`).replaceWith(`\n                    <a href="/posts/edit/${e}" class="edit-post target-post-${e}" data-targetPost="${e}">Edit <i class="fas fa-edit"></i></a>\n                `),editPost())}))}savePost(),editPost()}