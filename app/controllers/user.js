var User = require('../models/user');

//signup
exports.signup = function(req,res){
  var _username = req.body._username;
  var _password = req.body._password;
  console.log(req.body);
  User.findOne({name:_username},function(err,user){
    if(err){
      console.log(err)
    }
    if(user){ //判断是否注册相同的用户名
       console.log("用户名已被注册，请重新输入用户名");
       var ajaxTips={
         tips:"用户名已存在，请重新输入用户名",
         redirect:false
       };
       res.json(ajaxTips);
    }
    else{
      var user = new User({
        'name':_username,
        'password':_password
      })
      

         if(_username === ""){
          console.log("注册用户名为空")
          var ajaxTips = {
            tips: "输入用户名不能为空，请重新输入",
            redirect:false,
          };
          res.json(ajaxTips);
        }
        else if (_password === ""){
          console.log("注册密码为空")
          var ajaxTips = {
            tips: "输入密码不能为空，请重新输入",
            redirect:false,
          };
          res.json(ajaxTips);
        }
        else{
      user.save(function(err,user){  //存储到数据库的操作
        if(err){
          console.log(err)
        }
        console.log("New user");
        var ajaxTips = {
          tips:"成功添加一个新用户!",
          redirect: true,
        };
       //  res.contentType('json');//返回的数据类型
        res.json(ajaxTips);
        
      })
      }
    }
  })
};

//show_signup
exports.showsignup = function(req,res){
     res.render('signup', {
       title:'注册页面'
     })
   };


//signin
exports.signin = function(req,res){
  var _user = req.body.user;
  var _username = req.body._username;
  var _password = req.body._password;
  User.findOne({name:_username},function(err,user){
    if(err){
    console.log(err)
  }

  if(!user || _username == ""){
    console.log('您还未注册此用户或用户名为空，请注册用户后再登录')
    var ajaxtip = {
      tip:'您还未注册此用户或用户名为空，请确认注册用户后再登录',
      redirect: false
    };
    res.json(ajaxtip);
  }
  else{
   user.comparePassword(_password,function(err,isMatch){
     if(err){
       console.log(err)
     }

     if(isMatch){
       req.session.user = user; //将用户信息放到session中
       if(user.role <= 10) {
       console.log('成功登录');
       var ajaxtip = {
         tip:'登录成功',
         redirect:0,
       };
       res.json(ajaxtip);
      }
      else {
        console.log('成功登录');
       var ajaxtip = {
         tip:'管理员登录成功',
         redirect:1,
       };
       res.json(ajaxtip);
      }
     }
     else{
       console.log('Password is not matched')
       var ajaxtip = {
         tip:'密码输入错误'
       };
       res.json(ajaxtip);
     }
   })
}
  })
};

//showsignin
exports.showsignin = function(req,res){
       res.render('signin', {
         title:'登录页面'
       })
};



//signout
exports.signout = function(req,res){
  delete req.session.user;  //删除session会话中的用户信息
  //delete app.locals.user;   //删除页面上渲染的用户名
  res.redirect('/');
};

//userlist page
exports.list = function(req,res){
  User.fetch(function(err, users) {
    if (err) {
      console.log(err);
    }
    res.render('userlist', { //render是渲染，而第一个参数代表渲染哪一个jade模版的名字
      title: 'Hello Bunny电影小屋———— 用户列表页',
      users: users,
    })
  })
}


//midware for user
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  if(!user){

    return res.redirect('/signin')
  }
   next();

};

exports.adminRequired =function(req, res, next){
  var user = req.session.user;

  if(user.role <= 10){
     return res.redirect('/errorpage')
    // console.log("您未获得进入该界面的权限");
  }
  next();
}

//list delete user
exports.userdelete = function(req,res){
  var id = req.query.id;
  if(id){
    User.remove({_id:id},function(err,movie){
      if(err){
        console.log(err);
      }
      else{
        res.json({success:1})
        console.log(id);
      }
    })
  }
};
