function removeFriend(){$(".remove-friend").click(function(e){e.preventDefault(),$.ajax({type:"get",url:$(this).prop("href"),success:function(e){$(".profile-"+e.data.profile).remove(),new Noty({theme:"relax",text:"Friend Removed",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){new Noty({theme:"relax",text:"Error",type:"error",layout:"topRight",timeout:1500}).show()}})})}removeFriend();