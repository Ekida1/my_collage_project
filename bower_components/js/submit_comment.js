$(function(){
  $('#submit_comment').click(function(){
    $.ajax({
      url:'/user/signin',
      type:'POST',
      dataType:'json',
      data:{
        cate:cate._id
      },
      success:function(data){
        $(function(){
  $('.comment').click(function(e){
    var target = $(this);
    var toId = target.data('tid');
    var commentId = target.data('cid');

    
    if($('#toId').length > 0 ){
        $('#toId').val(toId)
    }
    else{
$('<input>').attr({
        type:'hidden',
        id:'toId',
        name:'comment[tid]',
        value:toId
    }).appendTo('#commentForm')
    }
    
if($('#commentId').length > 0 ){
        $('#commentId').val(commentId)
    }
    else{
$('<input>').attr({
        type:'hidden',
        id:'commentId',
        name:'comment[cid]',
        value:commentId
        }).appendTo('#commentForm')
    }
  })
})

      },
      error:function(data){
        alert(data);
      }
    })
  })
})
