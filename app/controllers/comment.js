var Comment = require('../models/comment'); //拿的就是数据库里的Schema


//comment
exports.save = function(req, res) {

  var _comment = req.body.comment;
  var movieId  = _comment.movie;
  var catId = _comment.category;
  
  if(_comment.cid){
    Comment.findById(_comment.cid,function(err,comment){
      var reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      }
      comment.reply.push(reply);//push进 reply对象中？
      comment.save(function(err, comment){
        if (err) {
        console.log(err)
      }
      console.log("成功回复评论");
      res.redirect('/movie/' + movieId +'/'+ catId) //表示 返回跳转到指定的网页
      })
    })
  }

else{
    var comment  = new Comment(_comment); //将前台取得的 comment 新建在数据库中
    comment.save(function(err, comment) {
      if (err) {
        console.log(err)
      }
      console.log("成功评论");
      res.redirect('/movie/' + movieId +'/'+ catId) //表示 返回跳转到指定的网页
     
        })
}
    
};

//delete main comment or reply comment
exports.delcomment = function(req,res){
  var _comment = req.params.id;  //为什么不写成前台传来的cid呢。因为这里取得的是一个键名，这个键名是根据routes里：id  来决定的
  //console.log("--------------" + _comment);
  if(_comment){
    Comment.remove({_id:_comment}, function(err, comment){ //表示在数据里去删除掉指定的id。
      if(err){
        console.log(err)
      }
      else{
        res.json({success: 1})
      }
    })
  }
};

//delete reply comment
// exports.delscomment = function(req,res){
//   var _reply = req.params.id;
//   console.log("--------------" + _reply);
//   if(_reply){
//     Comment.remove({_id:_reply},function(err,reply){
//       if(err){
//         console.log(err)
//       }
//       else{
//         res.json({success: 1})
//       }
//     })
//   }
// };
