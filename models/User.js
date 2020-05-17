const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
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
  adminOf: {
    type: [String],
    required: false
  },
  bio: {
    type: String,
    required: false
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
});

module.exports = User = mongoose.model('users', UserSchema);