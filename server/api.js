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
    return res.send({});
  }

  res.send(req.user);
});

router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  res.send({});
});

async function getOuterLevelKeys(collection) {
  const pipeline = [
    { $project: { document: { $objectToArray: "$$ROOT" } } },
    { $unwind: "$document" },
    { $group: { _id: null, keys: { $addToSet: "$document.k" } } },
    { $project: { _id: 0, keys: 1 } },
  ];

  const results = await collection.aggregate(pipeline).limit(1).toArray();
  return results.length > 0 ? results[0].keys : [];
}

router.get("/submodules", (req, res) => {
  const db = mongoose.connection.db;
  const collection = db.collection(req.query.module);

  // Process the collection here
  getOuterLevelKeys(collection).then((keys) => {
    res.send(keys);
    console.log("Outer-level keys:", keys);
  });
});

async function getFilteredData(collection, keys) {
  // Create a projection object
  const projection = {};
  for (const key of keys) {
    projection[key] = 1;
  }

  // Find the first document with the specified keys
  const result = await collection.findOne({}, { projection });
  delete result._id;
  return result;
}

router.get("/data", (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection(req.query.module);
    console.log(req.query.module);
    console.log(req.query.submodules);
    console.log(req.query.backends);
    console.log(req.query.frontends);

    const keys = [];
    if (req.query.submodules) {
      submodules = req.query.submodules.map((submodule) => submodule.value);
      backends = req.query.backends.map((backend) => {
        var str = backend.value;
        const slashIndex = str.indexOf("/");
        var backend_name = str.substring(0, slashIndex);
        if (req.query.module !== "array_api") backend_name += "\n";
        let backend_version = str.substring(slashIndex + 1);
        backend_version = backend_version.replace(/\./g, "_");
        return backend_name + "." + backend_version;
      });
      if (req.query.frontends) {
        frontends = req.query.frontends.map((frontend) => {
          let str = frontend.value;
          const slashIndex = str.indexOf("/");
          let frontend_version = str.substring(slashIndex + 1);
          return frontend_version.replace(/\./g, "_");
        });
        submodules.forEach((submodule) => {
          backends.forEach((backend) => {
            frontends.forEach((frontend) => {
              const key = submodule + "." + backend + "." + frontend;
              keys.push(key);
            });
          });
        });
      } else {
        submodules.forEach((submodule) => {
          backends.forEach((backend) => {
            const key = submodule + "." + backend;
            keys.push(key);
          });
        });
      }
    }
    console.log(keys);

    // Fetch the filtered data
    getFilteredData(collection, keys).then((filteredData) => {
      console.log(filteredData);
      res.send(filteredData);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data");
  }
});

router.get("/test", async (req, res) => {
  try {
    const module = req.query.module;
    const submodule = req.query.submodule;
    const backend = req.query.backend;
    const test = req.query.test;

    const db = mongoose.connection.db;
    const collection = db.collection(module);
    let key = "";
    if (
      module == "jax" ||
      module == "numpy" ||
      module == "torch" ||
      module == "tensorflow" ||
      module == "paddle"
    ) {
      key = submodule + "." + backend + "\n.latest-stable.latest-stable." + test;
    } else {
      key = submodule + "." + backend + "\n.latest-stable." + test;
    }
    const keys = [key];
    const filteredData = await getFilteredData(collection, keys);
    const result_badge =
      key.split(".").reduce((acc, k) => acc && acc[k], filteredData) ?? undefined;
    const test_result = result_badge ? result_badge.includes("success") : true;
    res.send(test_result);
  } catch (error) {
    console.error(`Error in /test endpoint: ${error}`);
    res.status(500).send({ error: "An error occurred while processing your request." });
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
