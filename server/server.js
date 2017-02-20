var {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');
// panaudoja destructioring es6, ikelia priklausomybe ir uzraso taip :
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) =>{
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos', (req,res) => {
	
	Todo.find().then((todos) =>{
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', (req, res) => {

	// req.params bus toks id koki ideda linke
	// res.send(req.params);
	var id = req.params.id;
	
	if(!ObjectID.isValid(id)) {
		// 404 if not valid
		return res.status(404).send('Id not valid');
	}
	
	Todo.findById(id).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		// {todo} geriau nes leidzia flexibility, jei reik dar kazka pridet lyginant su tiesiog todo
		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
		
});

app.delete('/todos/:id', (req,res) => {
	// get the id
	var id = req.params.id;
	if(!ObjectID.isValid(id)) {
		// 404 if not valid
		return res.status(404).send('Id not valid');
	}
	// remove todo by id
	Todo.findByIdAndRemove(id).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.status(200).send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};




