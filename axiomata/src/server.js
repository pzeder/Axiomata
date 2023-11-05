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
  db.collection('Courses').find().toArray()
    .then(results => {
      const courseNames = results.map(a => ({ courseName: a.courseName }));
      res.json(courseNames);
    })
    .catch(error => res.status(500).json({ error: 'An error occurred' }));
});

app.get('/levels', (req, res) => {
  const courseName = req.query.courseName;

  if (!courseName) {
    return res.status(400).json({ error: 'courseName is required' });
  }
  db.collection('Courses').find({ courseName: courseName }).toArray()
    .then(results => {
      const chapterAndLevelNames = results[0].chapters.map(a => ({ chapterName: a.chapterName, levelNames: a.levelNames }));
      res.json(chapterAndLevelNames);
    })
    .catch(error => res.status(500).json({ error: 'An error occurred' }));
});

app.listen(3000, function () {
  console.log('listening on 3000');
});
