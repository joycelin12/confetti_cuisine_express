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
