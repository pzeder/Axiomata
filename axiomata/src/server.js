const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const url = 'mongodb://0.0.0.0:27017';
const dbName = 'CirclesDB';
let db;

MongoClient.connect(url)
  .then(client => {
    console.log('Connected to Database');
    db = client.db(dbName);
  })
  .catch(error => console.error(error));

app.get('/data', (req, res) => {
  db.collection('CircleData').find({ name: req.query.name }).toArray()
    .then(results => {
      res.json(results[0]);
    })
    .catch(error => res.status(500).json({ error: 'An error occurred' }));
});

app.patch('/data', (req, res) => {
  // Extract the title and updates from the request body
  const name = req.body.name;
  const updates = req.body.updates;

  // Check if title and updates are provided
  if (!name || !updates) {
    return res.status(400).json({ error: 'name and updates are required' });
  }

  // Update the document with the provided title in the CircleData collection
  db.collection('CircleData').updateOne({ name: name }, { $set: updates })
    .then(result => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json({ message: 'Document updated successfully' });
    })
    .catch(error => {
      console.error("Error updating document:", error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

app.listen(3000, function () {
  console.log('listening on 3000');
});
