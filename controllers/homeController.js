"use strict";


var courses = [
  {
    title: "Event Driven Cakes",
    cost: 50
  },
  {
    title: "Asynchronous Artichoke",
    cost: 25
  },
  {
    title: "Object Oriented Orange Juice",
    cost: 10
  }
];


module.exports = {  //export object literal with all controller actions
	showCourses: (req, res) => {
           res.render("courses", {
             offeredCourses: courses
	   });
	},
	index: (req, res) => {
          res.render("index");
        },
	getSubscriptionPage: (req, res) => {
   		 res.render("contact");
	 },
	chat: (req, res) => {
		res.render("chat");
	}




};

exports.showSignup = (req, res) => {
      res.render("contact");
};

exports.postedSignUpForm = (req, res) => {
    res.render("thanks");
}; 
