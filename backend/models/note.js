const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const noteSchema = new mongoose.Schema(
  {
    title: { type: String },
    body: {
      type: {},
    },

    outcome: { type: ObjectId, ref: "Outcome" },
    createdBy: {
      type: ObjectId,
      ref: "User",
    },

    createdAt: { type: Date, default: Date.now },
    slug: { type: String, unique: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
