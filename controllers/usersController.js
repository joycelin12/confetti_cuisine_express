"use strict";

const User = require("../models/user"), //require user model
	passport = require("passport"),
	getUserParams = body => {
		return  {
		name: {
			first: body.first,
			last: body.last
			},
		email: body.email,
	        password: body.password,
	        zipCode: body.zipCode		
		};
	};

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
           
           if (req.skip) next();

	   let newUser = new User(getUserParams(req.body));

		User.register(newUser, req.body.password, (error, user) => {
                  if(user) {
                    req.flash("success", `${user.fullName}'s account created successfully!`);
			  res.locals.redirect ="/users";
			  next();
		  } else {
                    req.flash("error", `Failed to create user account because: ${error.message}.`);
			  res.locals.redirect = "/users/new";
			  next();
		  }
   
		});
           /*let userParams = { //add create action to save user to database
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
		});*/
		
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
	}, 
	login: (req, res) => {

            res.render("users/login");
	},

	authenticate: passport.authenticate("local",  {
           
		failureRedirect: "/users/login",
		failureFlash: "Failed to login.",
		successRedirect: "/",
		successFlash: "Logged in!"
	}),

	logout: (req, res, next) => { //add an action to log users out
             req.logout();
		req.flash("success", "You have been logged out!");
		res.locals.redirect ="/";
		next();
	},

          /* User.findOne({ //query for one user by email
                email: req.body.email
	   })
		.then(user => {

                   if(user) { //check whether user is found
                        
		       user.passwordComparison(req.body.password) //call the password comparison method on user model
			   .then(passwordsMatch => {
				   if(passwordsMatch) {

                                        res.locals.redirect = `/users/${user._id}`;
					req.flash("success", `${user.fullName}'s logged in successfully!`);
                                        res.locals.user = user;
				   } else {
					req.flash("error", "Failed to log in user account: Incorrect password.");
					   res.locals.redirect = "/users/login";
				   }
                       		       next();	   //call the next middleware function with redirect path and flash message set
		     });		   
		   } else {

                       req.flash("error", "Failed to log in user account: User account not found.!");
		       res.locals.redirect ="/users/login";
		       next();	   
		   }
		})
		   .catch(error => { //log errors to console and pass to next middleware error handler

                      console.log(`Error logging in user: ${error.message}`);
			   next(error);
		   }); 	}, */
		   
	validate: (req, res, next) => { //add the validate function
		req.sanitizeBody("email").normalizeEmail({
			all_lowercase: true
		}).trim(); //remove whitespace with the trim method

		req.check("email", "Email is invalid").isEmail();
		req.check("zipCode", "Zip code is invalid")
			.notEmpty().isInt().isLength({
				min: 5,
				max: 5
			}).equals(req.body.zipCode); //validate the zipCode field
		req.check("password", "Password cannot be empty").notEmpty(); //validate the password field

		req.getValidationResult().then(error => { //collect the results of previous validations

			if(!error.isEmpty()) {
				let messages = error.array().map(e =>e.msg); 
				req.skip = true;// set skip property to true
				req.flash("error", messages.join(" and ")); //add error messages as flash messages
				res.locals.redirect = "/users/new"; // set redirect path for the new view
				next();

			} else {
				next(); //call the next middleware function;
			}
			
		});
	}
   
};
