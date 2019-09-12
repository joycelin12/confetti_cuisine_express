"use strict";

const Subscriber = require("../models/subscriber"); //require subscriber module 

/*
exports.getAllSubscribers = (req, res, next) => {  //export getAllSubscribers to pass data from database to next middleware function
  Subscriber.find({}, (error, subscribers) => {

           if(error) next(error); //pass an error next middleware function 
	   req.data = subscribers; //set data that comes back from MongoDB on request object
	   next(); //continue to the next middleware 
  });
}; */

exports.getAllSubscribers = (req, res) => {  //rewrite
	Subscriber.find({})
	.exec()
	.then((subscribers)=> {
	
            res.render("subscribers", { //send saved data to next then code block
              subscribers:subscribers
	    }); //serve results from database

	})
	.catch((error) => {               //catch errors that are rejected in promise
            console.log(error.message);   
            return [];	
	})
	.then(() => {
         console.log("promise complete"); //end promise chain with log message
	});

};


exports.getSubscriptionPage = (req, res) => { //add an action to render contact page
   res.render("contact");
};

exports.saveSubscriber = (req,res) => {    //add an action to save subscribers
     let newSubscriber = new Subscriber({

          name: req.body.name,
	  email: req.body.email,
	  zipCode: req.body.zipCode   
     });

   /*  newSubscriber.save((error, result) => {  //save a new subscriber
           if(error) res.send(error);
	     res.render("thanks");
     }); */

	newSubscriber.save()  //save a new subscriber with promise return
	.then(result => {
          res.render("thanks");
	})
	.catch(error => {

             if(error) res.send(error);
	})
};




