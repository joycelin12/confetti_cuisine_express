$(document).ready(() => {
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
