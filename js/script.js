$(document).ready(function() {
	var app = {
		// global elements
		globalElements: {
			numberPpl: document.querySelector('.people'),
			search: $('#search')[0],
			return: $('#return')[0],
			topper: $('.topper')[0],
			vehicleOptions: [],
			distance: 0,
			diffDays: 0,
			results: $('.results')[0],

			// gets today's date, changes format
			dateToday: function() {
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth() + 1;
				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				today = yyyy + '-' + mm + '-' + dd;
				return today;
			}
		},

		// all event listners
		eventListener: function() {
			app.globalElements.numberPpl.addEventListener(
				'click',
				app.peopleButtons,
				false
			);
			app.globalElements.search.addEventListener(
				'click',
				app.searchButton,
				false
			);
			app.globalElements.return.addEventListener(
				'click',
				app.returnHome,
				false
			);

			app.globalElements.results.addEventListener('click', app.book, false);
		},

		// increase/deceases people
		peopleButtons: function(e) {
			var totalPpl = $('#totalPpl')[0];
			var pplToNumber = parseInt(totalPpl.innerText);
			if (e.target.id === 'plus' && totalPpl.innerText <= '5') {
				totalPpl.innerText = pplToNumber + 1;
			} else if (e.target.id === 'minus' && totalPpl.innerText >= '2') {
				totalPpl.innerText = pplToNumber - 1;
			}
		},

		// starts run of all process
		searchButton: function() {
			var pickLoc = $('#pickLocation')[0].value;
			var pickDate = $('#pickDate')[0].value;
			var dropDate = $('#dropDate')[0].value;
			var totalPpl = $('#totalPpl')[0].innerText;
			var today = app.globalElements.dateToday();
			$('[data-toggle="tooltip"]').tooltip('hide');
			// val pick location, show tooltips
			// pickup location
			if (pickLoc === 'Choose...') {
				$('#pickLocation').tooltip('show');
				// pickup date
			} else if (pickDate === '') {
				$('#pickDate').tooltip('show');
			} else if (app.compareDates(today, pickDate) <= -1) {
				$('#pickDate')[0].title = 'The past is unavailable';
				$('#pickDate').tooltip('show');
				// drop off date
			} else if (
				dropDate === '' ||
				app.compareDates(pickDate, dropDate) <= -1
			) {
				$('#dropDate').tooltip('show');
				// if all are selected
			} else if (app.compareDates(pickDate, dropDate) > 10) {
				$('#dropDate')[0].title = 'Max of ten days';
				$('#dropDate').tooltip('show');
			} else {
				$('[data-toggle="tooltip"]').tooltip('hide');
				app.getResults();
			}
		},

		// compares dates, to find total number
		compareDates: function(startDate, endDate) {
			var date1 = new Date(startDate);
			var date2 = new Date(endDate);
			var timeDiff = date2.getTime() - date1.getTime();
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			return diffDays;
		},

		// runs validation to see if any vehicles fit the requirements
		getResults: function() {
			// if no vehicles fit, show alert
			if (app.validation() === 'fail') {
				$('#noVehModal').modal('show');
				// if there are vehicles, display vehicles
			} else {
				// change to the other page
				$('.home').addClass('displayNone');
				$('.results').removeClass('displayNone');

				// runs create map then chart
				app.mapLocation();
			}
		},

		// validation
		validation: function() {
			// inputs
			var pickLoc = $('#pickLocation')[0].value;
			var dropLoc = $('#dropLocation')[0].value;
			var pickDate = $('#pickDate')[0].value;
			var dropDate = $('#dropDate')[0].value;
			var totalPpl = $('#totalPpl')[0].innerText;
			// days
			app.globalElements.diffDays = app.compareDates(pickDate, dropDate);
			var diffDays = app.globalElements.diffDays;
			// counts fails
			var numberFail = [];

			// results
			for (var i = 0; i < data.length; i++) {
				var dataType = data[i].type;
				var dataImg = data[i].img;

				// people
				if (
					data[i].mixSeat <= totalPpl &&
					data[i].maxSeat >= totalPpl &&
					data[i].minDay <= diffDays &&
					data[i].maxDay >= diffDays
				) {
					app.globalElements.vehicleOptions.push(dataType);
					var newVehicle = '<div class="section result row">';
					newVehicle += '<div class="col-8">';
					newVehicle += '<h3 class="title">' + dataType + '</h3>';
					newVehicle +=
						'<p class="stats">Manual<br />Special Licence Required<br />' +
						data[i].fuelKm +
						'L / 100km</p>';
					newVehicle += '<div class="statPeople">';
					newVehicle +=
						'<h5 class="numberPpl">' +
						data[i].mixSeat +
						'-' +
						data[i].maxSeat +
						'</h5>';
					newVehicle += '<i class="fas fa-user"></i>';
					newVehicle += '</div></div>';
					newVehicle += '<div class="col-4 iconButton">';
					newVehicle +=
						'<img class="icon" src="img/' +
						dataImg +
						'.svg" alt="' +
						dataType +
						'">';
					newVehicle +=
						'<button class="btn btn-outline-secondary greeenButton pBottom" >Book</button>';
					newVehicle += '</div></div>';
					app.globalElements.topper.insertAdjacentHTML('afterend', newVehicle);
				} else {
					numberFail.push(dataType);
				}
			}

			if (numberFail.length === 4) {
				return 'fail';
			} else {
				return 'pass';
			}
		},

		// creates map
		mapLocation: function() {
			// get locations from inputs
			var pickLoc = $('#pickLocation')[0].value;
			var dropLoc = $('#dropLocation')[0].value;
			if (dropLoc === '0') {
				dropLoc = pickLoc;
			}
			// gets coordinates from data.js
			var start = geojson[pickLoc].coordinates;
			var end = geojson[dropLoc].coordinates;

			// creates map
			mapboxgl.accessToken =
				'pk.eyJ1IjoiY2F0aGV5MTkxIiwiYSI6ImNqaTNtb2o1ODAwNjgzcHF0ZWQxdmVtcTcifQ.BaXfgHPABUk6-kMMyyMNXQ';
			const map = new mapboxgl.Map({
				container: 'map', // container id
				style: 'mapbox://styles/cathey191/cji3oxshg1lt72rkzkj9i7c0m',
				center: [172, -41.279],
				zoom: 3 // starting zoom
			});

			// adds route
			map.on('load', function() {
				var directionsRequest =
					'https://api.mapbox.com/directions/v5/mapbox/driving/' +
					start[0] +
					',' +
					start[1] +
					';' +
					end[0] +
					',' +
					end[1] +
					'?geometries=geojson&access_token=' +
					mapboxgl.accessToken;
				$.ajax({
					method: 'GET',
					url: directionsRequest
				}).done(function(data) {
					var route = data.routes[0].geometry;
					app.globalElements.distance = data.routes[0].distance / 1000;

					app.chart();
					map.addLayer({
						id: 'route',
						type: 'line',
						source: {
							type: 'geojson',
							data: {
								type: 'Feature',
								geometry: route
							}
						},
						paint: {
							'line-width': 2
						}
					});
					map.addLayer({
						id: 'start',
						type: 'circle',
						source: {
							type: 'geojson',
							data: {
								type: 'Feature',
								geometry: {
									type: 'Point',
									coordinates: start
								}
							}
						}
					});
					map.addLayer({
						id: 'end',
						type: 'circle',
						source: {
							type: 'geojson',
							data: {
								type: 'Feature',
								geometry: {
									type: 'Point',
									coordinates: end
								}
							}
						}
					});
				});
			});
		},

		// creates chart
		chart: function() {
			// gets/holds required data
			var vehicleOptions = app.globalElements.vehicleOptions;
			var price = [];
			var distance = app.globalElements.distance / 100;
			var fuelKm = [];

			// gets data for the vehicles that fit the requirements
			for (var i = 0; i < data.length; i++) {
				var dataType = data[i].type;
				for (var j = 0; j < vehicleOptions.length; j++) {
					if (dataType === vehicleOptions[j]) {
						price.push(data[i].price); // cost of vehicle per day
						fuelKm.push(data[i].fuelKm); // cost of L of fuel per 100km
					}
				}
			}

			// multiplies all in price array by the amount of days
			app.test(price, app.globalElements.diffDays);

			// multiplies all in fuel array by distance (in km)
			app.test(fuelKm, distance);

			// multiplies all in fuel array by 2 ($2 is the example fuel rate)
			app.test(fuelKm, 2);

			// creates chart
			var ctx = document.getElementById('chart').getContext('2d');
			console.dir(ctx);
			var chart = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: vehicleOptions,
					datasets: [
						{
							label: 'Total Days',
							data: price,
							backgroundColor: '#a6bbb8',
							borderColor: '#2f3c3b',
							borderWidth: 1
						},
						{
							label: 'Fuel Cost',
							data: fuelKm,
							backgroundColor: '#7E929A',
							borderColor: '#2f3c3b',
							borderWidth: 1
						}
					]
				},
				options: {
					legend: {
						labels: {
							fontColor: '#a6bbb8',
							fontSize: 15
						}
					},
					title: {
						display: true,
						fontColor: '#a6bbb8',
						fontSize: 16,
						fontWeight: 300,
						text: 'Cost of Vehicle Rental in NZD'
					},
					scales: {
						yAxes: [
							{
								ticks: {
									fontColor: '#a6bbb8',
									fontSize: 11,
									beginAtZero: true
								},
								stacked: true
							}
						],
						xAxes: [
							{
								ticks: {
									fontColor: '#a6bbb8',
									fontSize: 11
								},
								stacked: true
							}
						]
					},
					// displays price on top of bar graph
					plugins: {
						datalabels: {
							color: '#2f3c3b',
							display: function(context) {
								return context.dataset.data[context.dataIndex] > 15;
							},
							font: {
								weight: 'bold'
							},
							formatter: Math.round
						}
					}
				}
			});
		},

		test: function(array, multiply) {
			$.each(array, function(index, value) {
				array[index] = Math.ceil(value * multiply);
			});
		},

		book: function(e) {
			var dropLoc = $('#dropLocation')[0].value;
			if ($('#dropLocation')[0].value == 0) {
				dropLoc = $('#pickLocation')[0].value;
			}

			// console.dir(e.target);
			if (e.target.classList[0] === 'btn') {
				$('#modalPick').text(
					$('#pickDate')[0].value +
						' at 2pm, from ' +
						$('#pickLocation')[0].value
				);
				$('#modalDrop').text(
					$('#dropDate')[0].value + ' at 10am, from ' + dropLoc
				);
				$('#exampleModal').modal('show');
			}
		},

		// return to search page
		returnHome: function() {
			// resets data
			app.globalElements.distance = 0;
			app.globalElements.diffDays = 0;
			app.globalElements.vehicleOptions = [];
			// changes page display
			$('.result').remove();
			$('.results').addClass('displayNone');
			$('.home').removeClass('displayNone');
		}
	};

	// runs all event listners
	app.eventListener();
});
