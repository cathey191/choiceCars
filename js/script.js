(function() {
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

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2F0aGV5MTkxIiwiYSI6ImNqaTNtb2o1ODAwNjgzcHF0ZWQxdmVtcTcifQ.BaXfgHPABUk6-kMMyyMNXQ';
	var map = new mapboxgl.Map({
		container: 'map', // container id
		style: 'mapbox://styles/cathey191/cji3oxshg1lt72rkzkj9i7c0m',
		center: [174.78, -41.279], // starting position
		zoom: 12 // starting zoom
	});
})();
