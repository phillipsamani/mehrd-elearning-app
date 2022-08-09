const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const sectionSchema = new mongoose.Schema(
  {
    subjects: [{ type: ObjectId, ref: "Subject" }],
    title: {
      type: String,
      
    },
    subtitle: {
      type: String,
      
    },
    body: { type: String },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Section", sectionSchema);