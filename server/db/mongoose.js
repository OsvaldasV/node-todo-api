var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// patikrina ar MONGODB_URI egzistuoja, jei ne tai naudoja localhost
// MONGODB_URI ateina is mongoLab addono Heroku
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};