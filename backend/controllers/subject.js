const Subject = require("../models/subject");
const slugify = require("slugify");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.subjectById = (req, res, next, id) => {
  Subject.findById(id)
    .populate("subject")
    .exec((err, subject) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.subject = subject;
      next();
    });
};

exports.create = async (req, res) => {
  const { name } = req.body;

  let slug = slugify(name).toLowerCase();

  let subject = new Subject({
    name,
    slug,
  });

  await subject.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.update = async (req, res, next) => {
  const subject = req.subject;
  subject.name = req.body.name;
  const { name } = subject;
  if (!name) {
    return res.status(400).json({
      error: "The field must not be left empty!",
    });
  }

  await subject.save((err, subject) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
      return next(error);
    }
    res.json({
      message: "Updated successfully",
      content: subject,
    });
  });
};

exports.list = (req, res) => {
  Subject.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Subject.findOne({ slug }).exec((err, subject) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ subject });
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Subject.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Subject deleted successfully",
    });
  });
};
