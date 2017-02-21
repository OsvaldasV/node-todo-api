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
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

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
 		decoded = jwt.verify(token, 'abc123');
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
