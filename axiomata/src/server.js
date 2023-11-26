const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
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
    const filter = ({ _id: new ObjectId(saveID) });
    const saveState = await db.collection('SaveStates').findOne(filter);

    const getLevelHeaders = ch => ch.levels.map(lev => ({
      levelName: lev.levelName,
      status: (lev.status === 'todo' && lev.sequenceHistory.length > 1) ? 'busy' : lev.status
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

app.get('/edits', async (req, res) => {
  try {
    const edits = await db.collection('Edits').find().toArray();
    const editHeaders = edits.map(e => ({ _id: e._id, title: e.title }));
    res.json(editHeaders);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.post('/newSaveState', async (req, res) => {
  try {
    const { userName, courseName } = req.body;
    const courseData = await db.collection('Courses').findOne({ courseName: courseName });
    const getChapterIndex = ch => courseData.chapters.findIndex(item => item.chapterName === ch.chapterName);

    const getLevels = ch => ch.levels.map(lev => ({
      levelName: lev.levelName,
      goalAxiom: lev.goalAxiom,
      status: 'todo',
      sequenceHistory: [lev.goalAxiom.upperSequence]
    }));

    const courseSave = {
      userName: userName,
      courseName: courseName,
      symbolAlphabet: courseData.symbolAlphabet,
      axioms: courseData.chapters[0].newAxioms,
      derivates: [],
      chapters: courseData.chapters.map(ch => ({
        chapterName: ch.chapterName,
        newAxioms: ch.newAxioms,
        unlocked: (getChapterIndex(ch) === 0 ? true : false),
        levels: getLevels(ch)
      })),
      variables: courseData.variables
    };

    const result = await db.collection('SaveStates').insertOne(courseSave);
    res.json({ saveID: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.post('/newEdit', async (req, res) => {
  try {
    const { userName } = req.body;
    const newEdit = {
      userName: userName,
      title: 'Neuer Kurs',
      chapters: [],
      variables: []
    }
    const result = await db.collection('Edits').insertOne(newEdit);
    res.json({ editID: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get('/level', async (req, res) => {
  try {
    const { saveID, chapterIndex, levelIndex } = req.query;
    const filter = ({ _id: new ObjectId(saveID) });
    const saveState = await db.collection('SaveStates').findOne(filter);
    const chapter = saveState.chapters[chapterIndex];
    const level = chapter.levels[levelIndex];

    let nextChapterIndex = parseInt(chapterIndex, 10);
    let nextLevelIndex = parseInt(levelIndex, 10) + 1;
    if (nextLevelIndex >= chapter.levels.length) {
      nextChapterIndex++;
      nextLevelIndex = 0;
    }
    if (nextChapterIndex >= saveState.chapters.length) {
      nextChapterIndex = -1;
      nextLevelIndex = -1;
    }
    const levelData = ({
      levelName: level.levelName,
      symbolAlphabet: saveState.symbolAlphabet,
      axioms: saveState.axioms,
      derivates: saveState.derivates,
      goalAxiom: level.goalAxiom,
      sequenceHistory: level.sequenceHistory,
      levelFinished: level.status === 'done',
      nextChapterIndex: nextChapterIndex,
      nextLevelIndex: nextLevelIndex,
      variables: saveState.variables
    });
    res.json(levelData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.get('/edit', async (req, res) => {
  try {
    const { editID } = req.query;
    const filter = ({ _id: new ObjectId(editID) });
    const edit = await db.collection('Edits').findOne(filter);
    const editData = ({
      title: edit.title,
      chapters: edit.chapters,
      variables: edit.variables
    });
    res.json(editData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.patch('/sequenceHistory', async (req, res) => {
  try {
    const { saveID, chapterIndex, levelIndex, newHistory } = req.body;
    const filter = ({ _id: new ObjectId(saveID) });

    const updateLevel = {
      $set: { [`chapters.${chapterIndex}.levels.${levelIndex}.sequenceHistory`]: newHistory },
    };

    let result = await db.collection('SaveStates').updateOne(filter, updateLevel);

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    res.json({ message: 'SequenceHistory updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.patch('/levelEnd', async (req, res) => {
  try {
    const { saveID, chapterIndex, levelIndex } = req.body;
    const filter = ({ _id: new ObjectId(saveID) });
    const saveState = await db.collection('SaveStates').findOne(filter);
    const level = saveState.chapters[chapterIndex].levels[levelIndex];

    if (level.status === 'done') {
      return res.status(400).json({ error: 'Level already finished' });
    }

    const updateLevel = {
      $set: { [`chapters.${chapterIndex}.levels.${levelIndex}.status`]: 'done' },
      $push: { derivates: level.goalAxiom }
    };

    let result = await db.collection('SaveStates').updateOne(filter, updateLevel);

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    /* if all levels of a chapter are solved
      1.) unlock all levels of the next chapter
      2.) add goalAxiom to axioms */

    const updatedSaveState = await db.collection('SaveStates').findOne(filter);
    const nextChapter = updatedSaveState.chapters[chapterIndex + 1];
    const unfinishedLevels = updatedSaveState.chapters[chapterIndex].levels.filter(lev => !(lev.status === 'done'));

    if (nextChapter && unfinishedLevels.length === 0) {
      const unlockChapter = {
        $set: { [`chapters.${chapterIndex + 1}.unlocked`]: true },
        $push: { axioms: { $each: nextChapter.newAxioms } }
      };
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

app.get('/addNewChapter', async (req, res) => {
  try {
    const { editID } = req.query;
    const filter = ({ _id: new ObjectId(editID) });
    const newChapter = {
      title: 'Neues Kapitel',
      newAxioms: [],
      levels: []
    }
    const addChapter = {
      $push: { chapters: newChapter }
    };
    result = await db.collection('Edits').updateOne(filter, addChapter);
    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    const edit = await db.collection('Edits').findOne(filter);
    res.json({ chapters: edit.chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

