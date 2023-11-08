const express = require('express');
const { MongoClient, ObjectId  } = require('mongodb');
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

app.get('/saveStateHeaders', async (req, res) => {
  try {
    const filter = { userName: req.query.userName }; 
    const saveStates = await db.collection('SaveStates').find(filter).toArray();
    const saveStateHeader = saveStates.map(s => ({ saveID: s._id, courseName: s.courseName }));
    res.json(saveStateHeader)
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get('/chapterHeaders', async (req, res) => {
  try {
    const saveID = req.query.saveID;
    const filter = ({ _id: new ObjectId(req.query.saveID) });
    const saveState = await db.collection('SaveStates').findOne(filter);

    const getLevelHeaders = ch => ch.levels.map(lev => ({
      levelName: lev.levelName,
      status: lev.status
    }));

    const chapterHeaders = saveState.chapters.map(ch => ({ 
      chapterName: ch.chapterName, 
      unlocked: ch.unlocked,
      levelHeaders: getLevelHeaders(ch)
    }));

    res.json(chapterHeaders);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get('/courses', async (req, res) => {
  try {
    const courses = await db.collection('Courses').find().toArray();
    const courseNames = courses.map(c => ({ courseName: c.courseName }));
    res.json(courseNames)
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.post('/newSaveState', async (req, res) => {
  try {
    const { userName, courseName } = req.body;
    const courseData = await db.collection('Courses').findOne({ courseName: courseName });
    const getChapterIndex = ch => courseData.chapters.findIndex(item => item.chapterName === ch.chapterName);

    const getLevels = ch => ch.levels.map(e => ({
      levelName: e.levelName,
      status: 'todo'
    }));

    const courseSave = {
      userName: userName,
      courseName: courseName,
      chapters: courseData.chapters.map(ch => ({
        chapterName: ch.chapterName,
        unlocked: (getChapterIndex(ch) === 0 ? true : false),
        levels: getLevels(ch)
      }))
    };

    const result = await db.collection('SaveStates').insertOne(courseSave);
    res.json({saveID: result.insertedId});
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.patch('/saveState', async (req, res) => {
  try {
    const { saveID, chapterName, levelName, newStatus } = req.body;
    const filter = ({ _id: new ObjectId(saveID) });
    let saveState = await db.collection('SaveStates').findOne(filter);

    const chapterIndex = saveState.chapters.findIndex(ch => ch.chapterName === chapterName);
    const levelIndex = saveState.chapters[chapterIndex].levels.findIndex(lev => lev.levelName === levelName);

    const updateLevel = {
      $set: {}
    };
    updateLevel.$set[`chapters.${chapterIndex}.levels.${levelIndex}.status`] = newStatus;

    let result = await db.collection('SaveStates').updateOne(filter, updateLevel);

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    // check if a new chapter gets unlocked

    courseSave = await db.collection('SaveStates').findOne(filter);

    const nextChapter = courseSave.chapters[chapterIndex + 1];
    const unfinishedLevels = courseSave.chapters[chapterIndex].levels.filter(lev => !(lev.status === 'done'));

    if (nextChapter && unfinishedLevels.length === 0) {
      const unlockChapter = { $set: {} };
      unlockChapter.$set[`chapters.${chapterIndex + 1}.unlocked`] = true;
      result = await db.collection('SaveStates').updateOne(filter, unlockChapter);
      if (result.modifiedCount === 0) {
        return res.status(500).json({ error: 'Failed to update status' });
      }
    }

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

