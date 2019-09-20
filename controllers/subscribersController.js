"use strict";

const Subscriber = require("../models/subscriber"); //require subscriber module 

module.exports = {

	index: (req, res, next) =>{
	   Subscriber.find({})
		.then(subscribers => {
			res.locals.subscribers = subscribers;
			next();
		})
		.catch(error => {
			console.log(`Error fetching subscribers: ${error.message}`);
			next(error);
		});
	},

	indexView: (req, res) => {
		res.render("subscribers/index");
	},

	saveSubscriber: (req, res) => {
	 let newSubscriber = new Subscriber({

          name: req.body.name,
	  email: req.body.email,
	  zipCode: req.body.zipCode   
     	});
	newSubscriber
		.save()
		.then(result => {
			res.render("thanks");
		})
		.catch(error => {
		    if(error) res.send(error);
		});
	
	},
	new: (req, res) => {
           res.render("subscribers/new");
	},

	create: (req, res, next) => {
	 let subscriberParams = {
	   name: req.body.name,
           email: req.body.email,
           zipCode: req.body.zipCode		 
	 };
		Subscriber.create(subscriberParams)
		.then(subscriber => {
		 res.locals.redirect = "/subscribers";
		 res.locals.subscribers = subscriber;
		 next();
		})
		.catch(errors => {
		   console.log(`Error saving subscriber: ${error.message}`);
			next(error);
		});
	},

	show: (req, res, next) => {

		let subscriberId = req.params.id;
		Subscriber.findById(subscriberId)
		          .then(subscriber => {
				res.locals.subscriber = subscriber;
				  next();
			  })
			  .catch(error => {
				console.log(`Error fetching subscriber by ID: ${error.message}`);
				  next(error);
			  });
	},
	showView: (req, res) => {
		res.render("subscribers/show")
	},
		
	edit: (req, res, next) => {
		let subscriberId = req.params.id;
		Subscriber.findById(subscriberId)
		    .then(subscriber => {
			res.render("subscribers/edit", {
				subscriber: subscriber
			});
		    })
		    .catch(error =>{
			console.log(`Error fetching subscriber by ID :${error.message}`);
			    next(error);
		    })
	},

	update: (req, res, next) => {
		let subscriberId = req.params.id,
			subscriberParams = {
				name: req.body.name,
				email: req.body.email,
				zipCode: req.body.zipCode
			};
		Subscriber.findByIdAndUpdate(subscriberId, {
			$set: subscriberParams
		})
		         .then(subscriber => {
				res.locals.redirect = `/subscribers/${subscriberId}`;
				 res.locals.subscriber = subscriber;
				 next();
			 })
		         .catch(error => {

				console.log(`Error updating subscriber by ID: ${error.message}`);
				 next(error);
			 })
	},
	delete: (req,res, next) => {
		let subscriberId = req.params.id;
		Subscriber.findByIdAndRemove(subscriberId)
		          .then(() => {
				res.locals.redirect = "/subscribers";
				  next;
			  })
                          .catch(error => {
				console.log(`Error deleting subscriber by ID: ${error.message}`);
				  next();
			  });
        },

	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect;
		if (redirectPath !== undefined) res.redirect(redirectPath);
		else next();
	}
	
};

/*
exports.getAllSubscribers = (req, res, next) => {  //export getAllSubscribers to pass data from database to next middleware function
  Subscriber.find({}, (error, subscribers) => {

           if(error) next(error); //pass an error next middleware function 
	   req.data = subscribers; //set data that comes back from MongoDB on request object
	   next(); //continue to the next middleware 
  });
}; 

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

     newSubscriber.save((error, result) => {  //save a new subscriber
           if(error) res.send(error);
	     res.render("thanks");
     }); 

	newSubscriber.save()  //save a new subscriber with promise return
	.then(result => {
          res.render("thanks");
	})
	.catch(error => {

             if(error) res.send(error);
	})
};
*/





