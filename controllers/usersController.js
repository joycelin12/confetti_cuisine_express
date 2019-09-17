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

	},
	new: (req, res) => {
          res.render("users/new"); //add new action to render form
	},
	create: (req, res) => {

           let userParams = { //add create action to save user to database
		   name: {
                      first: req.body.first,
		      last: req.body.last
		   },
		   email: req.body.email,
		   password: req.body.password,
		   zipCode:req.body.zipCode
	   };
	   User.create(userParams)
		.then(user => {
                    res.locals.redirect = "/users";
		    res.locals.user = user;
		    next();	
		})
		.catch(error => {

                   console.log(`Error saving user: ${error.message}`);
			next(error);
		});
		
	},

	redirectView: (req, res, next) => {  //render view in separate redirectview action

             let redirectPath = res.locals.redirect;
	     if(redirectPath) res.redirect(redirectPath);
		else next();
	},

	show: (req, res, next) => {

           let userId = req.params.id; //collect the user ID from request params
		User.findById(userId) // find user by id
		    .then(user => {

                       res.locals.user = user; //pass user through the response object to next middleware function.
			    next();
		    })
		    .catch(error => {

                       console.log(`Error fetching user by ID: ${error.message}`);
			    next(error); //log and pass errors to next function
		    }); 
	},
	showView: (req, res) => {
            res.render("users/show"); //render show view
	}
	
};
