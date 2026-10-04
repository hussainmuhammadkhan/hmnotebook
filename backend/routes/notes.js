const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");
const Notes = require("../models/Notes");

//Route 1: Get all notes using: Get "/api/notes/fetchallnotes".login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some bad request occured");
  }
});

//Route 2: Add a new note using: post "/api/notes/addnote".login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 2 }),
    body("tag").isLength({ min: 2 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); //copy from express validator version 6.12.0
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some bad request occured");
    }
  }
);

//Route 3: Updata a note using: put "/api/notes/updatenote/:id".login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  //create new note
  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(401).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("NOt Allowd");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some bad request occured");
  }
});

//Route 4: Delete a note using: delete "/api/notes/deletetenote/:id".login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  //const {title, descripton, tag}= req.body;
  try {
    //Find note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(401).send("Not Found");
    }
    //Allow deletion only if user own this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("NOt Allowd");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted successfully", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some bad request occured");
  }
});
module.exports = router;
