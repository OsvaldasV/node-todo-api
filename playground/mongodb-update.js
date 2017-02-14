const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  // FindOneAndUpdate
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('58a2b600760bb270d7ae1a5f')
  // },{
  //   $set: {
  //     completed: true
  //   }, 
  // }, {
  //   returnOriginal: false
  // }).then((res) => {
  //   console.log(res);
  // })

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('58a2a0a3c0e1381b64f29a53')
  },{
    // mongodb operators is cia set paima
    $set: {
      name: 'Zosia'
    }, 
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((res) => {
    console.log(res);
  })
  // db.close();
});
