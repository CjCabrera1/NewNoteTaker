const notes = require('express').Router();
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);

  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
    console.info(`${req.method} request received to submit notes`);
  
    const note = req.body;
    // throw custom error if title and text are null/empty
    if (!note || !note.title || !note.text) {
      res.status(400).json({ error: 'Invalid data. Both title and text are required.' });
      return;
    }
  
    const newNote = {
      title: note.title,
      text: note.text,
      id: uuidv4(),
    };
  
    try {
      readAndAppend(newNote, './db/db.json');
      const response = {
        status: 'success',
        body: newNote,
      };
  
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while saving the note.' });
    }
});


module.exports = notes;