const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const resourceSchema = new mongoose.Schema(
  {
    subject: { type: ObjectId, ref: "Subject" },
    section: { type: ObjectId, ref: "Section" },
    identifier: { type: ObjectId, ref: "Section" },
    title: { type: String},
    body: { type: String},
    syllBooks: [{ type: ObjectId, ref: "Book" }],
    introduction: { type: String},
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
