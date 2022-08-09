const Section = require("../models/section");
const Foreword = require("../models/foreword");
const Profile = require("../models/profile");
const Acknowledgement = require("../models/acknowledgement");
const Introduction = require("../models/introduction");
const Contribution = require("../models/contribution");
const Rationale = require("../models/rationale");
const Assessment = require("../models/assessment");
const Structure = require("../models/structure");
const Reference = require("../models/reference");
const Resource = require("../models/resource");
const Aim = require("../models/aim");
const Strand = require("../models/strand");
const Glossary = require("../models/glossary");
const Social = require("../models/social_tools");
const Science = require("../models/science_tools");
const ProcessesPsc = require("../models/processes_Psc");
const ProcessesPss = require("../models/processes_Pss");
const LearningPsc = require("../models/learning_primary");
const Year = require("../models/year");
const Syllabus = require("../models/syllabus");
const formidable = require("formidable");
const slugify = require("slugify");
const { smartTrim } = require("../helpers/strand");
const { errorHandler } = require("../helpers/dbErrorHandler");

//variables from config
const config = require("config");
// const { default: Aim } = require("../../client/components/aim/aimModal");
const appName = config.get("APP_NAME");

//make sectionId available in a request
exports.sectionById = (req, res, next, id) => {
    Section.findById(id)
      .populate("section")
      .exec((err, section) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        req.section = section;
        next();
      });
  };
  
  exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
      const { subjects, title, subtitle, body } = fields;
  
      let section = new Section();
      section.subtitle = subtitle;     
      section.title = title;
      section.body = body;
  
      section.slug = slugify(subtitle).toLowerCase();
     
      let arrayOfSubjects = subjects && subjects.split(",");
      
      section.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
  
        Section.findByIdAndUpdate(
          result._id,
          { $push: { subjects: arrayOfSubjects } },
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
      });
    });
  };
  
exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Section.findOne({ slug })
        .populate("subject", "_id name slug")
        .populate("section", "_id title slug")
        .exec((err, data) => {
        if (err) {
        return res.status(400).json({
            error: errorHandler(err),
        });
        }
        res.json(data);
    });
};

exports.listSubstrandSyllabusContent = (req, res) => {
  const { subject } = req.body.substrand;

  Section.find({subjects: { $in: subject }})
  .exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.getSyllabusSection = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const subject  = req.body.subject;
  
  Section.findOne({slug})
  .exec((err, section) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    // res.json(data);
    Foreword.find({ section: section, subject: { $in: subject } })
    .exec((err, foreword) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      //res.json(data);
      Introduction.find({ section: section, subject: { $in: subject } })
      .exec((err, introduction) => {
        if (err) {
          return res.json({
            error: errorHandler(err),
          });
        }
        // res.json({foreword, introduction});
        Acknowledgement.find({ section: section, subject: { $in: subject } })
        .exec((err, acknowledgement) => {
          if (err) {
            return res.json({
              error: errorHandler(err),
            });
          }
          res.json({foreword, introduction, acknowledgement});
          
        })
        
      })

    })
  });
}
   
