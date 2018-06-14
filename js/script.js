$(document).ready(function() {
	// data
	var data = [
		(motorbike = {
			type: 'Motorbike',
			mixSeat: 1,
			maxSeat: 1,
			price: 109,
			minDay: 1,
			maxDay: 5,
			fuelKm: 3.7
		}),
		(smallCar = {
			type: 'Small Car',
			mixSeat: 1,
			maxSeat: 2,
			price: 129,
			minDay: 1,
			maxDay: 10,
			fuelKm: 8.5
		}),
		(largeCar = {
			type: 'Large Car',
			mixSeat: 1,
			maxSeat: 5,
			price: 144,
			minDay: 3,
			maxDay: 10,
			fuelKm: 9.7
		}),
		(motorhome = {
			type: 'Motorhome',
			mixSeat: 2,
			maxSeat: 6,
			price: 200,
			minDay: 2,
			maxDay: 15,
			fuelKm: 17
		})
	];

	// global dom elements
	var numberPpl = document.querySelector('.people');
	var topper = $('.topper')[0];

	// Increases and deceases number if people
	function peopleButtons(e) {
		var totalPpl = $('#totalPpl')[0];
		var pplToNumber = parseInt(totalPpl.innerText);

		if (e.target.id === 'plus' && totalPpl.innerText <= '5') {
			totalPpl.innerText = pplToNumber + 1;
		} else if (e.target.id === 'minus' && totalPpl.innerText >= '2') {
			totalPpl.innerText = pplToNumber - 1;
		}
	}
	numberPpl.addEventListener('click', peopleButtons, false);

	// validation
	$('#search').click(function() {
		var pickLoc = $('#pickLocation')[0].value;
		var pickDate = $('#pickDate')[0].value;
		var dropDate = $('#dropDate')[0].value;
		var totalPpl = $('#totalPpl')[0].innerText;
		console.dir($('#pickDate')[0]);

		// val pick location
		if (pickLoc === 'Choose...') {
			$('#pickLocation').tooltip('show');
		} else if (pickDate === '') {
			$('#pickDate').tooltip('show');
		} else if (dropDate === '') {
			$('#dropDate').tooltip('show');
		} else {
			getResults();
		}
	});

	// page layout
	function getResults() {
		// inputs
		var pickLoc = $('#pickLocation')[0].value;
		var dropLoc = $('#dropLocation')[0].value;
		var pickDate = $('#pickDate')[0].value;
		var dropDate = $('#dropDate')[0].value;
		var totalPpl = $('#totalPpl')[0].innerText;

		// location
		if (dropLoc === '0') {
			dropLoc = pickLoc;
		}

		// days
		var date1 = new Date(pickDate);
		var date2 = new Date(dropDate);
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

		// results
		for (var i = 0; i < data.length; i++) {
			var dataType = data[i].type;

			// people
			if (
				data[i].mixSeat <= totalPpl &&
				data[i].maxSeat >= totalPpl &&
				data[i].minDay <= diffDays &&
				data[i].maxDay >= diffDays
			) {
				var newVehicle = '<div class="section result">';
				newVehicle +=
					'<button class="btn btn-outline-secondary greeenButton floatRight" >Book</button>';
				newVehicle += '<h3 class="title">' + dataType + '</h3>';
				newVehicle +=
					'<p class="stats">Manual<br />Special Licence Required<br />' +
					data[i].fuelKm +
					' / 100km</p>';
				newVehicle += '<div class="statPeople">';
				newVehicle +=
					'<h5 class="numberPpl">' +
					data[i].mixSeat +
					'-' +
					data[i].maxSeat +
					'</h5>';
				newVehicle += '<i class="fas fa-user"></i>';
				newVehicle += '</div>';
				newVehicle += '</div>';
				topper.insertAdjacentHTML('afterend', newVehicle);

				// change to the other page
				$('.home').addClass('displayNone');
				$('.results').removeClass('displayNone');

				// map
				mapboxgl.accessToken =
					'pk.eyJ1IjoiY2F0aGV5MTkxIiwiYSI6ImNqaTNtb2o1ODAwNjgzcHF0ZWQxdmVtcTcifQ.BaXfgHPABUk6-kMMyyMNXQ';
				var map = new mapboxgl.Map({
					container: 'map', // container id
					style: 'mapbox://styles/cathey191/cji3oxshg1lt72rkzkj9i7c0m',
					center: [174.78, -41.279], // starting position
					zoom: 12 // starting zoom
				});
			} else {
				// console.log('fail');
			}
		}
	}

	// takes you to home page
	$('#return').click(function() {
		$('.result').remove();
		$('.results').addClass('displayNone');
		$('.home').removeClass('displayNone');
	});
});
