"use strict";

const Message = require("../models/message");

module.exports = io => { //export the chat controller contents
	io.on("connection", client => { //listen for new user connections
		console.log("new connection");

		Message.find({})
		     .sort({ createdAt: -1})
	             .limit(10)
		     .then(messages => { //query 10 most recent messages
                     client.emit("load all messages", messages.reverse()); //emit custom event with 10 messages to new socket only.
		});



		client.on("disconnect", () => { //listen for when user disconnects;
 
		console.log("user disconnected");
		});

	/*	client.on("message", () => {
                     io.emit("message", {
                          content: "Hell0"
		     });
		});*/

			client.on("message", data => { //listen for custom message event

		//	io.emit("message", {content: data.content});

			let messageAttributes = {
                             content: data.content,
			     userName: data.userName,
			     user: data.userId  // collect all incoming data	
			},

			m = new Message(messageAttributes);
			m.save()
			 .then(() => {
				io.emit("message", messageAttributes);
			 })
			.catch(error => console.log(`error: ${error.message}`)); //emit message values if save is successful or log any errors 
		        //io.emit("message", messageAttributes); // emit message with userData
			//io.emit("message", data => { //collect data as a parameter
			//	content: data.content //return data in message event as content     
			//}); //broadcast a message to all connected users.
		
		}); 
		console.log("end of message");

	});

	
};
