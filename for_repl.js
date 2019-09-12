"use strict";

const mongoose=require("mongoose"),
	Subscriber = require("./models/subscriber"); //assign subscriber model model to a variable, using model name and local project filr
      mongoose.connect(    //set up database connection using recipe db

         "mongodb://localhost:27017/recipe_db",
	      {useNewUrlParser: true}
      );

      mongoose.Promise = global.Promise; // tell mongoose to se native promise as you did in main.js



Subscriber.create({
    name: "jon",
	email: "jon@wexler.com",
	zipCode: "12345"
})
   .then(subscriber => console.log(subscriber))
   .catch(error => console.log(error.message));

var subscriber; //set up variable to hold query results
Subscriber.findOne({
    name:"jon"
}).then(result => {

     subscriber = result;  //search for document u created
	console.log(subscriber.getInfo()); //log subscriber record
});

//17.7 testing model associations using REPL in terminal

const Course = require("./models/course"); //require course model
  var testCourse, testSubscriber; //set up two variables outside the promise  chain
   Course.create({

	title: "Tomato Land",
        description: "Locally farmed tomatoes only",
	zipCode: 12345,
	items: ["cherry", "heirloom"]   
   }).then(course => testCourse = course); //create a new course instance
   
     Subscriber.findOne({}). then(
	subscriber => testSubscriber = subscriber //find a subscriber
     );

     testSubscriber.courses.push(testCourse); //push the testCourse course into the courses array of testSubscriber
     testSubscriber.save(); // save the model instance again
     Subscriber.populate(testSubscriber, "courses").then(subscriber => //use populate on model.
	console.log(subscriber)
     );
     
