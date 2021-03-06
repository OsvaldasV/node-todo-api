require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
// panaudoja destructioring es6, ikelia priklausomybe ir uzraso taip :
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req,res) => {
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then((doc) =>{
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos', authenticate, (req,res) => {
	Todo.find({
		_creator: req.user._id
	}).then((todos) =>{
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', authenticate, (req, res) => {

	// req.params bus toks id koki ideda linke
	// res.send(req.params);
	var id = req.params.id;
	
	if(!ObjectID.isValid(id)) {
		// 404 if not valid
		return res.status(404).send('Id not valid');
	}
	
	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		// {todo} geriau nes leidzia flexibility, jei reik dar kazka pridet lyginant su tiesiog todo
		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
		
});

app.delete('/todos/:id', authenticate, (req,res) => {
	// get the id
	var id = req.params.id;
	if(!ObjectID.isValid(id)) {
		// 404 if not valid
		return res.status(404).send('Id not valid');
	}
	// remove todo by id
	Todo.findOneAndRemove({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.status(200).send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.patch('/todos/:id', authenticate, (req,res) => {
	var id = req.params.id;
	// pick is lodash bibliotekos paima tas properties, kuriam mum reikia, jei jos egzistuoja ir taip apsaugo, kad useris beleko neprivestu
	var body = _.pick(req.body, ['text', 'completed']);

	if(!ObjectID.isValid(id)) {
		// 404 if not valid
		return res.status(404).send('Id not valid');
	}

	if(_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}
	// set is mongodb operatoriu ateina
	// pirmas argumentas id, antras argumentas values on our object, trecia argumentas yra options kaip kad mongodb-update returnOriginal : false ,kur yra, tai jis grazina new objekta be originalo, tai cia nustatom, kad grazintu new.
	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	}, {$set:body}, {new: true}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	})
})

app.post('/users', (req,res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		console.log(e);
		res.status(400).send(e);
	});
});

// kad route panaudotu middleware nurodom kintamaji kaip antra argumenta
app.get('/users/me', authenticate, (req,res) => {
	res.send(req.user);
});

app.post('/users/login', (req,res) => {
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};




