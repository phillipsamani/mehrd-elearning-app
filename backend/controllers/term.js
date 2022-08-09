const Term = require("../models/term");
const Substrand = require("../models/substrand");

const slugify = require("slugify");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  const { name } = req.body;
  let slug = slugify(name).toLowerCase();

  let term = new Term({ name, slug });

  term.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.list = (req, res) => {
  Term.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};
exports.listTermWithAllSubstrand = (req, res) => {
  let slug = slugify(name).toLowerCase();

  Term.find({ slug })
    .populate("substrand", "_id name")
    .exec((err, data) => {
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

  Term.findOne({ slug }).exec((err, term) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    Substrand.find({ term: term })
      .populate("term", "_id name slug")
      .populate("substrand", "_id name")
      .select("_id term substrand slug")
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json({ term: term, substrand: data });
      });
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Term.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Term deleted successfully",
    });
  });
};
