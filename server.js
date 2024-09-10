const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001; 

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allows for the use of the db.json file
let notes = require('./db/db.json');

// sets routes for the html files
app.get('/api/notes', (req, res) => res.json(notes));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

let noteId = notes.length;

// when a new note is created, it is added to the db.json file
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = noteId++;
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(newNote);
});

// when a note is deleted, it is removed from the db.json file
app.delete('/api/notes/:id', (req, res) => {
    const deleteNote = req.params.id;
    notes = notes.filter((note) => note.id !== parseInt(deleteNote));
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(notes);
});

// sets the server to listen for the port
// displays a message in the console when the server is running
app.listen(PORT, () => {
    console.log(`API server now on port http://localhost:${PORT}`);
});
