const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  // find argumentai yra query
  // db.collection('Todos').find({
  //   _id: new ObjectID('58a2a8f0760bb270d7ae1789')
  //   }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs,undefined,3));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count : ${count}`);
  //   console.log(JSON.stringify(docs,undefined,3));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').distinct('name').then((docs) => {
    // console.log(`Todos count : ${count}`);
    console.log(JSON.stringify(docs,undefined,3));
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  db.collection('Users').find({name: 'Andrew'}).toArray().then((docs) => {
    console.log(JSON.stringify(docs,undefined,3));
  });

  // db.close();
});
