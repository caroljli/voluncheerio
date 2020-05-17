const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ShiftSchema = new Schema({
  shiftID: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  volunteers: {
    type: [String],
    required: false
  },
  points: {
    type: Number,
    required: false
  },
});

module.exports = Shift = mongoose.model("shifts", ShiftSchema);

