"use strict";

const router = require("express").Router(),
	homeController = require("../controllers/homeController");

router.get("/chat", homeController.chat);
router.get("/", homeController.index);
router.get("/contact", homeController.getSubscriptionPage);

module.exports = router;
