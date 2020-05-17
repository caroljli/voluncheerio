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
const Organization = require("../../models/Organization");
const User = require("../../models/User");

/**
 * @route POST api/organizations/organizationInfo
 * @desc returns all organizations as an array
 */
router.get("/organizationInfo", (req, res) => {
  Organization.find().then(orgs => {
    return res.json(orgs)
  })
  // var data;
  // MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  //   if (err) throw err;
  //   var dbo = db.db("organizations");
  //   dbo.collection("organizations").find().toArray(function(err, result) {
  //     if (err) throw err;
  //     res.send({express: result})
  //     db.close();
  //   });
  // });
});

/**
 * @route POST api/organizations/addShift
 * @desc add shift to array of shifts per org
 */
router.post("/addShifts", (req, res) => {
  Organization.findOne({ name: req.body.name }).then(org => {
    const {
      shift
    } = req.body

    if (org) {
      // org exists, push shift into array
      if (!org.shifts.includes(shift)) {
        org.shifts.push(shift)
        org.save()
      }
    } 
  })
});

// @route POST api/organizations/create
// @desc Creates a new orgs
// user needs to be logged in
// @access Public
router.post("/create", (req, res) => {
  const {
    name, admins, about, email, phone, picture
  } = req.body

  Organization.findOne({ name: name }).then(org => {
    if (org) {
      // org already exists
      return res.status(400).json({ name: "Organization already exists" });
    } else {
      // we want to be adding the current admin
      const newOrg = new Organization({
        name: name,
        admins: admins,
        shifts: [],
        about: about,
        email: email,
        phone: phone,
        picture: picture
      })

      newOrg.save()
            .then(org => {
              // update all the users
              req.body.admins.forEach((email) => {
                console.log(email)
                User.findOne({ email: email }, (err, user) => {
                  // err will never happen because we send the default user in
                  user.adminOf.push(org.name)
                  user.save() 
                  // TODO: ERROR CHECKING
                })
              })
              // send back data
              console.log('Updated users!')
              res.json(org)
            })
            .catch(err => console.log(err));
    }
  })
});

// @route POST api/organizations/approve
// @desc Approves a orgs
// user needs to be logged in
// @access Public
router.post("/delete", (req, res) => {
  Organization.findOne({ name: req.body.name }).then(org => {
    if (!org) {
      // org doesn't exist; can't be deleted
      return res.status(400).send(('Deletion error!', null))
    } else {
      Organization.deleteOne({ name: req.body.name }, (err) => {
        return res.send((null, 'Deleted ' + req.body.name))
      }).then(
        org.admins.forEach((email) => {
          User.findOne({ email: email }, (err, user) => {
            // err will never happen because we send the default user in
            user.adminOf = user.adminOf.filter(
              function(value, index, arr) {
                return value !== req.body.name
            })
            user.save() 
            // TODO: ERROR CHECKING
          })
          console.log('Updated users!')
        })
      )
    }
  })
});

// @route GET api/organizations/filter
// @desc See all orgs
// @access Public
router.post("/filter", (req, res) => {
  const email = req.body.email
  Organization.find({}, (err, data) => {
    if (!err) {
      let arr = []
      data.forEach((i) => {
        if (i.admins.includes(email)) {
          arr.push(i)
        }
      })
      res.json({data: arr})
    } else {
      res.json({
        error: err,
        data: null 
      })
    }
  })
});

// @route GET api/organizations/names
// @desc See all orgs
// @access Public
router.get("/names", (req, res) => {
  Organization.find({}, (err, data) => {
    if (!err) {
      let arr = []
      data.forEach((i) => {
        i.shifts.forEach((j) => {
          let org = j.organization[0]
          if (!arr.includes(org))
            arr.push(org)
        })
      })
      res.json({data: arr})
    } else {
      res.json({
        error: err,
        data: null 
      })
    }
  })
});

// @route POST api/organizations/create
// @desc Creates a new orgs
// user needs to be logged in
// @access Public
router.post("/updatePhoto", (req, res) => {
  const {
    name, picture
  } = req.body

  Organization.findOne({ name: name }).then(org => {
    if (!org) {
      // org doesn't exist
      return res.status(400).json({ name: "Organization not found" });
    } else {
      org.picture = picture
      org.save()
            .then(org => {
              // send back data
              console.log('Updated org picture!')
              res.json(org)
            })
            .catch(err => console.log(err));
    }
  })
});

// @route GET api/organizations/
// @desc See all orgs
// @access Public
router.get("/", (req, res) => {
  Organization.find((err, data) => {
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

/**
 * update description
 */
router.post("/updateAbout", (req, res) => {
  const name = req.body.name
  const newAbout = req.body.newAbout

  Organization.findOne({ name: name }).then(org => {
    if (!org) {
      // org already exists
      return res.status(400).json({ name: "Organization not found" });
    } else {
      org.about = newAbout
      org.save()
            .then(org => {
              // send back data
              console.log('Updated org about!')
              res.json(org)
            })
            .catch(err => console.log(err));
    }
  })
})

module.exports = router;
