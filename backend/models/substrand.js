const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const substrandSchema = new mongoose.Schema(
  {
    subject: [{ type: ObjectId, ref: "Subject" }],
    subject: { type: ObjectId, ref: "Subject" },
    section: { type: ObjectId, ref: "Section" },       
    level: [{ type: ObjectId, ref: "Year" }],
    years: { type: ObjectId, ref: "Year" },
    terms: [{ type: ObjectId, ref: "Term" }],
    title: {
      type: String,
    },
    subtitle: {
      type: ObjectId,
      ref: "SubstrandTitle",
    },
    periods: {
      type: Number,
    },
    statement: {
      type: String,
      max: 1000,
    },
    outcomes: [{ type: ObjectId, ref: "Outcome" }],
    mtitle: { type: String },
    mdesc: { type: String },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Substrand", substrandSchema);
