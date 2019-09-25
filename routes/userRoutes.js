"use strict";

const 	router  = require("express").Router(),  //add router object
 usersController = require("../controllers/usersController.js"); //require usersController

	
      
router.get("/", usersController.index, usersController.indexView);	// create index route

router.get("/new", usersController.new);
router.post("/create", usersController.validate, usersController.create, usersController.redirectView); //add validate middleware to users create route
//login route
router.get("/login", usersController.login); //add route to handle get requests made to /users/login path
router.post("/login", usersController.authenticate); //add route to handle post request to same path
//log out
router.get("/logout", usersController.logout, usersController.redirectView);

//adding edit and update routes
router.get("/:id/edit", usersController.edit); //add routes to handle viewing
router.put("/:id/update", usersController.update, usersController.redirectView); //process data from edit form, and display user show page.

router.get("/:id", usersController.show, usersController.showView);

//deleting user
router.delete("/:id/delete", usersController.delete, usersController.redirectView); 

module.exports = router; //export module router
