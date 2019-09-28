"use strict";

const express = require("express"), //require express
	app = express(), //instantiate
//	homeController = require("./controllers/homeController"),
//	errorController = require("./controllers/errorController"),
        router  = require("./routes/index.js"),  //add router object
	layouts = require("express-ejs-layouts"), //require express-ejs-layouts module	
	expressValidator = require("express-validator"),
 	expressSession = require("express-session"), //require the 3 modules
        cookieParser = require("cookie-parser"),
	connectFlash = require("connect-flash"),
        mongoose = require("mongoose"), // require mongoose
	Subscriber = require("./models/subscriber"),
     //   subscribersController = require("./controllers/subscribersController.js"),
      //  coursesController = require("./controllers/coursesController.js"), //require coursesController
	passport = require("passport"),
	passportLocalMongoose = require("passport-local-mongoose");


        mongoose.Promise = global.Promise; //using promise with Mongoose

   
   
        mongoose.connect(

         "mongodb://localhost:27017/recipe_db", //set up connection to db
		{useNewUrlParser: true}
	);

        mongoose.set("useCreateIndex", true);




        const  db = mongoose.connection; //assign db variable    
        db.once("open", () => {
           console.log("Successfully connected to MongoDB using Mongoose!");

             });
 
           /*

         var myQuery = Subscriber.findOne({
            name: "Jon Wexler"
	 }).where("email", /wexler/);
         myQuery.exec((error, data) => {

                 if (data) console.log(data.name); //runs a query with a callback function to handle errors and data

	 });

        
      
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
app.set("token", process.env.TOKEN || "recipeT0k3n");

app.use(express.static("public"));
app.use(layouts); // set application to use layout module

app.use(
   express.urlencoded({  //tell express.js app to use body parser for processing
      extended:false     //URL-encoded and json parameters
   })
);

//adding method override to put in the put request 
const methodOverride = require("method-override"); //require the method override module
app.use(methodOverride("_method", {
	methods: ["POST", "GET"]
})); //configure the application router to use methodOverride as middleware.


app.use(express.json());
//configure your express.js application to use cookie-parse
app.use(cookieParser("secret_passcode"));
app.use(expressSession({
	secret: "secret_passcode",
	cookie: {
		maxAge: 4000000
	},
	resave: false,
	saveUninitialized: false
})); //configure express-session to use cookie-parse

//app.get("/", (req, res) => { // create a route for homepage

  // res.render("index");

//});

/*router.get("/subscribers", subscribersController.getAllSubscribers, (req, res, next) => {  //pass reqyest to getAllSubscribers function.

              console.log(req.data);  //log data from request object
		// res.send(req.data); //render data on browser window
		 res.render("subscribers", {subscribers:req.data}); //render a view subscribers and pass from db to view
	 });*/

//initialze passport and configure passport to use sessions in express.js
app.use(passport.initialize());
app.use(passport.session());

const User = require("./models/user"); // require user model
passport.use(User.createStrategy());//configure user login strategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); //set up passport to serialize and deserialize user data

app.use(connectFlash()); //configure app to use connect-flash as middleware




//adding local variables to custom middleware
app.use((req, res, next) => {
        res.locals.loggedIn = req.isAuthenticated(); //set up logged in variable to reflect passport login status
	res.locals.currentUser = req.user; //set up cuurent user to reflect logged in user
	res.locals.flashMessages = req.flash(); //assign flash messages to the local flashMessages variable on the response object
	
	next();
});

//add validation
app.use(expressValidator());


app.use("/", router);
      

//router.get("/", homeController.index);
//app.get("/contact", homeController.showSignup);
//app.get("/contact", homeController.postedSignUpForm); //add routes for courses page, contact page, and contact form submission

//router.get("/contact", homeController.getSubscriptionPage); //add get route for subscription page
//router.post("/subscribe", subscribersController.saveSubscriber); //add post route to handle subscription data

const server = app.listen(app.get("port"), () => {

   console.log(`Server running at http://localhost:${app.get("port")}`); //set up application up to listen on port 3000
}), //save server instance to server
	io = require("socket.io")(server) ,// pass server instance to socket.io
       chatController = require("./controllers/chatController")(io);
