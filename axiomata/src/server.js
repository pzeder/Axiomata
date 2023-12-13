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

//////////
// MENU //
//////////

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

app.patch('/deleteSaveState', async (req, res) => {
  try {
    const { saveID, userName } = req.body;
    const saveFilter = ({ _id: new ObjectId(saveID) });
    const userFilter = ({ userName: userName });

    const result = await db.collection('SaveStates').deleteOne(saveFilter);

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    const saveStates = await db.collection('SaveStates').find(userFilter).toArray();
    const saveStateHeaders = saveStates.map(s => ({ saveID: s._id, title: s.title }));
    res.json({ saveStateHeaders: saveStateHeaders })
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

app.post('/newSaveState', async (req, res) => {
  try {
    const { userName, courseTitle } = req.body;
    const courseData = await db.collection('Courses').findOne({ title: courseTitle });

    const emptyLevel = (lvl) => ({
      title: lvl.title,
      goalAxiom: lvl.goalAxiom,
      moveHistory: [{
        axiom: null,
        sequence: lvl.goalAxiom.upperSequence
      }],
      bestSolution: null,
      bonus: lvl.bonus
    });

    const courseSave = {
      userName: userName,
      title: courseTitle,
      symbols: courseData.symbols,
      chapters: courseData.chapters.map(ch => ({
        title: ch.title,
        newAxioms: ch.newAxioms,
        levels: ch.levels.map(emptyLevel)
      })),
      variables: courseData.variables
    };

    const result = await db.collection('SaveStates').insertOne(courseSave);
    res.json({ saveID: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//////////
// GAME //
//////////

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

app.patch('/saveGame', async (req, res) => {
  try {
    const { saveID, course } = req.body;
    const filter = ({ _id: new ObjectId(saveID) });
    const updateCourse = ({
      $set: {
        chapters: course.chapters
      }
    });

    result = await db.collection('SaveStates').updateOne(filter, updateCourse);

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    return res.json({ message: 'course saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

////////////
// EDITOR //
////////////

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
    if (result.acknowledged === true && result.insertedId) {
      res.json({ editID: result.insertedId });
    } else {
      res.status(500).json({ error: 'Insert failed' });
    }
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
});

app.patch('/saveEdit', async (req, res) => {
  try {
    const { editID, course } = req.body;
    const filter = ({ _id: new ObjectId(editID) });
    const updateCourse = ({
      $set: {
        title: course.title,
        chapters: course.chapters,
        symbols: course.symbols,
        variables: course.variables
      }
    });

    result = await db.collection('Edits').updateOne(filter, updateCourse);

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
    return res.json({ message: 'course saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/submitCourse', async (req, res) => {
  try {
    const { course } = req.body;

    const filter = ({ title: course.title });
    if (await db.collection('Courses').findOne(filter)) {
      return res.json({ courseTitleAlreadyExists: true });
    }

    const newCourse = ({
      title: course.title,
      chapters: course.chapters,
      symbols: course.symbols,
      variables: course.variables
    });

    const result = await db.collection('Courses').insertOne(newCourse);

    if (result.acknowledged === true) {
      res.json({ courseTitleAlreadyExists: false });
    } else {
      res.status(500).json({ error: 'Insert failed' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

