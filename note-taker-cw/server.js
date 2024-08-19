const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3031;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// HTML Routes

// GET /notes should return the notes.html file.
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// GET * should return the index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Function to save note
const saveNote = (newNote, callback) => {
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }

    let notes = [];
    try {
      notes = JSON.parse(data);
    } catch (parseErr) {
      return callback(parseErr);
    }

    notes.push(newNote);

    fs.writeFile('db/db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return callback(err);
      }
      callback(null, newNote);
    });
  });
};

// API Routes

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };

  saveNote(newNote, (err, savedNote) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save note' });
    } else {
      res.json(savedNote);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
