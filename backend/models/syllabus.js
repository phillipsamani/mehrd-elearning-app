const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const syllabusSchema = new mongoose.Schema(
  {
    subject: {
      type: ObjectId,
      ref: "Subject",
    },
    years: [{ type: ObjectId, ref: "Year" }],
    sections: [{ type: ObjectId, ref: "Section" }],
    
    description: {
      type: String,
    },
    name: {
      type: String,
    },
    excerpt: {
      type: String,
      max: 1000,
    },
    introduction: [{ type: ObjectId, ref: "Introduction" }],
    aim: [{ type: ObjectId, ref: "Aim" }],
    rationale: [{ type: ObjectId, ref: "Rationale" }],
    strands: [{ type: ObjectId, ref: "Strand" }],
    category: { type: ObjectId, ref: "Category" },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Syllabus", syllabusSchema);
