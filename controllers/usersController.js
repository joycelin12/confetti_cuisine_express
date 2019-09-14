"use strict";

const User = require("../models/user"); //require user model

/*
module.exports = {

      index: (req, res) => {
        User.find({})
	      .then(users => {
                  res.render("users/index", { //render index page with an array of users 
                    users: users
		  })
	      })
	      .catch(error => { //log error messages and redirect to home page
                    console.log (`Error fetching users: ${error.message}`);
		    res.render("/");
	      });
      }
}; */


module.exports = {

      index: (req, res, next) => {  
        User.find()  //run query in index action only 
	     .then(users => {

                 res.locals.users = users; //store user data on response and call next middleware function
		     next();
	     })
	     .catch(error => {
                console.log(`Error fetching users: ${error.message}`);
		     next(error);  //catch errors, and pass to next middleware

	     });
      },
	indexView: (req, res) => {
            res.render("users/index"); //render view in separate action

	}
	
};
