const Approach = require("../models/approaches");
const Syllabus = require("../models/syllabus");
const formidable = require("formidable");
const fs = require('fs');
const slugify = require("slugify");
const { smartTrim } = require("../helpers/strand");
const { errorHandler } = require("../helpers/dbErrorHandler");

//variables from config
const config = require("config");
const appName = config.get("APP_NAME");

exports.approachById = (req, res, next, id) => {
    Approach.findById(id)
      .exec((err, approach) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        req.approach = approach;
        next();
      });
  };

  exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }
      const { subject, section, title, heading1, heading2, introduction, body } = fields;
  
      if (!title || title.length === 0) {
        return res.status(400).json({
          error: "A title is required",
        });
      }
    
      let approach = new Approach();
      approach.subject = subject;
      approach.section = section;
      approach.title = title;
      approach.heading1 = heading1;
      approach.heading2 = heading2;
      approach.introduction = introduction;
      approach.body = body;
                
      approach.slug = slugify(title).toLowerCase();

      if (files.photo) {
        if (files.photo.size > 10000000) {   
            return res.status(400).json({
                error: 'Image should be less then 1mb in size'
            });
        }
        approach.photo.data = fs.readFileSync(files.photo.path);
        approach.photo.contentType = files.photo.type;
    }

      approach.save((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data)
      });
    });
  };
