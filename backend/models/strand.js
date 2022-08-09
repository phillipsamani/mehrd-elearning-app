const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const strandSchema = new mongoose.Schema(
  {

    subject: { type: ObjectId, ref: "Subject" },
    years: [{ type: ObjectId, ref: "Year" }],
    section: { type: ObjectId, ref: "Section" },
    identifier: { type: ObjectId, ref: "Section" },
    level: { type: ObjectId, ref: "Year" },     
    title: {
      type: String,
      required: true,
      max: 100,
    },
    body: {
      type: String,
      required: true,
      max: 350,
    },
    substrands: [{ type: ObjectId, ref: "Substrand" }],
    mtitle: {
      type: String,  
    },
    mdesc: {
      type: String,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Strand", strandSchema);
