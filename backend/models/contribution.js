const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const contributionSchema = new mongoose.Schema(
  {
    subject: { type: ObjectId, ref: "Subject" },
    section: { type: ObjectId, ref: "Section"},
    identifier: { type: ObjectId, ref: "Section"},
    title: { type: String },
    introduction: { type: String },
    culture: { type: String },
    lifelong: { type: String },
    citizenship: { type: String },
    peace: { type: String },
    technology: { type: String },
    preservation: { type: String },
    entrepreneurship: { type: String },
    development: { type: String },
    financial: { type: String },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Contribution", contributionSchema);