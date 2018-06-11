$(document).ready(function(){
	// data
	var data = [
		(motorbike = {
			mixSeat: 1,
			maxSeat: 1,
			price: 109,
			minDay: 1,
			maxDay: 5,
			fuelKm: 3.7
		}),
		(smallCar = {
			mixSeat: 1,
			maxSeat: 2,
			price: 129,
			minDay: 1,
			maxDay: 10,
			fuelKm: 8.5
		}),
		(largeCar = {
			mixSeat: 1,
			maxSeat: 5,
			price: 144,
			minDay: 3,
			maxDay: 10,
			fuelKm: 9.7
		}),
		(motorhome = {
			mixSeat: 2,
			maxSeat: 6,
			price: 200,
			minDay: 2,
			maxDay: 15,
			fuelKm: 17
		})
	];

	// global dom elements
	var numberPpl = document.querySelector('.people')

	// Increases and deceases number if people
	function peopleButtons (e) {
		var totalPpl = $('#totalPpl')[0];
		var pplToNumber = parseInt(totalPpl.innerText);
		console.dir(totalPpl.innerText);

		if (e.target.id === 'plus' && totalPpl.innerText <= '5') {
			totalPpl.innerText = pplToNumber + 1;
		} else if (e.target.id === 'minus' && totalPpl.innerText >= '2') {
			totalPpl.innerText = pplToNumber - 1;
		}
	}
	numberPpl.addEventListener('click', peopleButtons, false);

	// page layout
		// takes you to second page
		$('#search').click(function(){
			// inputs from doc
			var pickLoc = $('#pickLocation')[0].value;
			var dropLoc = $('#dropLocation')[0].value;
			var pickDate = $('#pickDate')[0].value;
			var dropDate = $('#dropDate')[0].value;
			var totalPpl = $('#totalPpl')[0]
			// var for data
			var dash = "-";
			var pickDateArray = pickDate.split(dash);
			var dropDateArray = dropDate.split(dash);
			var totalDays = dropDateArray[3] - pickDateArray[3]

			console.dir(totalDays);

			// console.log(totalDates);



			// $('.home').addClass('displayNone');
			// $('.results').removeClass('displayNone');
	});

	// takes you to home page
	$('#return').click(function(){
		$('.results').addClass('displayNone');
		$('.home').removeClass('displayNone');
	});


	// map
	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2F0aGV5MTkxIiwiYSI6ImNqaTNtb2o1ODAwNjgzcHF0ZWQxdmVtcTcifQ.BaXfgHPABUk6-kMMyyMNXQ';
	var map = new mapboxgl.Map({
		container: 'map', // container id
		style: 'mapbox://styles/cathey191/cji3oxshg1lt72rkzkj9i7c0m',
		center: [174.78, -41.279], // starting position
		zoom: 12 // starting zoom
	});

});
