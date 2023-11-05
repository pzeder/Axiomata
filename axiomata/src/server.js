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

app.get('/courses', async (req, res) => {
  try {
    const courses = await db.collection('Courses').find().toArray();
    const courseNames = courses.map(a => ({ courseName: a.courseName }));
    res.json(courseNames)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/levels', async (req, res) => {
  try {
    const courseName = req.query.courseName;

    if (!courseName) {
      return res.status(400).json({ error: 'courseName is required' });
    }
    const course = await db.collection('Courses').findOne({ courseName: courseName });
    const chapterAndLevelNames = course.chapters.map(a => ({ chapterName: a.chapterName, levelNames: a.levelNames }));
    res.json(chapterAndLevelNames);
  } catch(error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3000, function () {
  console.log('listening on 3000');
});
