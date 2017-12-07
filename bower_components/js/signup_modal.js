$(function(){
  $('.submit_register').click(function(){
        $.ajax({
          url:'/user/signup',
          type:'POST',
          dataType:'json',
          data:{
            _username:$('.signupName').val(),
            _password:$('.signupPassword').val()
          },
        success:function(data){
          alert(data.tips);
          if(data.redirect == true){
            location.href = "http://localhost:3000/signin";
          }
          else if(data.redirect == false){
            $('.signupName').val("");
            $('.signupPassword').val("");
          }
        },
        error:function(data){
          alert(data);
		}
    //      .done(function(results){
    //   if(results.success === 1){
    //       alert("用户名已被注册，请重新输入用户名");
    //   }
    // })
  })
})
})
