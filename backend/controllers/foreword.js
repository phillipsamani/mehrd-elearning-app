const Foreword = require("../models/foreword");
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
exports.forewordById = (req, res, next, id) => {
    Foreword.findById(id)
      .exec((err, foreword) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        req.foreword = foreword;
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
  
      let foreword = new Foreword();
      foreword.subject = subject;
      foreword.section = section;
      foreword.identifier = identifier;
      foreword.title = title;
      foreword.subtitle = subtitle;
      foreword.body = body;
  
      foreword.slug = slugify(subtitle).toLowerCase();
     
      foreword.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(result)
      });
    });
  };
  

exports.getForeword = (req, res) => {
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
      Foreword.find({ section: section, subject: { $in: subject } })
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
  
  