const Acknowledgement = require("../models/acknowledgement");
const Section = require("../models/section");
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
exports.acknowledgementById = (req, res, next, id) => {
    Foreword.findById(id)
      .exec((err, acknowledgement) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        req.acknowledgement = acknowledgement;
        next();
      });
  };
  
  exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
      const { subject, section, identifier, subtitle, title, body } = fields;
  
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
  
      let acknowledgement = new Acknowledgement();
      acknowledgement.subject = subject;
      acknowledgement.section = section;
      acknowledgement.identifier = identifier;
      acknowledgement.title = title;
      acknowledgement.body = body;
  
      acknowledgement.slug = slugify(title).toLowerCase();
     
      acknowledgement.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(result)
      });
    });
  };
  
exports.getAcknowledgement = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    const { subject } = req.body.syllabus;
    //console.log(subject)
  
    Section.findOne({ slug }).exec((err, section) => {         
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
   
      //onClick for the foreword base on the section and the syllabus
      Acknowledgement.find({ section: section, subject: { $in: subject } })
        .exec((err, data) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }
          res.json(data) 
            
        });        
    });
  };
  
  