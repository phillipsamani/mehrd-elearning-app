const Profile = require("../models/profile");
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
exports.profileById = (req, res, next, id) => {
    Profile.findById(id)
      .exec((err, profile) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        req.profile = profile;
        next();
      });
  };
  
  exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
      const { subject, section, introduction, identifier, title, profile1, profile2, body } = fields;
  
      if (!title || title.length === 0) {
        return res.status(400).json({
          error: "A title is required",
        });
      }
    
      let profile = new Profile();
      profile.subject = subject;
      profile.section = section;
      profile.introduction = introduction;
      profile.title = title;
      profile.body = body;
      profile.identifier = identifier;
                  
      profile.slug = slugify(title).toLowerCase();

      let arrayOfProfile1 = profile1 && profile1.split(",");
      let arrayOfProfile2 = profile2 && profile2.split(",");

      profile.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        
        Profile.findByIdAndUpdate(
            result._id,
            { $push: { profile1: arrayOfProfile1 } },
            { new: true }
        ).exec((err, outcome)=>{
            if (err) {
                return res.status(400).json({
                  error: errorHandler(err),
                });
            } else{
                
              Profile.findByIdAndUpdate(
                outcome._id,
                { $push: { profile2: arrayOfProfile2 } },
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
            }
        })
      });
    });
  };

  exports.getProfile = (req, res) => {
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
      Profile.find({ section: section, subject: { $in: subject } })
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
  