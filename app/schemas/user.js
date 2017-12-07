var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
  name:{
    unique:true,
    type:String
  },
  password:String,
  
  //0:normal user
  //1:verified user
  //2:high user
  //>10:admin user
  //>50:super admin user
  role:{
    type:Number,
    default:0
  },
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

 UserSchema.pre('save', function(next){
   var user = this; //???????
 	if(this.isNew){
 		this.meta.createAt = this.meta.updateAt = Date.now()
 	}
 	else{
 		this.meta.updateAt = Date.now()
 	}
  bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
    if(err) return next(err)

    bcrypt.hash(salt.password, salt,function(err,hash){
      if(err) return next(err)
      user.password = hash;
      next()
    })
  });
 	next();
 })

UserSchema.methods = {
  comparePassword: function(_password,cb){
    var user = this;
    bcrypt.compare(_password,user.password, function(err,isMatch){
      if(err) return cb(err)

      //cb(null,isMatch)
      if(_password==user.password){
 return cb(null,true);
}
else{
 return cb(null,false);
 }
})

  }
}


  UserSchema.statics = {
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


  module.exports = UserSchema; //将数据结构模块化，好让app.js引用