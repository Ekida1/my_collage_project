var Movie = require('../models/movie');
var Category = require('../models/category');

//index page
exports.index = function(req,res){
    
    // Category.find({}, function (err, categories) {
    //     if (err) {
    //         console.log(err)
    //     }
 
    //     var map = {}
    //     for (i in categories) {
    //         map[categories[i]._id] = i
    //         categories[i].movies=[]
    //     }
    //     console.log("++++++++++++++" + map);
         
    //     Movie.find({}, function (err, movies) {
    //         for (i in movies) {
    //             categories[map[movies[i].category]].movies.push(movies[i])
    //         }
    //         res.render('index', {
    //             title: '欢迎来到淋淋的地才世界 首页',
    //             categories: categories
    //         })
    //     })
    // })
    Category
      .find({})
      .populate({path:'movies', options:{limit: 6} , select:'title poster'})
      .exec(function(err,categories){
        if(err){
          console.log(err)
        }
        var title = "欢迎来到Hello Bunny电影小屋 首页";
      res.render('index', {
        title: title,
        categories: categories
      })
      })
}

//error page
exports.errorpage = function(req,res) {
    res.render('error' , {
      title: "错误信息页面",
    })
}

//preadmin page
  exports.preadmin = function(req,res) {
    res.render('preadmin' , {
      title: "后台首页",
    })
}

//search page
exports.search = function(req,res){
   var catId = req.query.cat;
   var page = parseInt(req.query.p,10) || 0;//转换为10进制数
   var q = req.query.q;
   console.log("++++++++++++TEST++++++++++++++++" + page);
   var count= 3;
   var index = page * count;

    if(catId){


    Category
      .find({_id:catId})
      .populate({
                 path:'movies', 
                 //options:{limit: 2, skip:index}, 
                 select:'title poster' //要它的 title电影名字 和 poster海报
                })
      .exec(function(err,categories){
        if(err){
          console.log(err)
        }
        var category = categories[0] || {};
        console.log("++++++++++++TEST++++++++++++++++\n"  + category);
        var movies = category.movies || [];
        var results = movies.slice(index, index + count );
        res.render('results', {
        title: '结果列表页面',
        keyword:category.name,
        currentPage: (page + 1), //page为前台 p参数传进来的值。
        query:'cat=' + catId, //输送 cat= catId到前台，此处前台在li 按钮的url上获取的query
        totalPage:Math.ceil(movies.length / count ), //向上取整
        movies: results,
        cat:category //向前台输送category的内容，前台通过key值cat接收
      })
    })
     }
     else if(q){
       Movie
         .find({title:new RegExp(q+'.*', 'i')})  //正则表达式
         .exec(function(err,movies){
           if(err){
          console.log(err)
        }
        var results = movies.slice(index, index + count );

        res.render('search', {
        title: '结果列表页面',
        currentPage: (page + 1), //page为前台 p参数传进来的值。
        query:'q=' + q, //输送 cat= catId到前台，此处前台在li 按钮的url上获取的query
        totalPage:Math.ceil(movies.length / count ), //向上取整
        movies: results,
        //cat:category //向前台输送category的内容，前台通过key值cat接收
         })
            }) 
     }
}
