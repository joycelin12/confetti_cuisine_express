"use strict";

module.exports = io => { //export the chat controller contents
	io.on("connection", client => { //listen for new user connections
		console.log("new connection");

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
			};
		        io.emit("message", messageAttributes); // emit message with userData
			//io.emit("message", data => { //collect data as a parameter
			//	content: data.content //return data in message event as content     
			//}); //broadcast a message to all connected users.
		
		}); 
		console.log("end of message");
	});

	
};
