const Note = require("../models/note");
const User = require("../models/user");

const slugify = require("slugify");
const formidable = require("formidable");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");

//variables from config
const config = require("config");
const appName = config.get("APP_NAME");

exports.noteById = (req, res, next, id) => {
  Note.findById(id)
    .populate("createdBy")
    .populate("outcome")
    .exec((err, note) => {
      if (err || !note) {
        return res.status(400).json({
          error: "Note not found",
        });
      }
      req.note = note; // adds note object in req with note info
      next();
    });
};

exports.createNote = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields) => {
    const { title, body } = fields;

    if (!title || title.length === 0) {
      return res.status(400).json({
        error: "A title is required",
      });
    }

    if (!body || body.length === 0) {
      return res.status(400).json({
        error: "Some content is required",
      });
    }

    let note = new Note(fields);
    req.profile.role = undefined;
    req.profile.salt = undefined;
    req.profile.hashed_password = undefined;
    req.profile.profile = undefined;
    req.profile.username = undefined;

    note.createdBy = req.profile;
    note.slug = slugify(title).toLowerCase();

    note.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.listNotesWithOutcome = (req, res) => {
  const { _id, general } = req.body.outcome;
  Note.find({ outcome: { $in: general } })
    .populate("createdBy", "_id name")
    .populate("outcome", "_id general")
    .select("_id body outcome createdBy createdAt")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
};

exports.notesBy = (req, res) => {
  Note.find({ createdBy: req.profile._id })
    .populate("createdBy", "_id name email")
    .populate("outcome", "_id general slug")
    .sort({ createdAt: -1 })
    .select("_id title body outcome createdBy createdAt slug")
    .sort("_createdAt")
    .exec((err, notes) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(notes);
    });
};

exports.list = (req, res) => {
  Note.find({})
    .populate("createdBy", "_id name")
    .populate("outcome", "_id general")
    .sort({ createdAt: -1 })
    .exec((err, notes) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(notes);
    });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Note.findOne({ slug })
    .populate("createdBy", "_id name")
    .populate("outcome", "_id general")
    .select("_id title body createdBy outcome createdAt slug")
    .exec((err, note) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(note);
    });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Note.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Note deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Note.findOne({ slug }).exec((err, oldNote) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not upload",
        });
      }

      let slugBeforeMerge = oldNote.slug;
      oldNote = _.merge(oldNote, fields);
      oldNote.slug = slugBeforeMerge;

      const { body, title } = fields;
      if (body) {
        oldNote.body = body;
      }

      if (title) {
        oldNote.title = title;
      }

      oldNote.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(result);
      });
    });
  });
};
