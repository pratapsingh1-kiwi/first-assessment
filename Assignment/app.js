const express = require("express");
const app = express();
const userRouter = require("./routers/user");
const imageRouter = require("./routers/imagePost");
const adminRouter = require("./routers/admin");
const connection = require("./db/connection");
connection.con();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(userRouter);
app.use(imageRouter);
app.use(adminRouter);

app.listen(3000);
