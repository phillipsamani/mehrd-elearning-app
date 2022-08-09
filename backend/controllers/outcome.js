const Syllabus = require("../models/syllabus");
const Year = require("../models/year");
const Outcome = require("../models/outcome");
const Substrand = require("../models/substrand");
const Note = require("../models/note");
const Strand = require("../models/strand");
const formidable = require("formidable");
const slugify = require("slugify");
const { errorHandler } = require("../helpers/dbErrorHandler");

//variables from config
const config = require("config");
const appName = config.get("APP_NAME");

exports.outcomeById = (req, res, next, id) => {
  Outcome.findById(id)
    .populate("outcome")
    .exec((err, outcome) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.outcome = outcome;
      next();
    });
};

// exports.create = async (req, res) => {
//   const { content, general, assessment, indicators } = req.body;

//   let slug = slugify(content).toLowerCase();

//   let outcome = new Outcome({
//     content,
//     general,
//     assessment,
//     indicators,
//     slug,
//   });

//   await outcome.save((err, outcome) => {
//     if (err) {
//       return res.status(400).json({
//         error: errorHandler(err),
//       });
//     }
//     res.json(outcome);
//   });
// };

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields) => {
    const {
      content,
      subject,
      year,
      strand,
      general,
      assessment,
      substrand,
    } = fields;

    if (!content || content.length === 0) {
      return res.status(400).json({
        error: "A content is requied",
      });
    }
    if (!subject || subject.length === 0) {
      return res.status(400).json({
        error: "A subject is requied",
      });
    }

    if (!year || year.length === 0) {
      return res.status(400).json({
        error: "A year is requied",
      });
    }

    if (!strand || strand.length === 0) {
      return res.status(400).json({
        error: "A Strand is requied",
      });
    }

    if (!general || general.length === 0) {
      return res.status(400).json({
        error: "General learning outcome is required",
      });
    }
    if (!assessment || assessment.length === 0) {
      return res.status(400).json({
        error: "An assessment item is required",
      });
    }

    if (!substrand || substrand.length === 0) {
      return res.status(400).json({
        error: "A substrand is required",
      });
    }

    let outcome = new Outcome();
    outcome.content = content;
    outcome.general = general;
    outcome.assessment = assessment;
    outcome.year = year;

    outcome.slug = slugify(content).toLowerCase();
    outcome.mtitle = `${content} | ${appName}`;

    let arrayOfSubjects = subject && subject.split(",");
    let arrayOfStrands = strand && strand.split(",");
    let arrayOfSubstrands = substrand && substrand.split(",");

    outcome.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      Outcome.findByIdAndUpdate(
        data._id,
        { $push: { subject: arrayOfSubjects } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else {
          Outcome.findByIdAndUpdate(
            result._id,
            { $push: { strand: arrayOfStrands } },
            { new: true }
          ).exec((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            } else {
              Outcome.findByIdAndUpdate(
                result._id,
                { $push: { substrand: arrayOfSubstrands } },
                { new: true }
              ).exec((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: errorHandler(err),
                  });
                } else {
                  res.json(result);
                }
              });
            }
          });
        }
      });
    });
  });
};

exports.createSpecific = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields) => {
    const {
      subject,
      year,
      strand,
      substrand,
      content,
      specific,
      activity,
      assessment,
    } = fields;

    if (!subject || subject.length === 0) {
      return res.status(400).json({
        error: "A Subject title is required",
      });
    }

    if (!year || year.length === 0) {
      return res.status(400).json({
        error: "A year level is required",
      });
    }

    if (!strand || strand.length === 0) {
      return res.status(400).json({
        error: "A strand is required",
      });
    }

    if (!substrand || substrand.length === 0) {
      return res.status(400).json({
        error: "A substrand is required",
      });
    }

    if (!content || content.length === 0) {
      return res.status(400).json({
        error: "A brief content is required",
      });
    }

    if (!specific || specific.length === 0) {
      return res.status(400).json({
        error: "A specific Learning Outcome is required",
      });
    }

    if (!activity || activity.length === 0) {
      return res.status(400).json({
        error: "Activity statement is required",
      });
    }

    if (!assessment || assessment.length === 0) {
      return res.status(400).json({
        error: "Assessment field should not be left blank",
      });
    }

    const id = req.outcome._id;
    //const slug = req.params.slug.toLowerCase();
    const newOutcome = {
      subject,
      year,
      strand,
      substrand,
      content,
      specific,
      activity,
      assessment,
    };

    Outcome.findByIdAndUpdate(
      id,
      { $push: { indicators: newOutcome } },
      { new: true }
    )
      .populate("indicators", "_id specific")
      .exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else {
          res.json(result);
        }
      });
  });
};

