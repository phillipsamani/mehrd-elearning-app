const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const termSchema = new mongoose.Schema(
  {
    year: { type: ObjectId, ref: "Year" },
    substrand: [{ type: ObjectId, ref: "Substrand" }],
    name: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Term", termSchema);
