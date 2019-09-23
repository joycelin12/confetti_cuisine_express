"use strict";

const Subscriber = require("./subscriber");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose"),
	 passportLocalMongoose = require("passport-local-mongoose"),
  
	{Schema} = mongoose,

	userSchema = new Schema({

             name:{
                  first: {
                       type : String,
		       trim : true
		  },
		  last: {
                        type: String,
			  trim: true
		     }  
	     },
		email: {

                   type : String,
                   required : true,
		   lowercase: true,
	           unique: true
		},
		zipCode: {
                    type: Number,
			min : [10000, "Zip code too short"],
			max  : 99999
		},
		password: {
                     type: String,
	              required: true		
		}, //add password property
		courses: [{ type: Schema.Types.ObjectId , ref : "Course"}],
		subscribedAccount: { type: Schema.Types.ObjectId , ref: "Subscriber"} // add subscriberAccount to connect users to subscribers
	        }, {
                timestamps: true// add timestamp to record createdAt and updatedAt dates
		});

userSchema.virtual("fullName")
          .get(function() {
             return `${this.name.first} ${this.name.last}`;

	  });

userSchema.pre("save", function(next) { //set up the pre ('save') hook

	let user = this;  //use function keyword in call back
	if(user.subscribedAccount === undefined) {
   Subscriber.findOne({
              email: user.email
   })         //query for single subscriber
	     .then(subscriber => {
                  user.subscribedAccount = subscriber; //connect user with subscriber account;
		     next();
	     })
	     .catch(error => {

                   console.log(`Error in connecting subscriber: ${error.message}`);
		     next(error); //pass any errors to next middleware
	     });

	} else {
            next(); //call next functionif user already has an association
	}

});
/*
userSchema.pre("save", function(next) { //set up the pre ('save') hook

	let user = this;
	bcrypt.hash(user.password, 10).then(hash => { //hash user pssword.
             user.password = hash;
		next();
	})
	     .catch(error => {

                 console.log(`Error in hashing password: ${error.message}`);
		     next(error);
	     });
});

userSchema.methods.passwordComparison = function(inputPassword) { //add function to compare hashed passwords.
            let user = this;
	    return bcrypt.compare(inputPassword, user.password); //compare user password with stored password
};
*/

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});


module.exports = mongoose.model("User", userSchema);
