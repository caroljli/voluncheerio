const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VolunteerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  associations: {
    type: [String],
    required: true
  },
  shifts: {
    type: [String],
    required: true
  },
  points: {
    type: Number,
    required: true
  }
});

module.exports = Volunteer = mongoose.model("volunteers", VolunteerSchema);

