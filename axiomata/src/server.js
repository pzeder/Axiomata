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
    const saveStateHeader = saveStates.map(s => ({ saveID: s._id, title: s.title }));
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
      title: lev.title,
      status: (lev.status === 'todo' && lev.sequenceHistory.length > 1) ? 'busy' : lev.status
    }));

    const chapterHeaders = saveState.chapters.map(ch => ({
      title: ch.title,
      unlocked: ch.unlocked,
      levelHeaders: getLevelHeaders(ch)
    }));

    res.json(chapterHeaders);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get('/courseHeaders', async (req, res) => {
  try {
    const courses = await db.collection('Courses').find().toArray();
    const courseHeaders = courses.map(c => ({ title: c.title }));
    res.json(courseHeaders)
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get('/course', async (req, res) => {
  try {
    const { saveID } = req.query;
    const filter = ({ _id: new ObjectId(saveID) });
    const course = await db.collection('SaveStates').findOne(filter);
    res.json(course);
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
    const { userName, courseTitle } = req.body;
    const courseData = await db.collection('Courses').findOne({ title: courseTitle });

    const getLevels = ch => ch.levels.map(lev => ({
      title: lev.title,
      goalAxiom: lev.goalAxiom,
      sequenceHistory: [lev.goalAxiom.upperSequence],
      solved: false
    }));

    const courseSave = {
      userName: userName,
      title: courseTitle,
      symbols: courseData.symbols,
      chapters: courseData.chapters.map(ch => ({
        title: ch.title,
        newAxioms: ch.newAxioms,
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
      variables: [],
      symbols: []
    }
    const result = await db.collection('Edits').insertOne(newEdit);
    res.json({ editID: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get('/edit', async (req, res) => {
  try {
    const { editID } = req.query;
    const filter = ({ _id: new ObjectId(editID) });
    const edit = await db.collection('Edits').findOne(filter);
    const editData = ({
      title: edit.title,
      chapters: edit.chapters,
      variables: edit.variables,
      symbols: edit.symbols
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

    const updateSequenceHistory = {
      $set: { [`chapters.${chapterIndex}.levels.${levelIndex}.sequenceHistory`]: newHistory },
    };

    let result = await db.collection('SaveStates').updateOne(filter, updateSequenceHistory);

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    res.json({ message: 'SequenceHistory updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.patch('/levelSolved', async (req, res) => {
  try {
    const { saveID, chapterIndex, levelIndex } = req.body;
    const filter = ({ _id: new ObjectId(saveID) });
    const updateLevel = {
      $set: { [`chapters.${chapterIndex}.levels.${levelIndex}.solved`]: true },
    };

    let result = await db.collection('SaveStates').updateOne(filter, updateLevel);

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    const course = await db.collection('SaveStates').findOne(filter);
    res.json({ chapters: course.chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.post('/addNewChapter', async (req, res) => {
  try {
    const { editID, position } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const newChapter = {
      title: 'Neues Kapitel',
      newAxioms: [],
      levels: []
    }
    const addChapter = {
      $push: {
        chapters: {
          $each: [newChapter],
          $position: position
        }
      }
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

app.post('/addNewLevel', async (req, res) => {
  try {
    const { editID, chapterIndex, levelIndex } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const edit = await db.collection('Edits').findOne(filter);
    const newLevel = {
      title: 'Neues Level',
      goalAxiom: {
        upperSequence: [],
        lowerSequence: []
      }
    }
    if (edit && edit.chapters && edit.chapters[chapterIndex]) {
      edit.chapters[chapterIndex].levels.splice(levelIndex, 0, newLevel);
    } else {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    const addLevel = {
      $set: {
        chapters: edit.chapters
      }
    };
    result = await db.collection('Edits').updateOne(filter, addLevel);
    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    const newEdit = await db.collection('Edits').findOne(filter);
    res.json({ chapters: newEdit.chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/addNewSymbol', async (req, res) => {
  try {
    const { editID, newSymbol } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const addSymbol = { $push: { symbols: newSymbol } };
    result = await db.collection('Edits').updateOne(filter, addSymbol);
    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    const edit = await db.collection('Edits').findOne(filter);
    res.json({ symbols: edit.symbols });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/addNewAxiom', async (req, res) => {
  try {
    const { editID, chapterIndex, axiom } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const addAxiom = {
      $push: { [`chapters.${chapterIndex}.newAxioms`]: axiom }
    };
    result = await db.collection('Edits').updateOne(filter, addAxiom);
    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    const edit = await db.collection('Edits').findOne(filter);
    res.json({ chapters: edit.chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/deleteChapter', async (req, res) => {
  try {
    const { editID, chapterIndex } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const deleteChapter = {
      $unset: { [`chapters.${chapterIndex}`]: "" }
    };
    const removeNull = {
      $pull: { chapters: null }
    }
    result = await db.collection('Edits').updateOne(filter, deleteChapter);
    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    result = await db.collection('Edits').updateOne(filter, removeNull);
    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    const edit = await db.collection('Edits').findOne(filter);
    res.json({ chapters: edit.chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/deleteAxiom', async (req, res) => {
  try {
    const { editID, chapterIndex, axiomIndex } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const deleteAxiom = {
      $unset: { [`chapters.${chapterIndex}.newAxioms.${axiomIndex}`]: "" }
    };
    const removeNull = {
      $pull: { [`chapters.${chapterIndex}.newAxioms`]: null }
    }
    result = await db.collection('Edits').updateOne(filter, deleteAxiom);
    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    result = await db.collection('Edits').updateOne(filter, removeNull);
    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    const edit = await db.collection('Edits').findOne(filter);
    res.json({ chapters: edit.chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/deleteLevel', async (req, res) => {
  try {
    const { editID, chapterIndex, levelIndex } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const deleteLevel = {
      $unset: {
        [`chapters.${chapterIndex}.levels.${levelIndex}`]: ""
      }
    };
    const removeNull = {
      $pull: { [`chapters.${chapterIndex}.levels`]: null }
    };
    result = await db.collection('Edits').updateOne(filter, deleteLevel);
    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    result = await db.collection('Edits').updateOne(filter, removeNull);
    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    const edit = await db.collection('Edits').findOne(filter);
    res.json({ chapters: edit.chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/deleteSymbol', async (req, res) => {
  try {
    const { editID, symbolIndex } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const deleteSymbol = {
      $unset: {
        [`symbols.${symbolIndex}`]: ""
      }
    };
    const removeNull = {
      $pull: { symbols: null }
    };
    result = await db.collection('Edits').updateOne(filter, deleteSymbol);
    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    result = await db.collection('Edits').updateOne(filter, removeNull);
    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    const edit = await db.collection('Edits').findOne(filter);

    const cleanIndex = (index) => (index < symbolIndex) ? index : index - 1;

    const cleanAxiom = (axiom) => {
      if (axiom.upperSequence.includes(symbolIndex) || axiom.lowerSequence.includes(symbolIndex)) {
        return { upperSequence: [], lowerSequence: [] };
      }
      return {
        upperSequence: axiom.upperSequence.map(cleanIndex),
        lowerSequence: axiom.lowerSequence.map(cleanIndex)
      }
    };

    const cleanLevel = (lvl) => ({
      title: lvl.title,
      goalAxiom: cleanAxiom(lvl.goalAxiom),
      sequenceHistory: lvl.sequenceHistory,
      solved: lvl.solved
    });

    const nonEmpty = (axiom) => (axiom.upperSequence.length > 0 && axiom.lowerSequence.length > 0);

    const cleanChapter = (ch) => ({
      title: ch.title,
      newAxioms: ch.newAxioms.map(cleanAxiom).filter(nonEmpty),
      levels: ch.levels.map(cleanLevel)
    });

    const cleanChapters = edit.chapters.map(cleanChapter)
    const updateChapters = { $set: { chapters: cleanChapters } };

    result = await db.collection('Edits').updateOne(filter, updateChapters);

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    res.json({ chapters: cleanChapters, symbols: edit.symbols });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/courseTitle', async (req, res) => {
  try {
    const { editID, text } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const updateTitle = { $set: { [`title`]: text } };
    const patch = await db.collection('Edits').updateOne(filter, updateTitle);

    if (patch.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    const course = await db.collection('Edits').findOne(filter);
    res.json({ courseTitle: course.title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/chapterTitle', async (req, res) => {
  try {
    const { editID, text, chapterIndex } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const updateTitle = { $set: { [`chapters.${chapterIndex}.title`]: text } };
    const patch = await db.collection('Edits').updateOne(filter, updateTitle);

    if (patch.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    const course = await db.collection('Edits').findOne(filter);
    res.json({ chapters: course.chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/levelTitle', async (req, res) => {
  try {
    const { editID, text, chapterIndex, levelIndex } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const updateTitle = { $set: { [`chapters.${chapterIndex}.levels.${levelIndex}.title`]: text } };
    const patch = await db.collection('Edits').updateOne(filter, updateTitle);

    if (patch.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    const course = await db.collection('Edits').findOne(filter);
    res.json({ chapters: course.chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/goalAxiom', async (req, res) => {
  try {
    const { editID, goalAxiom, chapterIndex, levelIndex } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const updateGoalAxiom = { $set: { [`chapters.${chapterIndex}.levels.${levelIndex}.goalAxiom`]: goalAxiom } };
    const patch = await db.collection('Edits').updateOne(filter, updateGoalAxiom);

    if (patch.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    const course = await db.collection('Edits').findOne(filter);
    res.json({ chapters: course.chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
