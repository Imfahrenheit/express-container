// Require libraries (edit as required)
var createError = require("http-errors");
var express = require("express");
var path = require("path");
const MongoClient = require("mongodb").MongoClient;
var db;
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// Include external files (edit as required)
var indexRouter = require("./routes/index");

// Start the app itself - default
var app = express();

const client = new MongoClient(process.env.MONGODB_URL, {
  useNewUrlParser: true
});
// view engine setup  - default
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Use logging and set settings - default
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Initial set of users to populate the database with

// Connect to database and insert default users into users collection
client.connect((err) => {
  var dbUsers = [];
  console.log("Connected successfully to database");

  db = client.db(process.env.DB_NAME);

  // Removes any existing entries in the users collection
  /** db.collection("users").deleteMany(
    { name: { $exists: true } },
    function (err, r) {
      for (var i = 0; i < users.length; i++) {
        // loop through all default users
        dbUsers.push({ name: users[i] });
      }
      // add them to users collection
      db.collection("users").insertMany(dbUsers, function (err, r) {
        console.log("Inserted initial users");
      });
    }
  );'*/
});

// Define routes (edit as required)

let initialState = {
  type: "board",
  currentPlayer: "x",
  winner: false,
  player: {
    x: [],
    o: []
  },
  color: {
    x: "rgb(124, 252, 0)",
    o: "rgb(250, 128, 114)"
  },
  playerName: {
    x: "rgb(124, 252, 0)", // colorDiv(this.color.x),
    o: "rgb(250, 128, 114)" // colorDiv(this.color.o),
  },
  point: {
    x: 0,
    o: 0
  },
  boardSize: 5,
  toWin: 5
};

app.use("/", indexRouter);

app.get("/state", (req, res) => {
  db.collection("state")
    .findOne()
    .then((userState) => {
      if (userState) res.json(userState);
      else {
        res.json(initialState);
      }
    })
    .catch(/* ... */);
});

app.put("/state", (req, res) => {
  console.log(req.body);
  db.collection("state").replaceOne({ type: "board" }, req.body, function (
    err,
    r
  ) {
    console.log("Inserted initial state");
  });
  res.json("Success");
});

// Catch 404 and forward to error handler - default
app.use(function (req, res, next) {
  next(createError(404));
});

// Register error handler - default
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Export app to use with www.js - default
module.exports = app;
