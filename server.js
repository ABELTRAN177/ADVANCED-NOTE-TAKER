const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001; 

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let notes = require('./db/db.json');

app.get('/api/notes', (req, res) => res.json(notes));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

let noteId = notes.length;

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = noteId++;
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const deleteNote = req.params.id;
    notes = notes.filter((note) => note.id !== parseInt(deleteNote));
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(notes);
});

app.listen(PORT, () => {
    console.log(`API server now on port http://localhost:${PORT}`);
});
