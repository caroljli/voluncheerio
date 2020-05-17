const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
// const validateRegisterInput = require("../../validation/register");
// const validateLoginInput = require("../../validation/login");

// Load User model
const Shift = require("../../models/Shift");
const Request = require("../../models/ShiftRequests");
const Volunteer = require("../../models/Volunteer");

// @route POST api/shifts/create
// @desc Creates a new shift
// user needs to be logged in
// @access Public
router.post("/create", (req, res) => {
  const {
    organization, start, end
  } = req.body

  const points = ((req.body.points) && (req.body.points > 0)) ? req.body.points : 0
  
  const shiftID = organization + start
  
  Shift.findOne({ shiftID: shiftID }).then(shift => {
    if (shift) {
      return res.status(400).json({ email: "Shift already exists" });
    } else {
      const newShift = new Shift({
        shiftID: shiftID,
        organization: organization,
        start: start,
        end: end,
        volunteers: [],
        points: points
      });

      newShift
            .save()
            .then(shift => {
              Organization.findOne({ name: organization }).then(org => {
                org.shifts.push({
                  shiftID: shiftID,
                  organization: organization,
                  start: start,
                  end: end,
                  points: points
                })
                org.save()
                .then(_ => {
                  res.json(shift)
                })
                .catch(err => console.log(err));
              })
            })
            .catch(err => console.log(err));
    }
  })
});

// @route POST api/shifts/request
// @desc Requests user x to take a shift
// Unique w/o admin, but admin is stored
// user needs to be logged in
// @access Public
router.post("/request", (req, res) => {
  const { shiftID, organization, admin, volunteer } = req.body;
  Request.findOne({
    shiftID: shiftID, 
    organization: organization, 
    volunteer: volunteer
  }).then(shift => {
    if (shift) {
      return res.status(400).json({ email: "Shift has already been made" });
    } else {
      const newRequest = new Request({
        shiftID: shiftID, 
        organization: organization, 
        admin: admin,
        volunteer: volunteer
      })

      newRequest.save()
            .then(request => res.json(request))
            .catch(err => console.log(err));
    }
  })
});

// @route POST api/shifts/approve
// Don't need to find the admin because it should be unique per user
// @desc Approves a shift
// user needs to be logged in
// Technically allows repeat shifts, just doesn't save them
// @access Public
router.post("/approve", (req, res) => {
  const { shiftID, organization, volunteer } = req.body;
  Request.findOne({
    shiftID: shiftID, 
    organization: organization, 
    volunteer: volunteer
  }).then(request => {
    if (!request) {
      return res.status(400).json({ request: "No such request exists! Sign up instead" });
    } else {
      // add volunteer to shifts
      Shift.findOne({
        shiftID: shiftID
      }).then(shift => {
        shift.volunteers.push(volunteer)
        shift.volunteers = [...new Set(shift.volunteers)]
        shift.save();

        // add to volunteer
        Volunteer.findOne({
          email: volunteer
        }).then(volunt => {
          volunt.shifts.push(shiftID)
          volunt.shifts = [...new Set(volunt.shifts)]
          volunt.associations.push(organization)
          volunt.associations = [...new Set(volunt.associations)]
          volunt.points = volunt.points + shift.points; // update points
          volunt.save();

          // remove this shift
          Request.deleteOne({
            shiftID: shiftID, 
            organization: organization, 
            volunteer: volunteer
          }).then(request => {
              return res.json({
                volunteer: volunt, 
                confirm: true
              })
          }).catch(err =>
            res.status(400).json({ error: "Problem in deleting shift" })
          )
        })
      })
    }
  })
});

// @route POST api/shifts/signup
// Don't need to find the admin because it should be unique per user
// @desc Signup a shift
// user needs to be logged in
// Technically allows repeat shifts, just doesn't save them
// @access Public
router.post("/signup", (req, res) => {
  Shift.findOne({ 
    shiftID: req.body.shiftID
  }).then((shift) => {
    console.log(req.body.shiftID)
    shift.volunteers.push(req.body.volunteer)
    shift.volunteers = [...new Set(shift.volunteers)]

    shift.save().then((shift2) => {
      Volunteer.findOne({email: req.body.volunteer}).then((person) => {
        console.log(req.body.volunteer)
        console.log(person.shifts)
        person.shifts.push(req.body.shiftID)
        person.shifts = [...new Set(person.shifts)]
        person.associations.push(req.body.associations)
        person.associations = [...new Set(person.associations)]
        person.save().then(data => 
          res.json(data)
        ).catch(err => 
          console.log(err)
        )
      })
    }).catch(err => console.log(err));
  })
});

// @route POST api/shifts/unsignup
// Don't need to find the admin because it should be unique per user
// @desc Unsignup a shift
// user needs to be logged in
// Technically allows repeat shifts, just doesn't save them
// @access Public
router.post("/unsignup", (req, res) => {
  Shift.findOne({ 
    shiftID: req.body.shiftID
  }).then((shift) => {
    const index = shift.volunteers.indexOf(req.body.volunteer);
    if (index > -1) {
      shift.volunteers.splice(index, 1);
    }
    shift.volunteers = [...new Set(shift.volunteers)]

    shift.save().then((shift2) => {
      Volunteer.findOne({email: req.body.volunteer}).then((person) => {
        console.log(req.body.volunteer)
        console.log(person.shifts)

        const index = person.shifts.indexOf(req.body.shiftID);
        if (index > -1) {
          person.shifts.splice(index, 1);
        }

        person.shifts = [...new Set(person.shifts)]

        person.save().then(data => 
          res.json(data)
        ).catch(err => 
          console.log(err)
        )
      })
    }).catch(err => console.log(err));
  })
});

// @route POST api/shifts/reject
// @desc Rejects a shift
// user needs to be logged in
// @access Public
router.post("/reject", (req, res) => {
  const { shiftID, organization, volunteer } = req.body;
  Request.findOne({
    shiftID: shiftID, 
    organization: organization, 
    volunteer: volunteer
  }).then(request => {
    if (!request) {
      return res.status(400).json({ request: "No such request exists! Sign up instead" });
    } else {
      // don't add volunteer to shifts
      // don't add to volunteer
      // remove this shift
      Request.deleteOne({
        shiftID: shiftID, 
        organization: organization, 
        volunteer: volunteer
      }).then(request => {
        return res.json({
          volunteer: null, 
          confirm: false
        })
      }).catch(err =>
        res.status(400).json({ error: "Problem in deleting shift" })
      )
    }
  })
});

router.get("/getAllRequests", (req, res) => {
  Request.find({}, (err, data) => {
    res.json(data)
  })
});

router.get("/getVolunteers", (req, res) => {
  Shift.find({}, (err, data) => {
    res.json(data)
  })
});


// @route GET api/shifts/
// @desc See all shifts
// @access Public
router.get("/", (req, res) => {
  Shift.find({}, (err, data) => {
    res.json(data)
  })
});

module.exports = router;
