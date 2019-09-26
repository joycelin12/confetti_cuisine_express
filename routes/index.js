"use strict";

const router = require("express").Router(), //require express.js router
	userRoutes = require("./userRoutes"), //require all route modules within same directory
        subscriberRoutes = require("./subscriberRoutes"),
	courseRoutes = require("./courseRoutes"), 
	apiRoutes = require("./apiRoutes"),
	errorRoutes = require("./errorRoutes"), //require all route modules within same directory
	homeRoutes = require("./homeRoutes"); //require all route modules within same directory

router.use("/users", userRoutes); //use routes from relative route modules with namespaces
router.use("/subscribers", subscriberRoutes);
router.use("/courses", courseRoutes);
router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router; //explore router from index.js


