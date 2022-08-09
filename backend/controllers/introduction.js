const Introduction = require("../models/introduction");
const Syllabus = require("../models/syllabus");
const formidable = require("formidable");
const slugify = require("slugify");
const { smartTrim } = require("../helpers/strand");
const { errorHandler } = require("../helpers/dbErrorHandler");

//variables from config
const config = require("config");
const appName = config.get("APP_NAME");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields) => {
    const { subject, identifier, title, body } = fields;

    if (!subject || subject.length === 0) {
      return res.status(400).json({
        error: "A subject is requied",
      });
    }
    if (!identifier || identifier.length === 0) {
      return res.status(400).json({
        error: "An identifier is requied",
      });
    }

    if (!title || title.length === 0) {
      return res.status(400).json({
        error: "A title is required for the introduction",
      });
    }
    if (!body || body.length === 0) {
      return res.status(400).json({
        error: "The introduction should have a body",
      });
    }

    let introduction = new Introduction();
    introduction.subject = subject;
    introduction.identifier = identifier;
    introduction.title = title;
    introduction.body = body;

    introduction.introduction = slugify(title).toLowerCase();

    introduction.mtitle = `${title} | ${appName}`;
    introduction.excerpt = smartTrim(body, 400, " ", " ...");

    introduction.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.list = (req, res) => {
  Introduction.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.read = (req, res) => {
  const introduction = req.params.introduction.toLowerCase();

  Introduction.findOne({ introduction }).exec((err, introduction) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    Syllabus.find({ introduction: introduction })
      .populate("introduction", "_id title body mtitle excerpt introduction")
      .populate("rationale", "_id title body mtitle excerpt rationale")
      .populate("aim", "_id title body mtitle excerpt aim")
      .populate("category", "_id name slug")
      .populate("subject", "_id name slug")
      .populate({
        path: "strands",
        populate: {
          path: "substrands",
          populate: { path: "years", model: "Year" },
        },
      })
      .select("_id subject introduction aim rationale category strands slug ")
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json({introduction, syllabus: data});
      });
  });
};
