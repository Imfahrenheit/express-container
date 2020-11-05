// Required libraries
var express = require("express");
var router = express.Router();

// Good validation documentation available at https://express-validator.github.io/docs/
const { sanitizeBody } = require("express-validator");

// Get posts listing
router.get("/", function(req, res, next) {
  //In here your would normally retrieve data from the database and manipulate it a bit
  const authors_and_posts = [
    { author: "jim", content: "hello there" },
    { author: "janette", content: "o hai" },
    { author: "tom", content: "greetings" }
  ];

  // Just send the array of objects to the browser
  res.render("posts", { title: "Post List", post_list: authors_and_posts });
});

// Sanitation middleware
// See https://express-validator.github.io/docs/sanitization-chain-api.html
// And https://express-validator.github.io/docs/filter-api.html
router.post(
  "/create",
  sanitizeBody("*")
    .trim()
    .escape(),
  function(req, res, next) {
    var content = req.body.content;
    var author = req.body.author;
    console.log("We got content: " + content);
    console.log("from author: " + author);

    res.redirect("/posts");
  }
);

module.exports = router;
