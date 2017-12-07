var Movie = require('../models/movie'); //就是数据库里的Schema
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');
var fs = require('fs');     //这是一个 读写文件的模块
var path = require('path');  //这是一个读取文件路径的模块



//detail page
exports.detail = function(req, res) {
  
  var id = req.params.id;  //获取前台电影主键的id
  var catId = req.params.cat;  //接收前台URL中传来的的 #cat{_id} params.cat 的cat命名规则是根据routes.js中的路由来的
  Category      //打开Category数据库表格
  .find({_id:catId})  //在Category表格中 找到 catId相应的 category名字的_id
  .exec(function(err,category){
        if(err){
          console.log(err)
        }
        console.log("++++++++++++start++++++++++++++++" + category  +"---------------end----------------")
  var category = category[0] || {};  //找到后（由于Schema的category里设计的是[]一个数组，又因为只有一个），通过var category = category[0]的方式传值
  Movie.update({_id:id}, {$inc:{pv:1}}, function(err){
      if(err){
        console.log(err)
      }
    })
  Movie.findById(id, function(err, movie) {
    //console.log(movie);
    Comment
     .find({movie:id}) //找到电影的主键
     .populate('from' , 'name')  //找到from里的主键 ObjectId，然后把每个ID的用户名name的这个数据返回回来
     .populate('reply.from reply.to', 'name')
     .exec( function(err,comments){  //把name返回回来填充到exec方法里
      res.render('detail', {
        title: '预告片预览——' + movie.title,
        cat:category,
        movie: movie,
        comments:comments
     })
    })
  })
   })
};

//admin page
exports.new = function(req, res) {
  Category.find({},function(err,categories){ //find({},为空代表找到所有
res.render('admin', {
    title: '后台录入页',
    categories:categories,
    movie: {}
  })
  })
};

//admin update movie
exports.update = function(req, res) {
  var id = req.params.id;

  if (id) {
    Movie.findById(id, function(err, movie) {
       Category.find({},function(err,categories){
      res.render('admin', {
        title: '后台更新页面',
        movie: movie,
        categories:categories
      })
    })
    })
  }
};

//admin poster
exports.savePoster = function(req,res,next){
  var posterData = req.files.uploadPoster;
  var filePath = posterData.path;
  var originalFilename = posterData.oringinalFilename;
  console.log("^^^^^^^^^^^^^^^^^"+ req.files + "^^^^^^end^^^^^^^")

  if(originalFilename){
    fs.readFile(filePath, function(err,data){
      var timestamp = Date.now();
      var type = posterData.type.split('/')[1];
      var poster = timestamp + '.' + type;
      var newPath = path.join(_dirname, '../../' , '/public/upload/' + poster);

      fs.writeFile(newPath , data, function(err){
        if (err) {
        console.log(err)
      }
        req.poster = '/upload/'+poster;
        next();
      })
    })
  }
  else{
    next();
  }
}

//admin post movie
exports.save = function(req, res) {
  var id = req.body.movie._id;
  var catid = req.body.movie.category;
  var movieObj = req.body.movie;
  var _movie;
  if(req.poster){
    movieObj.poster = req.poster;
  }
  if (id) {
    Movie.findById(id, function(err, movie) { //数据库通过ID查询
      if (err) {
        console.log(err)
      }

      _movie = _.extend(movie, movieObj) 
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err)
        }
        res.redirect('/movie/' + movie._id +'/' + catid)

      })
    })
  }
  else {
    _movie = new Movie(movieObj);
    var categoryId = movieObj.category;
    var categoryName = movieObj.categoryName;
    _movie.save(function(err, movie) {
      if (err) {
        console.log(err)
      }
      console.log(movieObj);
      if(categoryId){
      Category.findById(categoryId, function(err,category){
        category.movies.push(movie._id)

        category.save(function(err,category){
        res.redirect('/movie/' + movie._id +'/' + catid) //表示 返回跳转到指定的网页
        })
      })
    }
    else if(categoryName){
     var category = new Category({
       name:categoryName,
       movies:[movie._id]
     })
      category.save(function(err,category){
        movie.category = category._id
        movie.save(function(err,movie){
          res.redirect('/movie/' + movie._id +'/' + catid)
        })
        
      })
    }
        })
  }
};

//list page
exports.list = function(req, res) { 
      Movie
        .find({})
        .exec(function(err,movies){
          if (err) {
            console.log(err)
          }
          //console.log('-------test-------\n',movies);
          res.render('movielist', { //render代表渲染页面
            title: 'Hello Bunny电影小屋————电影列表页',
            movies: movies
          })
        })
};


//list delete movie
exports.del = function(req,res){ //req代表“取得”，res“送回前端”，第一个参数代表回传到哪个网页端口去
  var id = req.query.id;
  console.log(id);
  if(id){
    Movie.remove({_id: id}, function(err,movie){ //表示在数据里去删除掉指定的id。
      if(err){
        console.log(err)
      }
      else{
        res.json({success: 1})
      }
    })
  }
};
