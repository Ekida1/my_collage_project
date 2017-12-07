var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId; //设置主键，每一个Schema默认配置的属性，属性名就是 _id

var CommentSchema = new Schema({
  category:{type:ObjectId, ref:'Category'},
  movie:{type:ObjectId, ref:'Movie'},//关联Movie的Schema
  from:{type:ObjectId, ref:'User'}, //评论来自于的人
  reply:[{
	  from:{type:ObjectId, ref:'User'}, //评论来自于的人
      to:{type:ObjectId, ref:'User'},  //被回复的人
      content:String
  }],
  //其中ObjectId是主键
  content:String, //评论的内容
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

 CommentSchema.pre('save', function(next){
 	if(this.isNew){
 		this.meta.createAt = this.meta.updateAt = Date.now()
 	}
 	else{
 		this.meta.updateAt = Date.now()
 	}
 	next();
 })

  CommentSchema.statics = {
  	fetch: function(cb){
  		return this
  		.find({})
  		.sort('meta.updateAt')
  		.exec(cb);
  	},
  	findById: function(id,cb){
  		return this
  		.findOne({_id:id})
  		.exec(cb);
  	}
  }


  module.exports = CommentSchema;
