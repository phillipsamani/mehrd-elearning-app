const General = require("../models/general");
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
exports.generalById = (req, res, next, id) => {
    General.findById(id)
      .exec((err, general) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        req.general = general;
        next();
      });
  };
  
  exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
      const { subject, section, introduction, title, items1, items2 } = fields;
  
      if (!title || title.length === 0) {
        return res.status(400).json({
          error: "A title is required",
        });
      }
    
      let general = new General();
      general.subject = subject;
      general.section = section;
      general.introduction = introduction;
      general.title = title;
      general.items1 = items1;
      general.items2 = items2;
            
      general.slug = slugify(title).toLowerCase();

      general.save((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data)
      });
    });
  };

  exports.getGeneral = (req, res) => {
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
      General.find({ section: section, subject: { $in: subject } })
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
  