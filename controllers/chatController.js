"use strict";

module.exports = io => { //export the chat controller contents
	io.on("connection", client => { //listen for new user connections
		console.log("new connection");

		client.on("disconnect", () => { //listen for when user disconnects;
 
		console.log("user disconnected");
		});

		client.on("message", () => { //listen for custom message event

			io.emit("message", {
				content: "Hello"
			}); //broadcast a message to all connected users.
		});
	});

	
};
