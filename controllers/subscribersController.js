"use strict";

const Subscriber = require("../models/subscriber"); //require subscriber module 

exports.getAllSubscribers = (req, res, next) => {  //export getAllSubscribers to pass data from database to next middleware function
  Subscriber.find({}, (error, subscribers) => {

           if(error) next(error); //pass an error next middleware function 
	   req.data = subscribers; //set data that comes back from MongoDB on request object
	   next(); //continue to the next middleware 
  });
};




