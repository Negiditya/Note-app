const Note = require("../models/Note")

// create a note
const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        const note = await Note.create({
            title: title.trim(),
            content: content || '',
            user: req.user.id
        });

        res.status(201).json({ message: "Note created successfully", note });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// get all notes for a user
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }).sort({ _id: -1 }); // Latest first
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// get a single note
const getSingleNote = async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// update note
const updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title: title.trim(), content: content || '' },
            { new: true }
        );

        if (!note) return res.status(404).json({ message: "Note not found" });
        res.json({ message: "Note updated successfully", note });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// delete note
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { createNote, updateNote, getNotes, deleteNote, getSingleNote }
