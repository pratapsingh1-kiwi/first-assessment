const express = require("express");
var imageRouter = express.Router();
const schema = require("../schema/postSchema.js");
const postSchema = schema.post();
const mongoose = require("mongoose");
const post = mongoose.model("post", postSchema);
const authentication = require("../middleware/authentication");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadfile = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "uploadedFiles/");
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  }),
});

imageRouter.post(
  "/newPost",
  authentication,
  uploadfile.single("user_file"),
  async (req, res) => {
    console.log(req.file);

    if (req.file != undefined) {
      const p = new post({
        user_Id: req.body.user_id,
        image: {
          data: fs.readFileSync(
            path.join(__dirname, "../uploadedFiles/", req.file.filename)
          ),
          contentType: "text/image",
        },
        title: req.body.title,
        description: req.body.description,
      });

      const obj = await p.save();
      console.log(obj);
      res.send(obj);
    } else {
      const p = new post({
        user_Id: req.body.user_id,
        title: req.body.title,
        description: req.body.description,
      });

      const obj = await p.save();
      console.log(obj);
      res.send(obj);
    }
  }
);

//view post by the user
imageRouter.get("/userPost", authentication, (req, res) => {
  post.find({ user_Id: req.body.user_Id }).then((value) => {
    console.log(value);
    res.send(value);
  });
});

// delete post
imageRouter.get("/deletePost", authentication, (req, res) => {
  post.deleteOne({ user_Id: req.body.user_Id }, (err, val) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      if (val.deletedCount == 0) {
        console.log("there is no post for deletion");
        res.send("there is no post for deletion");
      } else {
        console.log("post is deleted");
        res.send("post is deleted");
      }
    }
  });
});

//Updation in the post
imageRouter.put("/updatePost", authentication, async (req, res) => {
  post
    .findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          user_Id: req.body.user_id,
        },
      }
    )
    .then((value) => {
      try {
        console.log(value);
        res.send(value);
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    });
});

module.exports = imageRouter;
