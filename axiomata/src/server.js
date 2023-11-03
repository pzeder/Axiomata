const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const url = 'mongodb://0.0.0.0:27017';
const dbName = 'Axiomata';
let db;

MongoClient.connect(url)
  .then(client => {
    console.log('Connected to Database');
    db = client.db(dbName);
  })
  .catch(error => console.error(error));

app.get('/courses', (req, res) => {
  db.collection('Levels').find().toArray()
    .then(results => {
      const courseNames = results.map(doc => doc.courseName);
      res.json(courseNames);
    })
    .catch(error => res.status(500).json({ error: 'An error occurred' }));
});

app.listen(3000, function () {
  console.log('listening on 3000');
});
