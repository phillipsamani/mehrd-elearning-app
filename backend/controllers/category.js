const Category = require("../models/category");
const Syllabus = require("../models/syllabus");

const slugify = require("slugify");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  const { name } = req.body;
  let slug = slugify(name).toLowerCase();

  let category = new Category({ name, slug });

  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.list = (req, res) => {
  Category.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.listCategoryWithAllSyllabuses = (req, res) => {
  let slug = slugify(name).toLowerCase();
  Category.find({ slug })
    .populate("subject", "_id name")
    .exec((err, category) => {
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

  Category.findOne({ slug }).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    Syllabus.find({ category: category })
      .populate("category", "_id name slug")
      .populate("subject", "_id name slug")
      .select("_id category subject excerpt slug")
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        // res.json({ category: category, syllabuses: data });
        res.json(data);
      });
  });
};




exports.readCategory = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Category.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Category.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Category deleted successfully",
    });
  });
};
