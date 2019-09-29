"use strict";

const mongoose = require("mongoose"),
	{Schema} = require("mongoose");

const messageSchema = new Schema({

          content:{
              type: String,
		  required: true //require content in each message
	  },
	userName: {
                 type: String,
		required: true // require user name with each message
	}, 
	user: {
           type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	}//require user id with each message

}, {

    timestamps: true
});

module.exports = mongoose.model("Message", messageSchema);
