function acceptRequest(){$(".accept-request").click(function(e){e.preventDefault(),$.ajax({type:"get",url:$(this).prop("href"),success:function(e){$(".profile-"+e.data.profile).remove(),new Noty({theme:"relax",text:"Request Accepted",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){new Noty({theme:"relax",text:"Error",type:"error",layout:"topRight",timeout:1500}).show()}})})}function rejectRequest(){$(".reject-request").click(function(e){e.preventDefault(),$.ajax({type:"get",url:$(this).prop("href"),success:function(e){$(".profile-"+e.data.profile).remove(),new Noty({theme:"relax",text:"Request Rejected",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){console.log(e.responseText),new Noty({theme:"relax",text:"Error",type:"error",layout:"topRight",timeout:1500}).show()}})})}acceptRequest(),rejectRequest();