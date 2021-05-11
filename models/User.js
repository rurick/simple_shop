'use strict'
const _ = require("underscore");
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('autoIndex', true);
const crypto = require('crypto');

const UserSchema = mongoose.Schema({
	name: String,
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	session_id: {
		type: String,
		default: ''
	},
	is_admin: {
		type: Boolean, 
		default: false
	}
});

var userModel = mongoose.model('User', UserSchema);
var User = _.extend(
	userModel,
	{
		create: function(userData){
			userData.password = hash(userData.password)
			var u = new userModel(userData);
			u = u.save();
			u.catch((err)=>{
				if (err.code == 11000){
					console.log("Dublicate user email")
				} else {
					Promise.reject(err);
				}	
			});
			return u;
		},

		get: function(id){
			const u = this.findById(id);
			u.catch((e) => {
				throw("User Id error");
			});
			return u;
		},

		getByEmail: function(email){
			//email is String or {email: 'email'}
			if (!_.isString(email)){
				email = email.email;
			}
			return this.findOne({email: email});
		},

		//проверка пользователя по имени и паролю
		check: function (userData){
			return this
			.findOne({email: userData.email})
			.then(function (user){
				if (user && user.password === hash(userData.password)){
					console.log('User check OK');
					return Promise.resolve(user);
				} else {
					return Promise.resolve(false);
				}
			})
		},

		update: function(userData){
			let data = _.clone(userData);
			if (userData.password)
				data.password = hash(userData.password);
			return userModel.where({_id: userData._id}).updateOne(data).exec();
		},

		delete: function(userData){
			//userData is _id Number or {_id: 'id'}
			let id = _.isString(userData) ? userData : userData._id;
			return userModel.deleteOne({_id: id}).exec();
		},

		all: function(){
			return this
			.find()
			.then( (objs) => {
				return Promise.resolve(objs);
			});
		}
	}
);

function hash(text) {
	return crypto.createHash('sha1').update(text).digest('base64')
}

module.exports = User;
