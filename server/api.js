/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/
const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const express = require("express");
const User = require("./models/user");
const Question = require("./models/question");
// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

const socket = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});

router.post("/answer", (req, res) => {
  Question.updateOne(
    { _id: ObjectID(req.body.qid) },
    { $set: { answer: req.body.answer } },
    function (e) {
      if (e) {
        console.log(e);
        return;
      }
      console.log("success");
    }
  );
});

router.get("/question", (req, res) => {
  Question.find({ author_id: req.query.parent }).then((comments) => {
    res.send(comments);
  });
});

router.post("/question", auth.ensureLoggedIn, (req, res) => {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  const newQuestion = new Question({
    author_id: req.user._id,
    content: req.body.content,
    answer: "",
  });

  newQuestion.save().then((question) => res.send(question));
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  res.send({});
});

router.get("/allQuest", (req, res) => {
  Question.find({}).then((comments) => {
    res.send(comments);
  });
});

router.get("/submodules", (req, res) => {
  const db = mongoose.connection.db;
  db.collection(req.query.module)
    .find()
    .toArray((err, result) => {
      res.send(result[0]);
    });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
