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
			price: [],
			fuelKm: [],
			mapChart: $('#mapChart')[0],
			bookingConfirmed: $('#bookingConfirmed')[0]
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
			app.globalElements.mapChart.addEventListener(
				'click',
				app.chartButton,
				false
			);
			app.globalElements.results.addEventListener('click', app.book, false);
			app.globalElements.bookingConfirmed.addEventListener(
				'click',
				app.bookingConfirmed,
				false
			);
			app.globalElements.return.addEventListener(
				'click',
				app.returnHome,
				false
			);
		},

		// date calender
		calender: function() {
			// sets current format of date
			var dateFormat = 'mm/dd/yy';

			// sets pickDate date calender
			var pickDate = $('#pickDate')
				// sets display information
				.datepicker({
					dateFormat: 'dd/mm/yy',
					defaultDate: 0,
					minDate: 0,
					numberOfMonths: 1
				})
				// resets dropDate calender to have a min date of pickDate
				.on('change', function() {
					dropDate.datepicker('option', 'minDate', app.getDate(this));
				});

			// sets dropoff date calender
			var dropDate = $('#dropDate')
				// sets display information
				.datepicker({
					dateFormat: 'dd/mm/yy',
					defaultDate: 0,
					minDate: 0,
					numberOfMonths: 1
				})
				// resets pickDate calender to have a max date of pickDate
				.on('change', function() {
					pickDate.datepicker('option', 'maxDate', app.getDate(this));
				});
		},

		// resets date format for setting min and max dates
		getDate: function(element) {
			// resets date format
			var dateFormat = 'dd/mm/yy';
			var newDate = $('#' + element.id).datepicker({
				dateFormat: 'mm/dd/yy'
			});
			var date;
			try {
				date = $.datepicker.parseDate(dateFormat, element.value);
			} catch (error) {
				date = null;
			}
			return date;
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
			var pickDate = $('#pickDate').datepicker('getDate');
			var dropDate = $('#dropDate').datepicker('getDate');
			var totalPpl = $('#totalPpl')[0].innerText;
			$('[data-toggle="tooltip"]').tooltip('hide');

			// val pick location, show tooltips
			// pickup location
			if (pickLoc === 'Choose...') {
				$('#pickLocation').tooltip('show');
				// 	// pickup date
			} else if (pickDate === null) {
				$('#pickDate').tooltip('show');
			} else if (dropDate === null) {
				$('#dropDate').tooltip('show');
			} else if (app.compareDates(pickDate, dropDate) > 16) {
				$('#dropDate')
					.attr('title', 'Max of fifteen days')
					.tooltip('_fixTitle')
					.tooltip('show');
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
			var pickDate = $('#pickDate').datepicker('getDate');
			var dropDate = $('#dropDate').datepicker('getDate');
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

					// var ele = document.createElement('p');
					// ele.setAttribute('class', 'title' + [i]);

					app.createSection(dataType, i);
					// ele.setAttribute('class', 'title' + i);

					// app.globalElements.topper.after(ele);

					// $('.title' + [i]).text(dataType);
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

		createSection: function(dataType, i) {
			// var col8 = document.createElement('div');
			// col8.setAttribute('class', 'col-8');
			// var title = document.createElement('h3');
			// title.setAttribute('class', 'title' + i);
			// sectionDiv.appendChild(col8);
			// col8.appendChild(title);

			var section = app.createEle('div', 'section result row', false);
			var col8 = app.createEle('div', 'col-8', section);
			app.createEle('h3', 'title' + i, col8);

			app.globalElements.topper.after(section);

			$('.title' + [i]).text(dataType);
		},

		createEle: function(element, className, placement) {
			var name = document.createElement(element);
			name.setAttribute('class', className);
			if (placement) {
				placement.appendChild(name);
			} else {
				return name;
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
			var map = new mapboxgl.Map({
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
					app.pricing();
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

		pricing: function() {
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
			app.multiArray(price, app.globalElements.diffDays);

			// multiplies all in fuel array by distance (in km)
			app.multiArray(fuelKm, distance);

			// multiplies all in fuel array by 2 ($2 is the example fuel rate)
			app.multiArray(fuelKm, 2);

			// sets global pricing
			app.globalElements.price = price;
			app.globalElements.fuelKm = fuelKm;

			// creates chart
			app.chart();
		},

		// switched between map and chart
		chartButton: function() {
			var button = $('#mapChart')[0];
			var buttonText = $('#buttonText')[0].innerHTML;

			// if showing map, change to chart
			if (buttonText === 'Pricing Chart') {
				$('#mapDiv').addClass('displayNone');
				$('#chartDiv').removeClass('displayNone');

				$('#buttonText').text('View Map');

				// if showing chart, change to map
			} else {
				$('#chartDiv').addClass('displayNone');
				$('#mapDiv').removeClass('displayNone');
				// app.mapLocation();
				$('#buttonText').text('Pricing Chart');
			}
		},

		// creates chart
		chart: function() {
			// creates chart
			var ctx = document.getElementById('chart').getContext('2d');
			var chart = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: app.globalElements.vehicleOptions,
					datasets: [
						{
							label: 'Total Days',
							data: app.globalElements.price,
							backgroundColor: '#94C0E7',
							borderColor: '#e2f4f6',
							borderWidth: 1
						},
						{
							label: 'Fuel Cost',
							data: app.globalElements.fuelKm,
							backgroundColor: '#3c77a8',
							borderColor: '#e2f4f6',
							borderWidth: 1
						}
					]
				},
				options: {
					legend: {
						labels: {
							fontColor: '#e2f4f6',
							fontSize: 15
						}
					},
					title: {
						display: true,
						fontColor: '#e2f4f6',
						fontSize: 16,
						fontWeight: 300,
						text: 'Cost of Vehicle Rental in NZD'
					},
					scales: {
						yAxes: [
							{
								ticks: {
									fontColor: '#e2f4f6',
									fontSize: 12,
									beginAtZero: true
								},
								stacked: true
							}
						],
						xAxes: [
							{
								ticks: {
									fontColor: '#e2f4f6',
									fontSize: 12
								},
								stacked: true
							}
						]
					},
					// displays price on top of bar graph
					plugins: {
						datalabels: {
							color: '#2f3b3b',
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

		// multiplies each number in the array
		multiArray: function(array, multiply) {
			$.each(array, function(index, value) {
				array[index] = Math.ceil(value * multiply);
			});
		},

		// return to search page
		returnHome: function() {
			// resets data
			app.globalElements.distance = 0;
			app.globalElements.diffDays = 0;
			app.globalElements.vehicleOptions = [];
			// changes page display
			$('#chartDiv').addClass('displayNone');
			$('#mapDiv').removeClass('displayNone');
			$('#buttonText').text('Pricing Chart');
			$('.result').remove();
			$('.results').addClass('displayNone');
			$('.home').removeClass('displayNone');
		},

		// book options for that vehicle
		book: function(e) {
			if (e.target.classList[0] === 'btn') {
				var element = e.target.parentElement.parentNode.children['0'];
				var vehicle = element.childNodes['0'].innerText;
				var dailyPrice = element.children[1].children[1].innerHTML;
				var totalPrice = parseInt(dailyPrice) * app.globalElements.diffDays;

				// resets droploc to same as pickup
				var dropLoc = $('#dropLocation')[0].value;
				if ($('#dropLocation')[0].value == 0) {
					dropLoc = $('#pickLocation')[0].value;
				}
				$('#bookModalLabel').text('New Booking For a ' + vehicle);
				$('#modalPick').text(
					$('#pickDate')[0].value +
						' at 2pm, from ' +
						$('#pickLocation')[0].value
				);
				$('#modalDrop').text(
					$('#dropDate')[0].value + ' at 10am, from ' + dropLoc
				);
				$('#modalPrice').text('NZD ' + totalPrice);
				$('#bookModal').modal('show');
			}
		},

		bookingConfirmed: function() {
			if ($('#bookingName')[0].value === '') {
				$('#bookingName').tooltip('show');
			} else if ($('#bookingEmail')[0].value === '') {
				$('#bookingEmail').tooltip('show');
			} else if ($('#bookingPhone')[0].value === '') {
				$('#bookingPhone').tooltip('show');
			} else {
				// resets data
				app.globalElements.distance = 0;
				app.globalElements.diffDays = 0;
				app.globalElements.vehicleOptions = [];
				// changes page display
				$('.result').remove();
				$('.results').addClass('displayNone');
				$('.home').removeClass('displayNone');

				// hides modal
				$('#bookModal').modal('hide');
				$('#bookingMade').modal('show');
			}
		}
	};

	// runs all event listners
	app.eventListener();
	// runs calender checker
	app.calender();
});
