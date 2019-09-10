"use strict";

const express = require("express"), //require express
	app = express(), //instantiate
	homeController = require("./controllers/homeController"),
	errorController = require("./controllers/errorController"),
	layouts = require("express-ejs-layouts"); //require express-ejs-layouts module


app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs"); //set application to use ejs
app.use(layouts); // set application to use layout module


app.use(
   express.urlencoded({  //tell express.js app to use body parser for processing
      extended:false     //URL-encoded and json parameters
   })
);

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => { // create a route for homepage

   res.render("index");

});

app.get("/courses", homeController.showCourses);
app.get("/contact", homeController.showSignup);
app.get("/contact", homeController.postedSignUpForm); //add routes for courses page, contact page, and contact form submission

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError); //add error handlers as middleware functions.



app.listen(app.get("port"), () => {

   console.log(`Server running at http://localhost:${app.get("port")}`); //set up application up to listen on port 3000
});

