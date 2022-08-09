const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const structureSchema = new mongoose.Schema(
  {
    subject: { type: ObjectId, ref: "Subject" },
    section: { type: ObjectId, ref: "Section" },
    identifier: { type: ObjectId, ref: "Section" },
    introduction: { type: String},
    theme: { type: String},
    title: { type: String},
    year: { type: String},
    strand: { type: String},  
    substrand: { type: String},   
    glo: { type: String},   
    slo: { type: String}, 
    sae: { type: String}, 
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Structure", structureSchema);
