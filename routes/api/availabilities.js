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
const Availabilities = require("../../models/Availabilities");
const Volunteer = require("../../models/Volunteer");

// @route POST api/availabilities/create
// @desc Creates a new orgs
// user needs to be logged in
// @access Public
router.post("/create", (req, res) => {
  const {
    username
  } = req.body

  Availabilities.findOne({ username: username }).then(sched => {
    if (sched) {
      // org already exists
      return res.status(400).json({ username: "Volunteer schedule already exists" });
    } else {
      // we want to be adding the current admin
      const newSched = new Availabilities({
        username: username,
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        daily: []
      })

      newSched.save()
            .then(sched => {
              // send back data
              console.log('Updated schedule!')
              res.json(sched)
            })
            .catch(err => console.log(err));
    }
  })
});

// @route GET api/organizations/updateWeekly
// @desc See all orgs
// @access Public
router.post("/updateWeekly", (req, res) => {
  const { start, end, username } = req.body;
  Availabilities.findOne({ username: req.body.username }).then(sched => {
    // does user exist
    if (!sched) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } else {
        var time = {
          start: start,
          end: end
        }
        if (type === 'monday') {
          sched.monday.push(time)
          sched.monday = [...new Set(sched.monday)]
        } else if (type === 'tuesday') {
          sched.tuesday.push(time)
          sched.tuesday = [...new Set(sched.tuesday)]
        } else if (type === 'wednesday') {
          sched.wednesday.push(time)
          sched.wednesday = [...new Set(sched.wednesday)]
        } else if (type === 'thursday') {
          sched.thursday.push(time)
          sched.thursday = [...new Set(sched.thursday)]
        } else if (type === 'friday') {
          sched.friday.push(time)
          sched.friday = [...new Set(sched.friday)]
        } else if (type === 'saturday') {
          sched.saturday.push(time)
          sched.saturday = [...new Set(sched.saturday)]
        } else if (type === 'sunday') {
          sched.sunday.push(time)
          sched.sunday = [...new Set(sched.sunday)]
        }

      sched.save()
        .then(v => res.json(sched.sunday.start))
        .catch(err => console.log(err));
    }
  });
});

router.post("/updateDaily", (req, res) => {
  const { start, end, date, username } = req.body;
  Availabilities.findOne({ username: req.body.username }).then(sched => {
    // does user exist
    if (!sched) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } else {
        var time = {
          date: date,
          start: start,
          end: end
        }
        sched.daily.push(time)
        sched.daily = [...new Set(sched.daily)]

      sched.save()
        .then(v => res.json(sched.daily.start))
        .catch(err => console.log(err));
    }
  });
});

router.post("/delete", (req, res) => {
  const { type, username } = req.body;
  console.log(type)
  Availabilities.findOne({ username: req.body.username }).then(sched => {
    // does user exist
    if (!sched) {
      return res.status(404).json( "Email not found" );
    } else {
      console.log(type)
        if (type === 'daily') {
          sched.daily = []
        } else if (type === 'monday') {
          sched.monday = []
        } else if (type === 'tuesday') {
          sched.tuesday = []
        } else if (type === 'wednesday') {
          sched.wednesday = []
        } else if (type === 'thursday') {
          sched.thursday = []
        } else if (type === 'friday') {
          sched.friday = []
        } else if (type === 'saturday') {
          sched.saturday = []
        } else if (type === 'sunday') {
          sched.sunday = []
        }

        sched.save()
        .then(v => res.json(sched))
        .catch(err => console.log(err));
    }
  });
})

router.get("/daily", (req, res) => {
  const { start, end, date, username } = req.body;
  Availabilities.findOne({ username: username }).then(sched => {
    // does user exist
    if (!sched) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } else {
        res.json(sched.daily)
    }
  });
});


// @route GET api/organizations/names
// @desc See all orgs
// @access Public
router.get("/weekly", (req, res) => {
  const { type, username } = req.body;
  Availabilities.findOne({ username: username }).then(sched => {
    // does user exist
    if (!sched) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } else {
      if (type === 'monday') {
          return res.json({ monday: sched.monday })
        } else if (type === 'tuesday') {
          return res.json({ tuesday: sched.tuesday })
        } else if (type === 'wednesday') {
          return res.json({ wednesday: sched.wednesday })
        } else if (type === 'thursday') {
          return res.json({ thursday: sched.thursday })
        } else if (type === 'friday') {
          return res.json({ friday: sched.friday })
        } else if (type === 'saturday') {
          return res.json({ saturday: sched.saturday })
        } else if (type === 'sunday') {
          return res.json({ sunday: sched.sunday})
        } else {
          return res.json({ 
            monday: sched.monday, 
            tuesday: sched.tuesday, 
            wednesday: sched.wednesday,
            thursday: sched.thursday,
            friday: sched.friday,
            saturday: sched.saturday,
            sunday: sched.sunday
          })
        }
    }
  });
});

// @route GET api/organizations/
// @desc See all orgs
// @access Public
router.get("/", (req, res) => {
  Availabilities.find((err, data) => {
    if (!err) {
      res.json({
        error: null,
        data: data 
      })
    } else {
      res.json({
        error: err,
        data: null 
      })
    }
  })
});


module.exports = router;
