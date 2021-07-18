const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
	name:{
		type: String,
		required: [true,'add a name']
	},
	email:{
		type: String,
		required: [true,'add an email']
	},
	password:{
		type: String,
		required: [true,'insert a password']
	},
	createdAt:{
		type:Date,
		default:Date.Now
	}

});

module.exports=mongoose.model('User',UserSchema);
