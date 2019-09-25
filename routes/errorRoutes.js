"use strict";

const router = require("express").Router(),	
     errorController = require("../controllers/errorController");

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError); //add error handlers as middleware functions.

module.exports = router;


	
