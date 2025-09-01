const express = require("express");
const { createNote, getNotes, getSingleNote, updateNote, deleteNote } = require("../controllers/noteController");

const router = express.Router();

// getting all notes
router.get("/", getNotes)

// creating a note
router.post("/", createNote)

// getting a single note by id
router.get("/:id", getSingleNote)

// updating the note
router.put("/:id", updateNote)

// deleting the note 
router.delete("/:id", deleteNote)

module.exports = router