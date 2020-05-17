const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RequestSchema = new Schema({
  shiftID: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  admin: {
    // email
    type: String,
    required: true
  },
  volunteer: {
    // email
    type: String,
    required: true
  }
});

module.exports = Requests = mongoose.model("requests", RequestSchema);

