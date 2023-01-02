const express = require("express");
var userRouter = express.Router();
const authentication = require("../middleware/authentication");
const userControler = require("../controler/userfile");
const userLogin = userControler.userLogin;
const userSignup = userControler.userSignup;
const userUpdate = userControler.userUpdate;

userRouter.post("/signUp", userSignup);
userRouter.get("/login", userLogin);
userRouter.put("/updateUser", authentication, userUpdate);

module.exports = userRouter;
