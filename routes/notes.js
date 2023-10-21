const notes = require('express').Router();
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');
// get data from the DB
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);

  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});
// add data to the DB
notes.post('/', (req, res) => {
    console.info(`${req.method} request received to submit notes`);
  
    const note = req.body;
    // error handling
    // throw custom error if title and text are null/empty
    if (!note || !note.title || !note.text) {
      res.status(400).json({ error: 'Invalid data. Both title and text are required.' });
      return;
    }
    // create note object 
    const newNote = {
      title: note.title,
      text: note.text,
      id: uuidv4(), // give note a unique ID
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
// delete data from the DB
notes.delete('/:id', (req, res) => {
    const delNote = req.params.id;
    console.info(`${req.method} request received to delete a note`);
    // read through the Database
    readFromFile('./db/db.json').then((data) => {
      const dataNotes = JSON.parse(data);
      // loop through array and when the noteId matches dataNotes remove from db
      for (let i = 0; i < dataNotes.length; i++) {
            const noteId = dataNotes[i].id;
            // if the notes Unique ID = the ID we want to delete remove it from the DB
            if (noteId === delNote) {
                dataNotes.splice(i, 1)
            }
      } 
      const response = {
        status: 'success',
        body: dataNotes,
      };
      // saves updated notes after deleting
      writeToFile('../db/db.json', dataNotes)
      res.json(response);
    })

});

module.exports = notes;