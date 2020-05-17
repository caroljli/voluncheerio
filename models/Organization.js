const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrgSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  admins: {
    type: [String],
    required: true
  },
  shifts: {
    type: [{
      shiftID: {
        type: [String],
        required: true
      },
      organization: {
        type: [String],
        required: true
      },
      start: {
        type: [Date],
        required: true
      },
      end: {
        type: [Date],
        required: true
      },
      points: {
        type: [Number],
        required: true
      }
    }],
    required: false
  },
  about: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
});

module.exports = Organization = mongoose.model('organizations', OrgSchema);