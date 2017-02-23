const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	email: {
		required: true,
		trim: true,
		type: String,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
			}
	},
	password: {
		type:String,
		require:true,
		minlength: 6
	},
	tokens: [{
		access: {
			type:String,
			require: true
		},
		token: {
			type:String,
			require: true
		}
	}]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function(token) {
 // instance methodai su mazaja raide prasideda, model metodai su didziaja.
 	var User = this;
 	var decoded;

 	try{
 		decoded = jwt.verify(token, process.env.JWT_SECRET);
 	} catch(e) {
 		// return new Promise((resolve,reject) =>{
 		// 	reject();
 		// });
 		// daro ta pati, ka uzkomentuotas kodas
 		return Promise.reject();
 	}

 	return User.findOne({
 		_id: decoded._id,
 		'tokens.token': token,
 		'tokens.access' : 'auth'
 	});
};

UserSchema.methods.removeToken = function(token) {
	// $pull lets you remove certain items from the array which match certain criteria
	var user = this;

	return user.update({
		$pull: {
			tokens: {token}
		}
	});
};

UserSchema.statics.findByCredentials = function(email, password) {
	var User = this;

	return User.findOne({email}).then((user) => {
		if(!user){
			return Promise.reject();
		}
		// bcrypt.compare only support callbacks and he wants to use a promise
		return new Promise((resolve, reject) => {
			// use bcrypt.compare to compare password and user.password
			bcrypt.compare(password, user.password, (err,res) => {
				if(res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};
UserSchema.pre('save', function (next){
	var user = this;

	if(user.isModified('password')){
		var password = user.password;
		bcrypt.genSalt(10, (err, salt) =>{
			bcrypt.hash(password,salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});	
	} else {
		next();
	}
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
// kaip sukurti useri pvz

// var newUser = new User({
// 	email: 'vasia@vasia.lt '
// });

// newUser.save().then((doc) => {
//  console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
// 	console.log('Unable to save user', e);
// });

// var newUser1 = new User({
// 	email: ' '
// });

// newUser1.save().then((doc) => {
//  console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
// 	console.log('Unable to save user', e);
// });
