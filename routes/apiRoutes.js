"use strict";

const router = require("express").Router(),
	User = require("../models/user"),
	usersController = require("../controllers/usersController"), //require uses controller
	coursesController = require("../controllers/coursesController"); //require courses controller

router.post("/login", usersController.apiAuthenticate);
router.use(usersController.verifyJWT);
router.use(usersController.verifyToken);
router.get("/courses/:id/join", coursesController.join, coursesController.respondJSON);
router.get("/courses", coursesController.index, coursesController.filterUserCourses, coursesController.respondJSON); //add api route to express js router
router.use(coursesController.errorJSON); //add api error handling middleware

module.exports = router;


