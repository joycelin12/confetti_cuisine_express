$(document).ready(() => {

	const socket = io(); //initialize socket.io on the client

	$("#chatForm").submit(() => { //emit an event when form is submitted
		let userName = $("#chat-user-name").val(), //pull user name		
		    userId = $("#chat-user-id").val(), //pull hidden field from the form
                	text = $("#chat-input").val(); //grab text from view input field
		
		socket.emit("message", {
		   content: text,
		   userName: userName,	
		   userId: userId 
		}); //emit form data to server
		$("#chat-input").val("");
			return false;

	});


	socket.on("message", (message)=> {

		displayMessage(message); // listen for an event, and populate the chat box
		for (let i =0; i <2; i++) {
                   $(".chat-icon").fadeOut(200).fadeIn(200); //animate chat icon to glash when message sent
		}
	});

	socket.on("load all messages", data => { //handle "load all messages" by parsing incoming data
             data.forEach(message => {
                      displayMessage(message);// send each message to display Message to display in chat box
	     });
	});


	let displayMessage = (message) => {
	       	$("#chat").prepend($("<li>").html(  //display message from server in chatbox
			
                    `<strong class="message ${getCurrentUserClass(message.user)}">
			${message.userName}
		     </strong>: ${message.content}`) //display message contents along with user name in chatbox
	//	`<div class="message ${getCurrentUserClass(message.user)}">
	//	${message.content}
	//	</div>`)
             );
			
	};
	let getCurrentUserClass = (id) =>{
            let userId = $("#chat-user-id").val();
		return userId === id ? "current-user": ""; //check whether message user id matches form user id 
	};
	socket.on("user disconnected", () => { //listen for user disconnect event and display custom message

            displayMessage({
                userName: "Notice",
		content: "User left the chat"    
	    });
	});




	$("#modal-button").click(() => { //listen for a click event on modal button
		$(".modal-body").html(''); //clear modal from previous content
		$.get("/api/courses", (results = {}) => { //request data from /courses?format=json async or api/courses
			let data = results.data // set up local variable to represent data
			if(!data || !data.courses) return;
			data.courses.forEach((course) => { //loop through array of data in response
				$(".modal-body").append(
					`<div>
					<span class="course-title">
					${course.title}
					</span>
					<button class='${course.joined ? "joined-button" : "join-button"}' data-id="${course._id}">
					${course.joined ? "Joined" : "Join"}</button> 
					<div class="course-description">
					${course.description}
					</div>
					</div>` //append each course to the modal
					//add button text to reflect join status
					//add appropriate class to reflect join status
				);
			});
		}).then(() => {

                    addJoinButtonListener(); //call addjoinbuttonlistener to add an event listener on your buttons after ajax request completes
		});
	});
});


let addJoinButtonListener = () => { //create event listener for modal button
	$(".join-button").click((event) => {
		let $button = $(event.target),
			courseId = $button.data("id"); //grab button and button id data
                       $.get(`/api/courses/${courseId}/join`, (results = {}) => {
		           let data = results.data;
			       if(data && data.success) { //check whether join action was successful and modify button 
                                       $button.text("Joined")
				       .addClass("joined-button")
				       .removeClass("join-button");
			       } else {
                                   $button.text("Try again");
			       }
		       });

  });
}
