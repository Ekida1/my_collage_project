$(function(){
  $('.del').click(function(e){
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-' + id);
    
    var userId =$('.navbar-text span').first().attr('id');
    var myTr = $('.item-id-' + userId);
    var userTr = $('.item-id-' + userId );
    var userRole = userTr.children('td.role').html();
    var targetRole = tr.children('td.role').html();

    if (targetRole < userRole)
   {
    $.ajax({
      type:'DELETE',
      url:'/admin/user/list?id=' +id,
    })
     .done(function(results){
      if(results.success === 1 && tr.length > 0){
          tr.remove();
          alert('删除成功');
      }
    })
   }
   else if(targetRole > userRole){
     alert("抱歉，您没权限删除该用户");
   }
   else if (myTr.children('td.username').html() === tr.children('td.username').html()){
     alert("抱歉，你不能删除你自己")
   }
   else if(targetRole === userRole){
     alert("抱歉，你不能删除和你权限相同的用户");
   }
  })
})
