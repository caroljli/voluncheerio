const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const Volunteer = require("../../models/Volunteer");

// @route GET api/volunteers/
// @desc See all volunteers
// @access Public
router.get("/", (req, res) => {
  Volunteer.find({}, (err, data) => {
    let arr = []
    data.forEach((i) => {
      arr.push({
        name: i.name,
        email: i.email
      })
    })
    res.json(arr)
  })
});

router.get("/getAllVolunteers", (req, res) => {
  Volunteer.find({}, (err, data) => {
    res.json(data)
  })
});

// @route POST api/volunteer/register
// @desc Sign up user
// @access Public
router.post("/register", (req, res) => {
  // Form validation - temporarily on hold
  // const { errors, isValid } = validateRegisterInput(req.body);

  // // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  Volunteer.findOne({ email: req.body.email }).then(volunteer => {
    if (volunteer) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newVolunteer = new Volunteer({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        association: [],
        shifts: [],
        points: 0
      });
      
      newVolunteer
        .save()
        .then(volunteer => res.json(volunteer))
        .catch(err => console.log(err));
    }
  });
});

// @route POST api/volunteer/login
// @desc Login user
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  // const { errors, isValid } = validateLoginInput(req.body);

  // // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  const email = req.body.email;
  const password = req.body.password;

  // find users by email
  Volunteer.findOne({ email: req.body.email }).then(volunteer => {
    // does user exist
    if (!volunteer) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } else {
      if (password !== volunteer.password) {
        return res.json({ error: 'Password incorrect' })
      }
      else {
        // return the volunteer data
        return res.json({ volunteer: volunteer })
      }
    }
  });
});

router.post("/delete", (req, res) => {
  res.send('not implemented')
})

// @route POST api/volunteer/getPoints
// @desc get volunteers points
// @access Public
router.get("/getPoints", (req, res) => {
  // find users by email
  Volunteer.findOne({ email: req.body.email }).then(volunteer => {
    // does user exist
    if (!volunteer) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } else {
      return res.json({ points: volunteer.points })
    }
  });
});

// @route POST api/volunteer/getPoints
// @desc get volunteers points
// @access Public
router.post("/updatePoints", (req, res) => {
  // find users by email
  Volunteer.findOne({ email: req.body.email }).then(volunteer => {
    // does user exist
    if (!volunteer) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } else {
      // newPoints = future value
      volunteer.points = req.body.newPoints
      volunteer
        .save()
        .then(v => res.json(v))
        .catch(err => console.log(err));
    }
  });
});

module.exports = router;
