const {ObjectID} = require('mongodb');
var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

// Todo.remove({}) for multiple deletes

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });


// grazina viena ir istrina
// Todo.findOneAndRemove({_id: '58aaa3121f21cb8d1a8e41db'}).then((todo) =>{
	
// });

// Todo.findByIdAndRemove
Todo.findByIdAndRemove('58aaa3121f21cb8d1a8e41db').then((todo) => {
	console.log(todo);
});