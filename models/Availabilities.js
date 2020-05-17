const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AvailabilitiesSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  monday: {
    type: [{
      start: {
        type: [String],
        required: true
      },
      end: {
        type: [String],
        required: true
      }
    }]
  },
  tuesday: {
    type: [{
      start: {
        type: [String],
        required: true
      },
      end: {
        type: [String],
        required: true
      }
    }]
  },
  wednesday: {
    type: [{
      start: {
        type: [String],
        required: true
      },
      end: {
        type: [String],
        required: true
      }
    }]
  },
  thursday: {
    type: [{
      start: {
        type: [String],
        required: true
      },
      end: {
        type: [String],
        required: true
      }
    }]
  },
  friday: {
    type: [{
      start: {
        type: [String],
        required: true
      },
      end: {
        type: [String],
        required: true
      }
    }]
  },
  daily: {
    type: [{
      date: {
        type: [Date],
        required: true
      },
      start: {
        type: [String],
        required: true
      },
      end: {
        type: [String],
        required: true
      }
    }]
  } 
});

module.exports = Volunteer = mongoose.model("availabilities", AvailabilitiesSchema);

