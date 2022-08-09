const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const approachSchema = new mongoose.Schema(
  {
    subject: { type: ObjectId, ref: "Subject" },
    section: { type: ObjectId, ref: "Section" },
    title: { type: String },
    introduction: { type: String },
    heading1: { type: String },
    heading2: { type: String },    
    body: { type: String },
    photo: {
        data: Buffer,
        contentType: String
    },
        
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Approach", approachSchema);