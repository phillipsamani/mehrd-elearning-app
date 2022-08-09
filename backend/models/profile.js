const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const profilescSchema = new mongoose.Schema(
  {
    subject: { type: ObjectId, ref: "Subject" },
    section: { type: ObjectId, ref: "Section" },
    identifier: { type: ObjectId, ref: "Section" },
    title: { type: String },
    introduction: { type: String },
    profile1: [{ type: ObjectId, ref: "Primary" }],
    profile2: [{ type: ObjectId, ref: "Upper_Primary" }],
    body: { type: String },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Profile", profilescSchema);