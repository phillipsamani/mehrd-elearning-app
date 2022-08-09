const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const outcomeSchema = new mongoose.Schema(
  {
    subject: [{ type: ObjectId, ref: "Subject" }],
    subject: { type: ObjectId, ref: "Subject" },
    strand: [{ type: ObjectId, ref: "Strand" }],
    year: { type: ObjectId, ref: "Year" },
    substrand: [{ type: ObjectId, ref: "Substrand" }],

    content: {
      type: String,
      max: 100,
      required: true,
    },
    general: { type: String, max: 200, required: true },
    assessment: { type: {}, max: 500, required: true },
    mtitle: { type: String },
    photo: {
      data: Buffer,
      contentType: String,
    },
    indicators: [
      {
        subject: { type: ObjectId, ref: "Subject" },
        strand: { type: ObjectId, ref: "Strand" },
        substrand: { type: ObjectId, ref: "Substrand" },
        year: { type: ObjectId, ref: "Year" },
        content: { type: String },
        specific: { type: String },
        activity: { type: {}, max: 500 },
        assessment: { type: {}, max: 500 },
      },
    ],
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },

  { timestamp: true }
);

module.exports = mongoose.model("Outcome", outcomeSchema);
