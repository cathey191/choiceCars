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
var geojson = {
	type: 'FeatureCollection',
	features: [
		{
			location: 'Auckland',
			type: 'Airport',
			coordinates: [174.785, -37.0082]
		},
		{
			location: 'Wellington',
			type: 'Airport',
			coordinates: [174.8076, -41.3276]
		}
	]
};
