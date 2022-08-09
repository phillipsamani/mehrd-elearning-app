const express = require("express");
const router = express.Router();
const {
  createNote,
  listNotesWithOutcome,
  list,
  read,
  notesBy,
  update,
  remove,
  noteById,
} = require("../controllers/note");
const { userById } = require("../controllers/user");

// validators
const { requireSignin } = require("../controllers/auth");

router.post("/note/:userId", requireSignin, createNote);

router.get("/notes", list);
router.post("/notes/related", listNotesWithOutcome);
router.get("/notes/:userId", notesBy);
router.get("/note/:slug", read);

router.put("/note/:slug", requireSignin, update);
router.delete("/note/:slug", requireSignin, remove);

router.param("userId", userById);
router.param("noteId", noteById);

module.exports = router;