exports.createNote = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields) => {
    const { body } = fields;

    if (!body || body.length === 0) {
      return res.status(400).json({
        error: "A content is required",
      });
    }

    const id = req.outcome._id;
    const newBody = {
      body,
    };

    Outcome.findByIdAndUpdate(id, { $push: { note: newBody } }, { new: true })
      .populate("note", "_id body")
      .exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else {
          res.json(result);
        }
      });
  });
};

exports.insertLO = async (req, res, next) => {
  const id = req.outcome.id;
  const outcome = await Outcome.findById(id);
  const newOutcome = {
    specific: req.body.specific,
    activity: req.body.activity,
    assessment: req.body.assessment,
  };

  outcome.indicators.unshift(newOutcome);
  await outcome.save((err, outcome) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(outcome);
  });
};

exports.update = async (req, res, next) => {
  const outcome = req.outcome;
  outcome.content = req.body.content;
  outcome.GLO = req.body.GLO;
  outcome.SLO = req.body.SLO;
  outcome.activity = req.body.activity;
  outcome.assessment = req.body.assessment;
  const { content, GLO, SLO, activity, assessment } = outcome;
  if (!content || !GLO || !SLO || !activity || !assessment) {
    return res.status(400).json({
      error: "The field must not be left empty!",
    });
  }

  await outcome.save((err, outcome) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
      return next(error);
    }
    res.json(outcome);
  });
};

exports.list = (req, res) => {
  Outcome.find({})
    .populate("indicators", "_id specific")
    .populate("years", "id name")
    .populate("substrand", "_id title statement")
    .exec((err, outcomes) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(outcomes);
    });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Outcome.findOne({ slug })
    .populate("substrand", "_id title")
    .populate("strand", "_id title slug")
    .populate({
      path: "strand",
      populate: { path: "years", model: "Year" },
    })
    .populate("year", "_id name slug")
    .populate("subject", "_id name slug")
    .select("_id content general assessment indicators strand")
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.listRelatedOutcomes = (req, res) => {
  //console.log(req.body.outcome);
  const { _id, substrand } = req.body.outcome;

  Outcome.find({
    // _id: { $ne: _id },
    substrand: { $in: substrand },
    // year: { $in: year },
    // strand: { $in: strand },
  })
    .populate("subject", "_id name")
    .populate("substrand", "_id title")
    .populate("year", "_id name")
    .select("_id subject substrand year general slug")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

// outcomeYearSubstrands
exports.outcomeYearSubstrands = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const { subject } = req.body.outcome;

  Year.findOne({ slug }).exec((err, year) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    
    Substrand.find({ years: year, subject: { $in: subject } })
      .populate("years", "_id name")
      .populate("subject", "_id name slug")
      .populate("strand", "_id title slug")
      .select("id years strand subject title slug")
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data);
      });
  });
};


exports.outcomeWithSubstrandAndStrand = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Outcome.findOne({ slug })
    .populate("indicators", "_id specific")
    .populate("substrand", "_id title slug")
    .populate("subject", "_id name slug")
    .populate("strand", "_id title slug")
    .populate({
      path: "strand",
      populate: { path: "years", model: "Year" },
    })
    .populate("year", "_id name")
    .select("_id general subject strand indicators year substrand slug")
    .exec((err, outcome) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      // res.json(outcome);
      Substrand.find({ outcomes: outcome }).exec((err, substrand) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        Strand.find({ substrands: substrand })
          .populate("substrands", {})
          .populate({
            path: "substrands",
            populate: { path: "outcomes", model: "Outcome" },
          })
          .exec((err, data) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            }
            res.json({
              outcome: outcome,
              substrand: substrand,
              strand: data,
            });
          });
      });
    });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Outcome.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Subject deleted successfully",
    });
  });
};

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Outcome.findOne({ slug })
    .select("photo")
    .exec((err, outcome) => {
      if (err || !outcome) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", outcome.photo.contentType);
      return res.send(outcome.photo.data);
    });
};
