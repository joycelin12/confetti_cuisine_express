"use strict";

const chai = require("chai"), //require expect function
	{expect} = chai,
	usersController = require("../controllers/usersController"),	
	chaiHTTP = require("chai-http"),
        app = require("../main");

chai.use(chaiHTTP);


describe("usersController", () => {  //define the focus of your test in a describe block

	//describe your test block for users index action
	describe("/users GET", () => {
          it("it should GET all the users", (done) => {
           chai.request(app) //make a get request to test server
	   .get("/users")
	   .end((errors, res) => {
               expect(res).to.have.status(200); //expect application response to be 200
		   expect(errors).to.be.equal(null);
		   done(); //call done to complete server interaction in your test
	   });
          });
        });

	describe("getUserParams", () => {
                   it("should convert request body to contain the name attributes of user object", 
		    () => {
                       var body = {
                         first: "Jon",
			 last:"Wexler",
			 email: "jon@jonwexler.com",
			 password: 12345,
			 zipCode: 10016
		       }; //provide sample input data
			    expect(usersController.getUserParams(body))
			    .to.deep.include({
                                  name: {
                                     first:"Jon",
				     last: "Wexler"
				  }
			    }); //expect some object to be included in the results
		    });
		      it("should return an empty object with empty request body input", () =>{
                                     var emptyBody ={};
			             expect(usersController.getUserParams(emptyBody))
			              .to.deep.include({});
		      });
	});

});
