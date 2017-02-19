var mongoose = require('mongoose');
// Creating todo model
var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}, 
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}
});

module.exports = {Todo};
// Sukuriam nauja irasa(instance)
// var newTodo = new Todo({
// 	text: 'Wow, this works!'
// });
// Issaugom irasa i db

// newTodo.save().then((doc) => {
//  console.log('Saved todo', doc);
// }, (e) => {
// 	console.log('Unable to save to do');
// });

// Sukuriam nauja irasa(instance)
// var newTodo1 = new Todo({
// 	text: "Super !",
// 	completed: false,
// 	completedAt: 123
// });
// Issaugom irasa i db

// newTodo1.save().then((doc) => {
//  console.log('Saved todo', doc);
// }, (e) => {
// 	console.log('Unable to save to do');
// });

// Kita atvaizdavimo forma
// newTodo1.save().then((doc) => {
//  console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
// 	console.log('Unable to save to do');
// });