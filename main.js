"use strict";

const express = require("express"), //require express
	app = express(), //instantiate
	homeController = require("./controllers/homeController"),
	errorController = require("./controllers/errorController"),
	layouts = require("express-ejs-layouts"), //require express-ejs-layouts module
	router  = express.Router(),  //add router object
	mongoose = require("mongoose"); // require mongoose
        mongoose.Promise = global.Promise; //using promise with Mongoose
   
               mongoose.connect(

         "mongodb://localhost:27017/recipe_db", //set up connection to db
		{useNewUrlParser: true}
	);
        const  db = mongoose.connection; //assign db variable    
        db.once("open", () => {
           console.log("Successfully connected to MongoDB using Mongoose!");

             });
 
        const Subscriber = require("./models/subscriber");
        const subscribersController = require("./controllers/subscribersController.js");
        const usersController = require("./controllers/usersController.js"); //require usersController

         var myQuery = Subscriber.findOne({
            name: "Jon Wexler"
	 }).where("email", /wexler/);
         myQuery.exec((error, data) => {

                 if (data) console.log(data.name); //runs a query with a callback function to handle errors and data

	 });

        
      /*
       const subscriberSchema = mongoose.Schema({ //create a new schema with mongoose.schema

          name: String, //add schema properties
	  email:String,
	  zipCode : Number      
       });

        const Subscriber= mongoose.model("Subscriber", subscriberSchema);
     

       var subscriber1 = new Subscriber({
		name: "Jon Wexler",
	       email:"jon@jonwexler.com"
       }); //instantiate a new subscriber

       subscriber1.save((error, savedDocument) => { // save a subscriber to db

           if (error) console.log(error); //pass potential errors to next middle ware function
	       console.log(savedDocument);  //log saved document
       });

      Subscriber.create({

		name: "Jon Wexler",
	        email: "jon@jonwexler.com"
      },

        function (error, savedDocument) {//create and save a subscriber in a single step
           if (error) console.log(error);
	   console.log(savedDocument);	
	}
      ); */
        
  
	/* MongoDB = require("mongodb").MongoClient, //require mongodb module
	dbURL = "mongodb://localhost:27017",
	dbName= "recipe_db";

MongoDB.connect(dbURL, (error, client) => { //set up a connection to your local database server
	if (error) throw error;

	let db = client.db(dbName); //get the recipe_db database from connection to mongoDB server
	db.collection("contacts")
	  .find()
	  .toArray((error, data) => { //find all records in contacts collection 

             if (error) throw error;
		  console.log(data); // print results to console
	  });


	db.collection("contacts")
  .insert({

    name: "Freddie Mercury",  //inser new item into db
    email: "fred@queen.com"	  
  }, (error, db) => {
    if(error) throw error;
	  console.log(db); //log resulting errors or save item

  });


    
}); */



app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs"); //set application to use ejs
app.use("/", router);
      
router.use(layouts); // set application to use layout module


router.use(
   express.urlencoded({  //tell express.js app to use body parser for processing
      extended:false     //URL-encoded and json parameters
   })
);

router.use(express.json());
router.use(express.static("public"));
router.get("/", homeController.index);

//app.get("/", (req, res) => { // create a route for homepage

  // res.render("index");

//});

//adding method override to put in the put request 
const methodOverride = require("method-override"); //require the method override module
router.use(methodOverride("_method", {
	methods: ["POST", "GET"]
})); //configure the application router to use methodOverride as middleware.


router.get("/subscribers", subscribersController.getAllSubscribers, (req, res, next) => {  //pass reqyest to getAllSubscribers function.

              console.log(req.data);  //log data from request object
		// res.send(req.data); //render data on browser window
		 res.render("subscribers", {subscribers:req.data}); //render a view subscribers and pass from db to view
	 });


router.get("/courses", homeController.showCourses);
//app.get("/contact", homeController.showSignup);
//app.get("/contact", homeController.postedSignUpForm); //add routes for courses page, contact page, and contact form submission

router.get("/contact", subscribersController.getSubscriptionPage); //add get route for subscription page
router.post("/subscribe", subscribersController.saveSubscriber); //add post route to handle subscription data
router.get("/users", usersController.index, usersController.indexView);	// create index route

router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);

//adding edit and update routes
router.get("/users/:id/edit", usersController.edit); //add routes to handle viewing
router.put("/users/:id/update", usersController.update, usersController.redirectView); //process data from edit form, and display user show page.

//deleting user
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView); 

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError); //add error handlers as middleware functions.



app.listen(app.get("port"), () => {

   console.log(`Server running at http://localhost:${app.get("port")}`); //set up application up to listen on port 3000
});

