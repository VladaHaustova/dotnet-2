const url = 'https://localhost:44372/'

var map = L.map('map').setView([53.195878, 50.100202], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '<a href="https://github.com/vladahaustova">Vlada Khaustova</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoidm9sdW1lY29yZSIsImEiOiJjbDJxN3cwa3QycjRwM2NwOTkwdmUzZGRwIn0.aGbKOtZKHqTyQ2SQKRm6_g'
}).addTo(map);	

// var marker = L.marker([53.195878, 50.100202]).addTo(map);

// marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

let selectedATMId = "";
let markers = {};

fetch(url + 'api/ATM', {})
	.then(response => response.json())
	.then(result => { 
		console.log(result);
		for (let atm of result) {
			let marker = L.marker([atm.geometry.coordinates[1], atm.geometry.coordinates[0]]).addTo(map)
				.bindPopup("<b>" + atm.properties.operator + "</b><br>Balance: " + atm.properties.balance + "<br><br><input class='input-new-balance' type='text'><br><button onclick='changeBalance()'>Поменять баланс</button><br><br>" + atm.properties.id)
				.addEventListener("click", () => {
					selectedATMId = atm.properties.id;
				});
			markers[atm.properties.id] = marker;
		}
	})
	
async function changeBalance() {
	try {
		const response = await fetch(url + 'api/ATM/' + selectedATMId, {
		method: 'PUT', // или 'PUT'
		body: document.querySelector('.input-new-balance').value, // данные могут быть 'строкой' или {объектом}!
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const json = await response.json();
	console.log('Успех:', json);
	markers[json.properties.id].bindPopup("<b>" + json.properties.operator + "</b><br>Balance: " + json.properties.balance + "<br><br><input class='input-new-balance' type='text'><br><button onclick='changeBalance()'>Поменять баланс</button><br><br>" + json.properties.id)
	} catch (error) {
		console.error('Ошибка:', error);
	}
}