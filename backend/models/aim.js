const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const aimSchema = new mongoose.Schema(
  {
    subject: { type: ObjectId, ref: "Subject" },
    section: { type: ObjectId, ref: "Section" },
    identifier: { type: ObjectId, ref: "Section" },
    title: {
      type: String,
      trim: true,
      required: true,
      max: 100,
    },
    body: {
      type: String,
      required: true,
      max: 1000,
    },
    mtitle: {
      type: String,
    },
    excerpt: {
      type: String,
    },
    aim: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Aim", aimSchema);
