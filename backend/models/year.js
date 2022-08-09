const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const yearSchema = new mongoose.Schema(
  {
    subject: [{ type: ObjectId, ref: "Subject" }],
    section: [{ type: ObjectId, ref: "Section" }],
    name: {
      type: Number,
      required: true,
    },
    mtitle: {
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

module.exports = mongoose.model("Year", yearSchema);
