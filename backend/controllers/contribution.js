const Contribution = require("../models/contribution");
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
exports.cobtributionById = (req, res, next, id) => {
    Contribution.findById(id)
      .exec((err, contribution) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        req.contribution = contribution;
        next();
      });
  };
  
  exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
      const { subject, section, identifier, introduction, title, culture, lifelong, citizenship, peace, technology, preservation, entrepreneurship, development, financial} = fields;
  
      if (!identifier || identifier.length === 0) {
        return res.status(400).json({
          error: "A statement is requied for the slug development",
        });
      }

      if (!title || title.length === 0) {
        return res.status(400).json({
          error: "A title is required",
        });
      }
      
      let contribution = new Contribution();
      contribution.subject = subject;
      contribution.section = section;
      contribution.identifier = identifier;
      contribution.title = title;
      contribution.introduction = introduction;
      contribution.culture = culture;
      contribution.lifelong = lifelong;
      contribution.citizenship = citizenship;
      contribution.peace = peace;
      contribution.technology = technology;
      contribution.preservation = preservation;
      contribution.entrepreneurship = entrepreneurship;
      contribution.development = development;
      contribution.financial = financial;

      contribution.slug = slugify(title).toLowerCase();
      
      
      contribution.save((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data)
      });
    });
  };
  
exports.getContribution = (req, res) => {
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
  