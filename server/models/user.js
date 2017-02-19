var mongoose = require('mongoose');

var User = mongoose.model('User', {
	email: {
		required: true,
		trim: true,
		type: String,
		minlength: 1
	}
});

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
