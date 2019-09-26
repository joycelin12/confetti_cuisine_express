$(document).ready(() => {
	$("#modal-button").click(() => { //listen for a click event on modal button
		$(".modal-body").html(''); //clear modal from previous content
		$.get("/courses?format=json", (data) => { //request data from /courses?format=json async
			data.forEach((course) => { //loop through array of data in response
				$(".modal-body").append(
					`<div>
					<span class="course-title">
					${course.title}
					</span>
					<div class="course-description">
					${course.description}
					</div>
					</div>` //append each course to the modal
					
				);
			});
		});
	});
});

