$(function(){
  $('.submit_signin').click(function(){
    $.ajax({
      url:'/user/signin',
      type:'POST',
      dataType:'json',
      data:{
        _username:$('.signinName').val(),
        _password:$('.signinPassword').val()
      },
      success:function(data){
        alert(data.tip);
        //alert($('.signinName').val());
        if(data.redirect == 0 ){
            location.href = "http://localhost:3000/";
          }
        else if (data.redirect == 1 ) {
            location.href = "http://localhost:3000/preadmin";
          }
        else if(data.redirect == false){
          $('.signinName').val("");
          $('.signinPassword').val("");
        }

      },
      error:function(data){
        alert(data);
      }
    })
  })
})
