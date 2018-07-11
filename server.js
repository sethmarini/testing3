// Dependecies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Set up a default port, configure mongoose, configure our middleware/bodyParser
const PORT = process.env.PORT || 3001;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve up static assets if in production (running on Heroku)/use this to deploy to heroku
if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
} else {
  app.use(express.static(__dirname + "public"));
}

// enable CORS, use:
// https://enable-cors.org/server_expressjs.html/this is used to run the two seperate instances on different ports
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next();
});

// Routing/ api
var leadController = require("./server/leadController");
var router = new express.Router();
// Get saved leads
router.get("/api/lead", leadController.find);
// Save leads
router.post("/api/lead", leadController.insert);
// delete saved leads
router.delete("/api/lead:id", leadController.delete);
// Send every other request to the React app
router.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/public/index.html"))
});
// this is to use the router
app.use(router);

// Connect mongoose to our database
const db = process.env.MONGODB_URI || "mongodb://localhost/lead-nynja";
mongoose.connect(db, function(error) {
  // Log any errors connecting with mongoose
  if (error) {
    console.error(error);
  }
  // Or log a success message
  else {
    console.log("mongoose connection is successful");
  }
});

// Start the server
app.listen(PORT, function() {
    console.log(`Server now on port ${PORT}!`);
  });
