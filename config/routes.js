var Index = require('../app/controllers/index');
var User  = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');
//以上分别 链接到controllers 文件夹里的js文件

module.exports = function(app){ //与app.js做链接

//pre handle user 预处理用户名的渲染
app.use(function(req, res, next){
  var _user = req.session.user;
  //if(_user){
    app.locals.user = _user;   //渲染出页面上的 用户名
  //}
    next();  //?????????????????????????
})
//Index page
app.get('/', Index.index);
app.get('/errorpage',Index.errorpage);
app.get('/preadmin', User.signinRequired, User.adminRequired, Index.preadmin);

//User
app.post('/user/signup', User.signup);
app.post('/user/signin', User.signin);
app.get('/logout', User.signout);
app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list); //加上各种Required是为了加上管理员权限
app.get('/signup', User.showsignup);
app.get('/signin', User.showsignin);
app.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.userdelete);
//Movie
app.get('/movie/:id/:cat', Movie.detail);
app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.new);
app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save);//这些参数的摆放顺序是有规则的，next()才会挨个next下去
app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

//Comment
 app.post('/user/comment' , User.signinRequired, Comment.save);
 app.delete('/movie/:id' , User.signinRequired, Comment.delcomment);//删除主评论
 //app.delete('/movie/:id', User.signinRequired, Comment.delscomment);//删除回复评论

//Category
 app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
 app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
 app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);

// results
app.get('/results', Index.search)
}
