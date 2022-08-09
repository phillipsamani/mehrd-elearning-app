const Glossary = require("../models/glossary");
const Section = require("../models/section");
const formidable = require("formidable");
const slugify = require("slugify");
const { smartTrim } = require("../helpers/strand");
const { errorHandler } = require("../helpers/dbErrorHandler");

//variables from config
const config = require("config");
// const { default: Aim } = require("../../client/components/aim/aimModal");
const appName = config.get("APP_NAME");

//make sectionId available in a request
exports.glossaryById = (req, res, next, id) => {
    Glossary.findById(id)
      .exec((err, glossary) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        req.glossary = glossary;
        next();
      });
  };
  
  exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
      const { subject, section, identifier, introduction, body } = fields;
  
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
      
      let glossary = new Glossary();
      glossary.subject = subject;
      glossary.section = section;
      glossary.identifier = identifier;
      glossary.introduction = introduction;
      glossary.body = body;
  
      glossary.slug = slugify(introduction).toLowerCase();
      
      glossary.save((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data)
      });
    });
  };
  
exports.getGlossary = (req, res) => {
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
      Glossary.find({ section: section, subject: { $in: subject } })
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
  