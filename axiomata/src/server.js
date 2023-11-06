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

app.listen(3000, function () {
  console.log('listening on 3000');
});

app.get('/courses', async (req, res) => {
  try {
    const courses = await db.collection('Courses').find().toArray();
    const courseNames = courses.map(a => ({ courseName: a.courseName }));
    res.json(courseNames)
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get('/chapters', async (req, res) => {
  try {
    const userName = req.query.userName;
    const courseName = req.query.courseName;

    let savedCourse = await db.collection('SaveStates').findOne({ userName: userName, courseName: courseName });

    if (!savedCourse) {
      const course = await db.collection('Courses').findOne({ courseName: courseName });

      const getLevels = ch => ch.levels.map(e => ({
        levelName: e.levelName,
        status:  'todo'
      }));

      const getChapterIndex = ch => course.chapters.findIndex(item => item.chapterName === ch.chapterName );

      savedCourse = {
        userName: userName,
        courseName: courseName,
        chapters: course.chapters.map(ch => ({ 
          chapterName: ch.chapterName, 
          unlocked: (getChapterIndex(ch) === 0 ? true : false),
          levels: getLevels(ch)
        }))
      };

      await db.collection('SaveStates').insertOne(savedCourse);
    }
    
    res.json(savedCourse.chapters);
  } catch(error) {
    res.status(500).json({ error: error });
  }
});

app.patch('/course', async (req, res) => {
  try {
    const chapterName = req.body.chapterName;
    const levelName = req.body.levelName;
    const newStatus = req.body.newStatus;

    const filter = { 
      userName: req.body.userName,
      courseName: req.body.courseName, 
    };

    let course = await db.collection('SaveStates').findOne(filter);

    const chapterIndex = course.chapters.findIndex(ch => ch.chapterName === chapterName);
    const levelIndex = course.chapters[chapterIndex].levels.findIndex(lev => lev.levelName === levelName);

    const updateLevel = {
      $set: {}
    };
    updateLevel.$set[`chapters.${chapterIndex}.levels.${levelIndex}.status`] = newStatus;

    let result = await db.collection('SaveStates').updateOne(filter, updateLevel);

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    // check if a new chapter gets unlocked
    course = await db.collection('SaveStates').findOne(filter);
    const unfinishedLevels = course.chapters[chapterIndex].levels.filter(lev => !(lev.status === 'done'));
    if (unfinishedLevels.length === 0) {
      const nextChapter = course.chapters[chapterIndex + 1];
      if (nextChapter) {
        const unlockChapter = {
            $set: {}
          };
        unlockChapter.$set[`chapters.${chapterIndex + 1}.unlocked`] = true;
        result = await db.collection('SaveStates').updateOne(filter, unlockChapter);
        if (result.modifiedCount === 0) {
          return res.status(500).json({ error: 'Failed to update status' });
        }
      }
    }

    res.json({ message: 'Status updated successfully' });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
})

