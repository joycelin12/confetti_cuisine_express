"use strict";

const mongoose = require("mongoose"),

	subscriberSchema = new mongoose.Schema({   // define a subscriberschema to contain name email and zipcode properties

	name: {
		type: String,
		required:true //require name property
	}, 
	email: {
		type:String,
		required:true,  //require email property and add lowercase property
		lowercase: true,
		unique: true
        },		
        zipCode: {              //setup zipcode with custom error message
		type:Number,
		min: [10000, "Zip code too short"],
		max: 99999
	}


	});


//add an instance method to get full name of subscriber

subscriberSchema.methods.getInfo = function() {
   return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

//add instance to find subscribers with same zipcode
subscriberSchema.methods.findLocalSubscribers = function() { 
	return this.model("Subscriber")
	           .find({zipCode: this.zipCode})
	           .exec();  //access subscriber model to use find method
};

module.exports = mongoose.model("Subscriber", subscriberSchema);
