"use strict";

process.env.NODE_ENV = "test"; //require necessary modules and set environment as test

const User = require("../models/user"),
	{expect} = require("chai"); //assign a variable to chai.expect function


require("../main");

beforeEach(done => { //remove all users from the database before each test
      User.remove({})
	.then(() => {
          done();
	});
});

describe("SAVE user", () => { //describe a series of tests for saving users

   it("it should save one user", (done) => { //define a test for saving a single user
	   let testUser = new User({
                 name: {
                   first: "Jon",
	           last: "Wexler"		 
		 },
		   email: "Jon@jonwexler.com",
		   password:12345,
		   zipCode: 10016
	   }); //set up promise to save user with sample data and fetch all users from database after
 


	   testUser.save()
	            .then(() => {
                      User.find({})
			    .then(result => {
                                expect(result.length)
				    .to.eq(1);   //expect one user with id to exist in database
				expect(result[0])
				    .to.have.property("_id");
				    done(); // call done to complete the test with promises
			    });
		    });
      
   });
});