exports.getSectionWithSyllabus = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    const { subject } = req.body.syllabus;
    
    Section.findOne({ slug }).exec((err, section) => {         
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      
      //onClick for introduction
      Introduction.find({ section: section, subject: { $in: subject } })
        .populate("section", "_id title subtitle slug")
        .populate("identifier", "_id title subtitle slug")
        .select("_id section title body slug")  
        .exec((err, data) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }
          Rationale.find({ section: section, subject: { $in: subject } })
          .select("id title body slug")
          .populate("identifier", "_id title subtitle slug")
          .exec((err, result) => {
              if (err) {
                  return res.status(400).json({
                  error: errorHandler(err),
                  });
              }
              Aim.find({section: section, subject: { $in: subject } })
              .populate("identifier", "_id title subtitle slug")
              .select("id title body slug")
              .exec((err, outcome) => {
                  if (err) {
                      return res.status(400).json({
                      error: errorHandler(err),
                      });
                  }
                  //res.json({section, introduction: data, rationale: result, aim: outcome});
                  Strand.find({section: section, subject: { $in: subject } })
                  .populate("identifier", "_id title subtitle slug")
                  .select("id section years statement title body mdesc slug")
                  .exec((err, thisOutcome) => {
                    if (err) {
                        return res.status(400).json({
                        error: errorHandler(err),
                        });
                    }
                    Year.find({section: section, subject: { $in: subject } })
                    .exec((err, year) => {
                      if (err) {
                          return res.status(400).json({
                          error: errorHandler(err),
                          });
                      }
                      Foreword.find({section: section, subject: { $in: subject } })
                      .populate("identifier", "_id title subtitle slug")
                      .exec((err, foreword) => {
                        if (err) {
                            return res.status(400).json({
                            error: errorHandler(err),
                            });
                        }
                        
                        Acknowledgement.find({section: section, subject: { $in: subject } })
                        .populate("identifier", "_id title subtitle slug")
                        .exec((err, acknowledgement) => {
                          if (err) {
                              return res.status(400).json({
                              error: errorHandler(err),
                              });
                          }
                          Assessment.find({section: section, subject: { $in: subject } })
                          .populate("identifier", "_id title subtitle slug")
                          .exec((err, assessment) => {
                            if (err) {
                                return res.status(400).json({
                                error: errorHandler(err),
                                });
                            }
                            
                            Reference.find({section: section, subject: { $in: subject } })
                            .populate("identifier", "_id title subtitle slug")
                            .exec((err, reference) => {
                              if (err) {
                                  return res.status(400).json({
                                  error: errorHandler(err),
                                  });
                              }
                              
                              Glossary.find({section: section, subject: { $in: subject } })
                              .populate("identifier", "_id title subtitle slug")
                              .exec((err, glossary) => {
                                if (err) {
                                    return res.status(400).json({
                                    error: errorHandler(err),
                                    });
                                }
                                Contribution.find({section: section, subject: { $in: subject } })
                                .populate("identifier", "_id title subtitle slug")
                                .exec((err, contribution) => {
                                  if (err) {
                                      return res.status(400).json({
                                      error: errorHandler(err),
                                      });
                                  }
                                  
                                  Structure.find({section: section, subject: { $in: subject } })
                                  .populate("identifier", "_id title subtitle slug")
                                  .exec((err, structure) => {
                                    if (err) {
                                        return res.status(400).json({
                                        error: errorHandler(err),
                                        });
                                    }
                                    Resource.find({section: section, subject: { $in: subject } })
                                    .populate("syllBooks", "_id title yearPublish publisher")
                                    .populate("identifier", "_id title subtitle slug")
                                    .exec((err, resource) => {
                                      if (err) {    
                                          return res.status(400).json({   
                                          error: errorHandler(err),
                                          });
                                      }
                                      Social.find({section: section, subject: { $in: subject } })
                                      .populate("identifier", "_id title subtitle body slug")
                                      .populate("supplementary", "_id title introduction itemNumber itemName slug")
                                      .populate("section", "_id title subtitle body slug")
                                      .populate("general", "_id title introduction items1 items2 slug")
                                      .exec((err, social) => {
                                        if (err) {
                                            return res.status(400).json({
                                            error: errorHandler(err),
                                            });
                                        }
                                        Science.find({section: section, subject: { $in: subject } })
                                          .populate("identifier", "_id title subtitle body slug")
                                          .populate("resource1", "_id title introduction items1 items2 slug")
                                          .populate("resource2", "_id title body slug")
                                          .exec((err, science) => {
                                            if (err) {
                                                return res.status(400).json({
                                                error: errorHandler(err),
                                                });
                                            }
                                            Profile.find({section: section, subject: { $in: subject } })
                                              .populate("identifier", "_id title subtitle body slug")
                                              .populate("profile1", "_id title learning_area periods_week minutes_period minutes_week hours_week total_time_week slug")
                                              .populate("profile2", "_id title learning_area periods_week minutes_period minutes_week hours_week total_time_week slug")
                                              .exec((err, profile) => {
                                                if (err) {
                                                    return res.status(400).json({
                                                    error: errorHandler(err),
                                                    });
                                                }
                                                ProcessesPsc.find({section: section, subject: { $in: subject } })
                                                .populate("identifier", "_id title subtitle body slug")
                                                .populate("headings", "_id title year planning conducting processing evaluating communication slug")
                                                .populate("skills", "_id title year planning conducting processing evaluating communication slug")
                                                .exec((err, processes) => {
                                                  if (err) {
                                                      return res.status(400).json({
                                                      error: errorHandler(err),
                                                      });
                                                  }
                                                  ProcessesPss.find({section: section, subject: { $in: subject } })
                                                  .populate("identifier", "_id title subtitle body slug")
                                                  .populate("headings", "_id title year making reflecting processing understanding strategies exploring participation slug")
                                                  .populate("skills", "_id title year making reflecting processing understanding strategies exploring participation slug")
                                                  .exec((err, processesPss) => {
                                                    if (err) {
                                                        return res.status(400).json({
                                                        error: errorHandler(err),
                                                        });
                                                    }
                                                    
                                                    LearningPsc.find({section: section, subject: { $in: subject } })
                                                    .populate("identifier", "_id title subtitle body slug")
                                                    .populate("approaches", "_id title introduction body heading1 heading2")
                                                    .populate("links", "_id body")
                                                    .populate({
                                                      path: "links",
                                                      populate: { path: "learningAreas", model: "Area" },
                                                    })
                                                    
                                                    
                                                    .populate("issues", "_id subtitle body")
                                                    .populate("monitoring", "_id subtitle introduction body")
                                                    .populate({
                                                      path: "monitoring",
                                                      populate: { path: "table", model: "MonitorHeading" },
                                                    })
                                                    .exec((err, learningPsc) => {
                                                      if (err) {
                                                          return res.status(400).json({
                                                          error: errorHandler(err),
                                                          });
                                                      }
                                                      res.json({section, 
                                                        introduction: data, 
                                                        rationale: result, 
                                                        aim: outcome, 
                                                        strand: thisOutcome, 
                                                        years: year, 
                                                        foreword: foreword, 
                                                        acknowledgement: acknowledgement, 
                                                        assessment: assessment, 
                                                        reference: reference,
                                                        glossary: glossary,
                                                        contribution: contribution,
                                                        structure: structure,
                                                        resource: resource,
                                                        social: social,
                                                        science: science,
                                                        profile: profile,
                                                        processes: processes,
                                                        processesPss: processesPss,
                                                        learningPsc: learningPsc
                                                        
                                                      }); 
                                                    })
                                                  })
                                                    
                                                })
                                              })
                                          })
                                      })                                       
                                    }) 
                                  })
                                })
                              })
                            })
                          }) 
                        }) 
                      }) 
                    })  
                  })            
              })
          });
        });        
    });
  };
  
  