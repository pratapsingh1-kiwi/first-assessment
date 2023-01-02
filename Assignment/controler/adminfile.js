const bcryptjs = require("bcryptjs");
const schema = require("../schema/userSchema.js");
const schemaDraft = schema.schemaDraft();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const user = mongoose.model("user", schemaDraft);
const joi = require("joi");

// for validation

const joiSignup = joi.object({
  email: joi.string().email().min(8).required(),
  name: joi.string().min(3).max(20).required(),
  password: joi.string().min(8).required(),
  phone_number: joi.string().min(9).max(14).required(),
  address: joi.string().min(10).max(50).required(),
});
const joiLogin = joi.object({
  email: joi.string().email().min(8).required(),
  password: joi.string().min(8).required(),
});


// admin creation

const adminLogin = function (req, res) {
  const object = joiLogin.validate({
    email: req.body.email,
    password: req.body.password,
  });

  if (object.error != undefined) {
    console.log(object.error.details[0].message);
    res.send(object.error.details[0].message);
  } else {
    const adminEmail = "Pratap@gmail.com";
    const adminPassword = "Pratap@123";

    if (req.body.email == adminEmail) {
      if (req.body.password == adminPassword) {
        const token = jwt.sign({ email: req.body.email }, "Protected");
        console.log("admin logged in successfully");
        console.log(token);
        res.send(token);
      } else {
        res.send("Admin password is wrong");
        console.log("Admin password is wrong");
      }
    } else {
      res.send("Admin email is wrong");
      console.log("Admin email is wrong");
    }
  }
};

// admin can update details

const adminUserUpdate = function (req, res) {
  user
    .findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          name: req.body.name,
          password: req.body.password,
          phone_number: req.body.phone_number,
          address: req.body.address,
        },
      }
    )
    .then((value) => {
      try {
        console.log("Information has been updated");
        res.send("Information has been updated");
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    });
};

// admin can view details

const adminUserDetails = function (req, res) {
  user.find().then((value) => {
    try {
      console.log(value);
      res.send(value);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });
};

// for deleting user

const adminUserDelete = function (req, res) {
  user.deleteOne({ email: req.body.email }, (err, val) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      if (val.deletedCount == 0) {
        console.log("Please enter valid email");
        res.send("Please enter valid email");
      } else {
        console.log("Data is deleted");
        res.send("Data is deleted");
      }
    }
  });
};

// admin can make user active
const adminActiveUser = function (req, res) {
  user
    .findOneAndUpdate({ email: req.body.email }, { $set: { active: true } })
    .then((value) => {
      try {
        console.log("User has been activated");
        res.send("User has been activated");
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    });
};

// admin can make user inactive

const adminInactiveUser = function (req, res) {
  user
    .findOneAndUpdate({ email: req.body.email }, { $set: { active: false } })
    .then((value) => {
      try {
        console.log("User has been deactivated");
        res.send("User has been deactivated");
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    });
};


module.exports.adminInactiveUser = adminInactiveUser;
module.exports.adminActiveUser = adminActiveUser;
module.exports.adminLogin = adminLogin;
module.exports.adminUserDelete = adminUserDelete;
module.exports.adminUserDetails = adminUserDetails;
module.exports.adminUserUpdate = adminUserUpdate;