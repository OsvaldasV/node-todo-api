const {ObjectID} = require('mongodb');
var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

var id = '58a9dfe00a19645073e1ba31';
var userId = '58a706b8841380373ef3ad68';

if(!ObjectID.isValid(id)) {
	console.log('ID not valid');
}

if(!ObjectID.isValid(userId)) {
	console.log('User ID not valid');
}

// cia rezultatas gaunasi array
// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log('Todos', todos);
// });

// grazina tik 1 irasa findOne funkcija
// cia rezultatas bus objektas
// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
// 	if(!todo) {
// 		return console.log('Id not found');
// 	}
// 	console.log('Todo By id', todo);
// }).catch((e) => console.log(e));

// user pridet ir paqurinti
User.findOne({
	_id: userId
}).then((user) => {
	if(!user) {
		return console.log('Unable to find user');
	}
	console.log('User', user);
}).catch((e) => console.log(e));