const Rationale = require("../models/rationale");
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
    const { subject, section, identifier, title, body } = fields;

    if (!identifier || identifier.length === 0) {
      return res.status(400).json({
        error: "A unique name is equired",
      });
    }

    if (!title || title.length === 0) {
      return res.status(400).json({
        error: "A title is required",
      });
    }
    if (!body || body.length === 0) {
      return res.status(400).json({
        error: "A body statement is required",
      });
    }

    let rationale = new Rationale();
    rationale.subject = subject;
    rationale.section = section;
    rationale.identifier = identifier;
    rationale.title = title;
    rationale.body = body;

    rationale.rationale = slugify(identifier).toLowerCase();

    rationale.mtitle = `${title} | ${appName}`;
    rationale.excerpt = smartTrim(body, 400, " ", " ...");

    rationale.save((err, result) => {
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
  Rationale.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.read = (req, res) => {
  const rationale = req.params.rationale.toLowerCase();

  Rationale.findOne({ rationale }).exec((err, rationale) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    Syllabus.find({ rationale: rationale })
      .populate("rationale", "_id title excerpt rationale")
      .populate("introduction", "_id title excerpt introduction")
      .populate("aim", "_id title excerpt aim")
      .populate("category", "_id name slug")
      .populate("subject", "_id name")
      .select("_id subject rationale category introduction aim slug")
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json({rationale, syllabus: data});
      });
  });
};
