const Syllabus = require("../models/syllabus");
const Category = require("../models/category");
const Strand = require("../models/strand");
const Section = require("../models/section");
const Rationale = require("../models/rationale");
const Aim = require("../models/aim");
const Introduction = require("../models/introduction");
// const Tag = require("../models/tag");
// const User = require("../models/user");
const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs");
const { smartTrim } = require("../helpers/strand");

//variables from config
const config = require("config");
const appName = config.get("APP_NAME");

exports.syllabusById = (req, res, next, id) => {
  Syllabus.findById(id)
    .populate("syllabus")
    .exec((err, syllabus) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.syllabus = syllabus;
      next();
    });
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not upload",
      });
    }

    const {
      excerpt,
      description,
      years,
      level,
      name,
      subject,
      introduction,
      aim,
      rationale,
      category,
      strands,
    } = fields;

    if (!excerpt || !excerpt.length) {
      return res.status(400).json({
        error: "An excerpt is required",
      });
    }
    if (!years || !years.length) {
      return res.status(400).json({
        error: "All year levels are required",
      });
    }
    
    if (!name || !name.length) {
      return res.status(400).json({
        error: "A name is required",
      });
    }

    if (!description || !description.length) {
      return res.status(400).json({
        error: "A description is required",
      });
    }

    if (!subject || !subject.length) {
      return res.status(400).json({
        error: "Subject is required",
      });
    }

    if (!introduction || introduction.length === 0) {
      return res.status(400).json({
        error: "An introduction is required",
      });
    }
    if (!aim || aim.length === 0) {
      return res.status(400).json({
        error: "An aim is required",
      });
    }

    if (!rationale || rationale.length === 0) {
      return res.status(400).json({
        error: "A rationale is required",
      });
    }

    if (!category || category.length === 0) {
      return res.status(400).json({
        error: "At least one category is required",
      });
    }

    if (!strands || strands.length === 0) {
      return res.status(400).json({
        error: "All strands are required",
      });
    }

    let syllabus = new Syllabus();
    syllabus.excerpt = excerpt;
    syllabus.description = description;
    syllabus.name = name;
    
    syllabus.subject = subject;

    syllabus.introduction = introduction;
    syllabus.aim = aim;
    syllabus.rationale = rationale;
    syllabus.category = category;

    syllabus.slug = slugify(name).toLowerCase();
    syllabus.mtitle = `${name} | ${appName}`;

    let arrayOfStrands = strands && strands.split(",");
    let arrayOfYears = years && years.split(",");

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: "Image should be less then 1mb in size",
        });
      }
      syllabus.photo.data = fs.readFileSync(files.photo.path);
      syllabus.photo.contentType = files.photo.type;
    }

    syllabus.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }

      Syllabus.findByIdAndUpdate(
        result._id,
        { $push: { strands: arrayOfStrands } },
        { new: true }
      )
        .populate("strands", "_id title")
        .populate("category", "_id name")
        .populate("subject", "_id name")
        .populate("introduction", "_id title ")
        .populate("aim", "_id title")
        .populate("rationale", "_id title")
        .select(
          "_id excerpt subject category strands introduction aim rationale slug"
        )
        .exec((err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          } else {
            // res.json(result);
            Syllabus.findByIdAndUpdate(
              result._id,
              { $push: { years: arrayOfYears } },
              { new: true }
            ).exec((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler(err),
                });
              } else {
                res.json(data);
              }
            });
          }
        });
    });
  });
};

exports.listAllSyllabusesWithCategories = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let syllabuses;
  let categories;

  Syllabus.find({})
    .populate("categories", "_id name slug")
    .populate("subject", "_id name")
    .skip(skip)
    .limit(limit)
    .select("_id subject excerpt categories slug")
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),   
        });
      }
      syllabuses = data; //All the syllabuses
      //Get category
      Category.find({}).exec((err, c) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        categories = c;
        res.json({
          syllabuses,
          categories,
          size: syllabuses.length,
        });
      });
    });
};

exports.listAllSyllabusesWithAllContent = (req, res) => {
  const id = req.params._id;
  let syllabuses;
  let rationales;
  let aims;
  let introductions;

  Syllabus.find({ id })
    .populate("category", "_id name slug")
    .populate("strands", "_id years title statement substrands")
    .select("_id title introduction aim rationale strands category slug")
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      syllabuses = data; //All the syllabuses
      //Get all rationale
      Rationale.find({})
        // .populate("rationale", "_id title body excerpt rationale")
        .exec((err, r) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }
          rationales = r;
          //Get all aim
          Aim.find({}).exec((err, a) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            }
            aims = a;
            //Get all introduction
            Introduction.find({}).exec((err, i) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler(err),
                });
              }

              introductions = i;

              res.json({
                syllabuses,
                rationales,
                aims,
                introductions,
              });
            });
          });
        });
    });
};

