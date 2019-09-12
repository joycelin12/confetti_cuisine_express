"use strict";

const mongoose = require("mongoose"),
	Subscriber = require("./models/subscriber");

      mongoose.connect(
      "mongodb://localhost:27017/recipe_db",  //set up connection to database
      {useNewUrlParser: true}

      );

      mongoose.connection;

      var contacts = [
          {
            name: "Jon Wexler",
	    email: "jon@jonwexler.com",
            zipcode: 10016		  
	  },
	  {
            name: "Chef Eggplant",
	    email: "eggplant@jonwexler.com",
            zipcode: 20331		  
	  },
	   {
            name: "Souffle",
	    email: "souffle@jonwexler.com",
            zipcode: 19103		  
	  }
      ];

      Subscriber.deleteMany()
                .exec()    //remove all exisiting data
                .then(() => {
                 console.log("Subscriber data is empty!");
		});
      
var commands =[];

      contacts.forEach((c) => {  //loop through subscriber objects to create promises
	commands.push(Subscriber.create({

		namee: c.name,
		email: c.email
	}));	
      });
      
      Promise.all(commands) //log confirmation after promises resolve
              .then (r =>{

		console.log(JSON.stringify(r));
		      mongoose.connection.close();
	      })
	      .catch(error => {

		console.log(`ERROR: ${error}`);
	      });
      
