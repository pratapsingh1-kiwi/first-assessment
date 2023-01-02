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

// for signup

const userSignup = function (req, res, next) {
  const object = joiSignup.validate({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    phone_number: req.body.phone_number,
    address: req.body.address,
  });
  if (object.error != undefined) {
    console.log(object.error.details[0].message);
    res.send(object.error.details[0].message);
  } else {
    user.findOne({ email: req.body.email }, async (err, val) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        if (val != null) {
          console.log("User from " + req.body.email + " is already exist ");
          res.send("User from " + req.body.email + " is already exist ");
        } else {
          const salt = await bcryptjs.genSalt(10);
          const hashedPassword = await bcryptjs.hash(req.body.password, salt);

          const doc = new user({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            phone_number: req.body.phone_number,
            address: req.body.address,
            active: true,
          });

          const obj = await doc.save();
          console.log("User has been saved");
          res.send("User has been saved");
        }
      }
    });
  }
};

// for logging user

const userLogin = function (req, res, next) {
  const object = joiLogin.validate({
    email: req.body.email,
    password: req.body.password,
  });

  if (object.error != undefined) {
    console.log(object.error.details[0].message);
    res.send(object.error.details[0].message);
  } else {
    user.findOne({ email: req.body.email }, async (err, val) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        if (val == null) {
          console.log("Here is no data for login");
          res.send("Here is no data for login");
        } else {
          if (val.active) {
            const password = req.body.password;
            const databasePassword = val.password;

            const bool = await bcryptjs.compare(password, databasePassword);
            if (bool) {
              const token = jwt.sign({ email: req.body.email }, "Protected");
              console.log(val);
              res.send({
                token: token,
                userInformation: val,
              });
            } else {
              res.send("Password does not match");
              console.log("password does not match");
            }
          } else {
            console.log("User is not active");
            res.send("User is not active");
          }
        }
      }
    });
  }
};

// user can update details

const userUpdate = function (req, res, next) {
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




module.exports.userUpdate = userUpdate;
module.exports.userLogin = userLogin;
module.exports.userSignup = userSignup;
