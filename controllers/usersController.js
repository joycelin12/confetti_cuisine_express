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
            res.render("users/index", {
		    flashMessages: {
		    	success: "Loaded all users!"
		    }
	     }); //render view in separate action

	},
	new: (req, res) => {
          res.render("users/new"); //add new action to render form
	},
	create: (req, res, next) => {

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
	            req.flash("success", `${user.fullName}'s account created successfully!`); //respond with success flash message		
                    res.locals.redirect = "/users";
		    res.locals.user = user;
		    next();	
		})
		.catch(error => {

                   console.log(`Error saving user: ${error.message}`);
		   res.locals.redirect = "/users/new";
		   req.flash(
                      "error",
		      `Failed to create user account because: ${error.message}.`
		   );
			next();
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
	},
	edit: (req, res, next) => { //add the edit action
             let userId = req.params.id;
		User.findById(userId) //use findById to locate a user in the database by their ID
		    .then(user => {
			    res.render("users/edit", {
				user:user
			    });	//render user edit page for a specific user in the database
		    	})
		    .catch(error => {
			console.log(`Error fetching user by ID:  ${error.message}`);
			    next(error);
		    });
	},
	update: (req, res, next) => { // add update action
		let userId = req.params.id,
		userParams = {
			name : {
				first: req.body.first,
				last: req.body.last
			},
			email: req.body.email,
			password: req.body.password,
			zipCode: req.body.zipCode
		}; // Collect user parameters from request.

		User.findByIdAndUpdate(userId, {
			$set: userParams	
		}) //use findbyidandupdate to locate a user by id and update the document record in one command

		    .then(user => {
		       res.locals.redirect =`/users/${userId}`;
		       res.locals.user = user;
		       next();	    
		    })
		    .catch(error => {
                      console.log(`Error updating user by ID: ${error.message}`);
		      next(error);	    
		    });
	},
	delete: (req, res, next) => {

          let userId = req.params.id;
	  User.findByIdAndRemove(userId)
		.then(() =>{
                  res.locals.redirect ="/users"; //deleting a user with findbyidandremove method
		  next();	

		})
		.catch(error => {
                   console.log(`Error deleting user by ID: ${error.message}`);
			next();
		
	        });
	}	
   
};
