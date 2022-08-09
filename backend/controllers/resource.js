const Resource = require("../models/resource");
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
exports.resourceById = (req, res, next, id) => {
    Resource.findById(id)
      .exec((err, resource) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        req.resource = resource;
        next();
      });
  };
  
  exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
      const { subject, title, section, identifier, syllBooks, introduction, body } = fields;
  
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
    
      let resource = new Resource();
      resource.subject = subject;
      resource.section = section;
      resource.title = title;
      resource.identifier = identifier;
      resource.introduction = introduction;
      resource.body = body;
                 
      resource.slug = slugify(title).toLowerCase();

      let arrayOfBooks = syllBooks && syllBooks.split(",");
      
      resource.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        
        Resource.findByIdAndUpdate(
            result._id,
            { $push: { syllBooks: arrayOfBooks } },
            { new: true }
        ).exec((err, data)=>{
            if (err) {
                return res.status(400).json({
                  error: errorHandler(err),
                });
            } else{
                res.json(data)
            }
        })
      });
    });
  };
  
exports.getResource = (req, res) => {
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
      Structure.find({ section: section, subject: { $in: subject } })
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
  