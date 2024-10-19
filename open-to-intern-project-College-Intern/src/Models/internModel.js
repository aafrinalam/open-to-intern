const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const internSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
      match: [/^(\+\d{1,3}[- ]?)?\d{10}$/],
    },
    collegeId: {
      type: ObjectId,
      ref: "college",
      required:true
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  // { timestamps: true }
);

module.exports = mongoose.model("Internship", internSchema);
