const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema(
  {
    subject: { type: ObjectId, ref: "Subject" },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Category", categorySchema);
