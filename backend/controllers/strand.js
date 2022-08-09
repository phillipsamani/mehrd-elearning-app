const Strand = require("../models/strand");
const Substrand = require("../models/substrand");
const Syllabus = require("../models/syllabus");
const Outcome = require("../models/outcome");

const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const _ = require("lodash");

const { errorHandler } = require("../helpers/dbErrorHandler");
const { smartTrim } = require("../helpers/strand");

//variables from config
const config = require("config");
const appName = config.get("APP_NAME");   

exports.strandById = (req, res, next, id) => {
  Strand.findById(id)
    .populate("strand")
    .exec((err, strand) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.strand = strand;
      next();
    });
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields) => {
    const { subject, section,identifier, years, level, title, body, substrands } = fields;

    if (!years || years.length === 0) {
      return res.status(400).json({
        error: "At least one year is reqquired",
      });
    }
    if (!level || level.length === 0) {
      return res.status(400).json({
        error: "A level is reqquired",
      });
    }
    if (!section || level.section === 0) {
      return res.status(400).json({
        error: "Section field is still blank",
      });
    }

    if (!title || title.length === 0) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    if (!subject || subject.length === 0) {
      return res.status(400).json({
        error: "A subject is required",
      });
    }

    if (!body || body.length === 0) {
      return res.status(400).json({
        error: "A statement is required",
      });
    }

    // if (!substrands || substrands.length === 0) {
    //   return res.status(400).json({
    //     error: "At least one substrand is required",
    //   });
    // }

    let strand = new Strand();
    strand.title = title;
    strand.level = level;
    strand.identifier = identifier;
    strand.section = section;
    strand.subject = subject;
    strand.body = body;

    strand.slug = slugify(title).toLowerCase();

    strand.mtitle = `${title} | ${appName}`;
    strand.mdesc = stripHtml(body.substring(0, 200));

    let arrayOfSubstrands = substrands && substrands.split(",");
    let arrayOfYears = years && years.split(",");

    strand.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),  
        });
      }

      Strand.findByIdAndUpdate(
        result._id,
        { $push: { substrands: arrayOfSubstrands } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else {
          // res.json(result);
          Strand.findByIdAndUpdate(
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

exports.strandWithAllSubstrands = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Strand.findOne({ slug })
    .populate("subject", "_id name slug")
    .populate("substrands", "_id title")
    .populate("years", "_id name slug")
    .populate("level", "_id name slug")
    .exec((err, strand) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      Substrand.find({ strand: strand }).exec((err, data) => {
        if (err) {
          return res.json({
            error: errorHandler(err),
          });
        }
        res.json({
          strand,
          substrand: data,
        });
      });
    });
};

// list, listAllBlogsCategoriesTags, read, remove, update

exports.list = (req, res) => {
  Strand.find({})
    .populate("substrands", "_id name statement periods ")
    .populate({
      path: "substrands",
      populate: { path: "year", model: "Year" },
    })
    // .populate({
    //   path: "substrands",
    //   populate: { path: "outcomes", model: "Outcome" },
    // })
    .select("_id title statement slug substrands")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.listRelatedStrands = (req, res) => {
  const { _id, subject } = req.body.strand;

  // Strand.find({ _id: { $ne: _id }, subject: { $in: subject } })
  Strand.find({ subject: { $in: subject } })
    .populate("subject", "_id name")
    .select("_id subject title slug")
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

  Strand.findOne({ slug })
    .populate("years", "_id name slug")
    .populate("level", "_id name slug")
    .populate("subject", "_id name slug")
    // .populate({
    //   path: "subject",
    //   populate: { path: "category", model: "Category" },
    // })
    .populate({
      path: "substrands",
      populate: { path: "subject", model: "Subject" },
    })
    .populate({
      path: "substrands",
      populate: { path: "years", model: "Year" },
    })
    .exec((err, strand) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }

      Syllabus.find({ strands: strand })
        .populate("subject", "_id name slug ")
        .populate("category", "_id name slug")
        .populate("introduction", "_id title introduction")
        .populate("rationale", "_id title rationale")
        .populate("aim", "_id title aim")
        .select("_id title category introduction rationale aim")
        .exec((err, data) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }

          res.json({ strand: strand, syllabus: data });
          //res.json(data);
          // res.json(syllabus);
        });
    });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Strand.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Strand deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Strand.findOne({ slug }).exec((err, oldBlog) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields) => {
      let slugBeforeMerge = oldStrand.slug;
      oldStrand = _.merge(oldStrand, fields);
      oldStrand.slug = slugBeforeMerge;

      const { title, statement, categories, substrands } = fields;

      if (statement) {
        oldBlog.excerpt = smartTrim(statement, 120, " ", " ...");
        oldBlog.desc = stripHtml(statement.substring(0, 160));
      }

      if (categories) {
        oldStrand.categories = categories.split(",");
      }

      if (substrands) {
        oldStrand.substrands = substrands.split(",");
      }

      oldStrand.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        // result.photo = undefined;
        res.json(result);
      });
    });
  });
};

exports.listBySearch = (req, res) => {
  //let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "syllabus") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Strand.find(findArgs)
    // .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Strands not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

