const express = require("express");
var adminRouter = express.Router();
const authentication = require("../middleware/authentication");
const adminControler = require("../controler/adminfile");
const adminLogin = adminControler.adminLogin;
const adminUserUpdate = adminControler.adminUserUpdate;
const adminUserDelete = adminControler.adminUserDelete;
const adminUserDetails = adminControler.adminUserDetails;
const adminActiveUser = adminControler.adminActiveUser;
const adminInactiveUser = adminControler.adminInactiveUser;

adminRouter.get("/adminLogin", adminLogin);
adminRouter.put("/adminUpdate", authentication, adminUserUpdate);
adminRouter.get("/adminUserDetails", authentication, adminUserDetails);
adminRouter.delete("/adminDelete", adminUserDelete);
adminRouter.put("/deactivate", authentication, adminInactiveUser);
adminRouter.put("/activate", authentication, adminActiveUser);

module.exports = adminRouter;