exports.list = (req, res) => {
  Syllabus.find({})
    .populate("subject", "_id name")
    // .populate("rationale", "_id title body excerpt rationale")
    .populate("category", "_id name slug")
    // .populate("aim", "_id title body excerpt aim")
    // .populate("introduction", "_id title body excerpt introduction")
    // .populate({
    //   path: "strands",
    //   populate: {
    //     path: "substrands",
    //     populate: { path: "years", model: "Year" },
    //   },
    // })
    .select("_id subject excerpt description slug category ")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);    
    });
};

exports.listRelatedSyllabuses = (req, res) => {
  const { category } = req.body.syllabus;

  Syllabus.find({ category: { $in: category } })
    .populate("subject", "id name slug")
    .populate("category", "id name slug")
    .select("_id subject category")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.listRelatedSyllabusesSection = (req, res) => {
  const { subject } = req.body.syllabus;

  Section.find({ subjects: { $in: subject } })
    // .populate("subject", "id name slug")
    // .populate("category", "id name slug")
    // .select("_id subject category")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();     
    
  // const { slug } = req.body.syllabus
  Syllabus.findOne({ slug })
    .populate("subject", "_id name slug")
    .populate("category", "_id name years slug")
    .populate({
      path: "category",
      populate: { path: "years", model: "Year" },
    })
    .select(
      "_id category years subject strands description name slug "
    )
    .exec((err, syllabus) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json({syllabus: syllabus});
    });
};

// exports.read = (req, res) => {
//   const slug = req.params.slug.toLowerCase();
//   Syllabus.findOne({ slug })
//     .populate("subject", "_id name slug")
//     .populate("category", "_id name slug")
//     .populate("aim", "_id title body excerpt aim ")
//     .populate("introduction", "_id title body excerpt introduction")
//     .populate("rationale", "_id title body excerpt rationale")
//     .populate({
//       path: "strands",
//       populate: {
//         path: "substrands",
//         populate: { path: "years", model: "Year" },
//         path: "substrands",
//         populate: {
//           path: "outcomes",
//           populate: { path: "subject", model: "Subject" },
//         },
//       },
//     })
//     .populate("years", "_id name slug")
//     .populate("sections", "_id title subtitle body slug")
//     .populate({
//       path: "strands",
//       populate: {
//         path: "years",
//         populate: { path: "years", model: "Year" },
//       },
//     })
//     .select(
//       "_id years sections subject introduction aim rationale category strands substrands slug "
//     )
//     .exec((err, syllabus) => {
//       if (err) {
//         return res.json({
//           error: errorHandler(err),
//         });
//       }
//       res.json({syllabus});
//     });
// };

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Syllabus.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Syllabus deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Syllabus.findOne({ slug }).exec((err, oldBlog) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not upload",
        });
      }

      let slugBeforeMerge = oldSyllabus.slug;
      oldSyllabus = _.merge(oldSyllabus, fields);
      oldSyllabus.slug = slugBeforeMerge;

      const { name, introduction, aim, rationale, category, strands } = fields;

      if (aim) {
        oldSyllabus.excerpt = smartTrim(aim, 120, " ", " ...");
        oldSyllabus.desc = stripHtml(aim.substring(0, 100));
      }
      if (rationale) {
        oldSyllabus.excerpt1 = smartTrim(rationale, 120, " ", " ...");
        oldSyllabus.desc1 = stripHtml(rationale.substring(0, 100));
      }
      if (introduction) {
        oldSyllabus.excerpt2 = smartTrim(introduction, 320, " ", " ...");
        oldSyllabus.desc2 = stripHtml(introduction.substring(0, 160));
      }

      if (strands) {
        oldSyllabus.strands = strands.split(",");
      }

      if (files.photo) {
        if (files.photo.size > 10000000) {
          return res.status(400).json({
            error: "Image should be less then 1mb in size",
          });
        }
        oldSyllabus.photo.data = fs.readFileSync(files.photo.path);
        oldSyllabus.photo.contentType = files.photo.type;
      }

      oldSyllabus.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        result.photo = undefined;
        res.json(result);
      });
    });
  });
};

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Syllabus.findOne({ slug })
    .select("photo")
    .exec((err, syllabus) => {
      if (err || !syllabus) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", syllabus.photo.contentType);
      return res.send(syllabus.photo.data);
    });
};

exports.listSyllabusRelatedStrand = (req, res) => {
  const id = req.params._id;

  Syllabus.findOne({ id }).exec((err, subject) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    Strand.find({ subject: subject }).exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
  });
};

exports.listRelatedSyllabusesStrand = (req, res) => {
  const {category}  = req.body.syllabus;
  // console.log(req.body)
  Syllabus.find({ category: { $in: category } })
    .populate("subject", "id name slug")
    .populate("category", "id name slug")
    .select("_id subject category")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });

};

