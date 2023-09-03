/*
|--------------------------------------------------------------------------
| server.js -- The core of your server
|--------------------------------------------------------------------------
|
| This file defines how your server starts up. Think of it as the main() of your server.
| At a high level, this file does the following things:
| - Connect to the database
| - Sets up server middleware (i.e. addons that enable things like json parsing, user login)
| - Hooks up all the backend routes specified in api.js
| - Fowards frontend routes that should be handled by the React router
| - Sets up error handling in case something goes wrong when handling a request
| - Actually starts the webserver
*/

// validator runs some basic checks to make sure you've set everything up correctly
// this is a tool provided by staff, so you don't need to worry about it
const validator = require("./validator");
validator.checkSetup();
const axios = require("axios");
//import libraries needed for the webserver to work!
const http = require("http");
const bodyParser = require("body-parser"); // allow node to automatically parse POST body requests as JSON
const express = require("express"); // backend framework for our node server.
const session = require("express-session"); // library that stores info about each connected user
const mongoose = require("mongoose"); // library to connect to MongoDB
const path = require("path"); // provide utilities for working with file and directory paths
require("dotenv").config();
let cache = require("./cache");
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const api = require("./api");
const auth = require("./auth");
const priority = require("./priority");

// socket stuff
const socket = require("./server-socket");

// Server configuration below
const mongoConnectionURL = process.env.ATLAS_SRV;
const databaseName = "Ivy_tests_multi_gpu";
const priorityDBName = "Ivy_tests_priority";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "unifyai";
const REPO_NAME = "ivy";
const FIXED_LABEL = "ToDo";
const LABEL_MAP = {
  jax: "JAX Frontend",
  torch: "PyTorch Frontend",
  tensorflow: "TensorFlow Frontend",
  numpy: "NumPy Frontend",
  paddle: "Paddle Frontend",
  stateful: "Ivy Stateful API",
};

const countTasksNotCompleted = (body) => {
  const matches = body.match(/^\s*- \[ \]/gm);
  return matches ? matches.length : 0;
};

const fetchIssues = async (inputLabel) => {
  try {
    const labelsToFetch = [FIXED_LABEL, inputLabel];
    const response = await axios.get(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          labels: labelsToFetch.join(),
          state: "open",
        },
      }
    );

    const issues = response.data;
    let total = 0;
    issues.forEach((issue) => {
      const count = countTasksNotCompleted(issue.body);
      total += count;
      // console.log(`Title: ${issue.title}, URL: ${issue.html_url}, Uncompleted Tasks: ${count}`);
    });
    return total;
  } catch (error) {
    console.error("Error fetching issues:", error.response ? error.response.data : error.message);
  }
};

async function fetchData() {
  const db = mongoose.connection.db;
  console.log("Retrieving Data for all Modules");

  let collections = await db.listCollections().toArray();
  // collections = collections.slice(0, 2);

  let allData = [];
  let notImplementedCount = {};
  for (let collectionInfo of collections) {
    const collection = db.collection(collectionInfo.name);
    const data = await collection.findOne({});
    delete data._id;
    console.log("Retrieved Data for", collectionInfo.name);
    allData.push({ module: collectionInfo.name, dashboard: data });
    console.log(collectionInfo.name);
    if (collectionInfo.name in LABEL_MAP) {
      numIssues = await fetchIssues(LABEL_MAP[collectionInfo.name]);
      notImplementedCount[collectionInfo.name] = numIssues;
    }
  }
  console.log("Not Implemented Count", notImplementedCount);
  return { dashboard: allData, notImplementedCount: notImplementedCount };
}

// connect to mongodb
connectdb = async () => {
  mongoose
    .connect(mongoConnectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: databaseName,
    })
    .then(() => {
      console.log("Connected to MongoDB");
      fetchData().then((data) => {
        cache.setCache(data);
      });
    })
    .catch((err) => {
      console.log("Unable To Connect");
      connectdb();
    });
};
connectdb();
let priority_connection_;

connectPriority = async () => {
  try {
    priority_connection_ = await mongoose.createConnection(mongoConnectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: priorityDBName,
    });
    console.log(priority.getConnection());
    priority.setConnection(priority_connection_);
    console.log(priority.getConnection());
    console.log("Connected to Priority DB");
  } catch (err) {
    console.log("Unable to Connect:", err);
    connectPriority();
  }
};
connectPriority();

// Fetch new data every hour.
setInterval(() => {
  fetchData()
    .then((data) => {
      cache.setCache(data);
    })
    .catch((err) => {
      console.error(err);
    });
}, CACHE_DURATION);

// create a new express server
const app = express();

app.get("*.js", function (req, res, next) {
  req.url = req.url + ".gz";
  res.set("Content-Encoding", "gzip");
  res.set("Content-Type", "application/javascript");
  next();
});

app.get("*.css", function (req, res, next) {
  req.url = req.url + ".gz";
  res.set("Content-Encoding", "gzip");
  res.set("Content-Type", "text/css");
  next();
});

// app.use(compression());
app.use(validator.checkRoutes);

// set up bodyParser, which allows us to process POST requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set up a session, which will persist login data across requests
app.use(
  session({
    secret: "session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// this checks if the user is logged in, and populates "req.user"
app.use(auth.populateCurrentUser);

// connect user-defined routes
app.use("/api", api);

// load the compiled react files, which will serve /index.html and /bundle.js
const reactPath = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(reactPath));

// for all other routes, render index.html and let react router handle it
app.get("*", (req, res) => {
  res.sendFile(path.join(reactPath, "index.html"));
});

// any server errors cause this function to run
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) {
    // 500 means Internal Server Error
    console.log("The server errored when processing a request!");
    console.log(err);
  }

  res.status(status);
  res.send({
    status: status,
    message: err.message,
  });
});

// hardcode port to 3000 for now
const port = process.env.PORT || 3000;
const server = http.Server(app);
socket.init(server);

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
