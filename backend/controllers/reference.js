const Reference = require("../models/reference");
//const Section = require("../models/section");
// const Syllabus = require("../models/syllabus");
// const Introduction = require("../models/introduction");
// const Rationale = require("../models/rationale");
// const Aim = require("../models/aim");
// const Strand = require("../models/strand");
// const Year = require("../models/year");
const formidable = require("formidable");
const slugify = require("slugify");
const { smartTrim } = require("../helpers/strand");
const { errorHandler } = require("../helpers/dbErrorHandler");

//variables from config
const config = require("config");
// const { default: Aim } = require("../../client/components/aim/aimModal");
const appName = config.get("APP_NAME");

//make sectionId available in a request
exports.referenceById = (req, res, next, id) => {
    Reference.findById(id)
      .exec((err, reference) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        req.reference = reference;
        next();
      });
  };
  
  exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
      const { subject, section, identifier, title, body } = fields;
  
      if (!identifier || identifier.length === 0) {
        return res.status(400).json({
          error: "A statement is requied for the slug development",
        });
      }
      if (!body || body.length === 0) {
        return res.status(400).json({
          error: "A body is required",
        });
      }
  
      let reference = new Reference();
      reference.subject = subject;
      reference.section = section;
      reference.identifier = identifier;
      reference.title = title;
      reference.body = body;
  
      reference.slug = slugify(identifier).toLowerCase();
     
      reference.save((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data)
      });
    });
  };

  
  