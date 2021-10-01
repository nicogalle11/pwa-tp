`use strict`;

const API_KEY_OWM = `abb590df5b1833e471a01284df47322b`;
const API_KEY_GOOGLE = `AIzaSyA4DyXA5XMhS9bfS33RbPHcLcR6xAPIXN8`;
const URL = `https://api.openweathermap.org/data/2.5/`;
const d = document;
const main = d.getElementById(`main`);
const button = d.getElementById(`button`);
const input = d.getElementById(`input`);
const select = d.getElementById(`select`);
const footer = d.querySelector(`footer`);
let storage = "";
const favicon = d.querySelector(`link[rel~="icon"]`);

cargarLocalStorage();

button.addEventListener(`click`, () => {
	searchCity(input.value, select.value);
});

function searchCity(city, unit) {
	fetch(`${URL}weather?q=${city}&units=${unit}&appid=${API_KEY_OWM}`)
		.then(function(res) {
				localStorage.storage = res;
				return res.json();			
		})
		.then(function(data) {
			if (data.cod == `404`) {
				cityNotFound();
			} else {
				localStorage.storage = JSON.stringify(data);
				mostrarDatos(data);
			}
		})
		.catch(function(error) {
			console.log(`ESTE ES EL ERROR: ` + error.message);
		})
}

function mostrarDatos(data) {
	if (d.querySelector(`#container`)) {
		d.querySelector(`#container`).remove();
	}

	//VOY A EMPEZAR A COMENTAR PORQUE ESTO ES UN LÍO
	//CREANDO LAS ETIQUETAS DEL HTML

	let container = d.createElement(`div`),
			datos = d.createElement(`div`),
				auxiliar = d.createElement(`div`),
					resumen = d.createElement(`section`),
						titulo = d.createElement(`h2`),
						temperatura = d.createElement(`p`),
					detalles = d.createElement(`section`),
						sensacion = d.createElement(`p`),					
						temp_max = d.createElement(`p`),
						temp_min = d.createElement(`p`),
						humedad = d.createElement(`p`),
						presion = d.createElement(`p`),
						viento = d.createElement(`p`),
			mapa = d.createElement(`iframe`);
	resumen.append(titulo, temperatura);
	detalles.append(sensacion, temp_max, temp_min, humedad, presion, viento);
	auxiliar.append(resumen, detalles);
	datos.append(auxiliar);
	container.append(datos, mapa)
	main.append(container);

	//IDENTIFICANDO CADA ETIQUETA CON SU ID

	container.id = `container`;
	datos.id = `datos`;
	auxiliar.id = `auxiliar`;
	resumen.id = `resumen`;
	detalles.id = `detalles`;
	titulo.id =  `titulo`;
	temperatura.id = `temperatura`;
	temp_max.id = `temp_max`;
	temp_min.id = `temp_min`;
	humedad.id = `humedad`;
	sensacion.id = `sensacion`;
	presion.id = `presion`;
	viento.id = `viento`;
	mapa.id = `mapa`;

	//APLICANDO BOOTSTRAP

	container.className = `row py-4`;
	datos.className = `text-center col-12 col-sm-10 offset-sm-1`;
	auxiliar.className = `row`;
	resumen.className = `col-12 col-lg-6`;
	detalles.className = `text-start mb-4 col-10 offset-1 col-md-8 offset-md-2 col-lg-5 m-lg-auto col-xxl-4`;
	mapa.className = `col-12 p-0 col-sm-10 offset-sm-1`;

	//SETEANDO LA PALETA DE COLORES SEGÚN TEMPERATURA

	let paleta = ``,
		blanco = `rgba(255,255,255,0.8)`, //#FFFFFF
		celeste = `rgba(92,209,255,0.8)`, //#5CD1FF
		verde = `rgba(71,255,71,0.8)`, //#47FF47
		amarillo = `rgba(255,255,92,0.8)`, //#FFFF5C
		naranja = `rgba(255,173,92,0.8)`, //#FFAD5C
		rojo = `rgba(255,71,71,0.8)`; //#FF4747

	if (parseInt(data.main.temp) <= 5) {
		paleta = `linear-gradient(45deg,${blanco},${celeste})`;
	} else if (data.main.temp <= 15) {
		paleta = `linear-gradient(45deg,${celeste},${verde})`;
	} else if (data.main.temp <= 25) {
		paleta = `linear-gradient(45deg,${verde},${amarillo})`;
	} else if (data.main.temp <= 30) {
		paleta = `linear-gradient(45deg,${amarillo},${naranja})`;
	} else if (data.main.temp > 30) {
		paleta = `linear-gradient(45deg,${naranja},${rojo})`;
	}

	//AGREGANDO DATOS AL HTML
	
	titulo.innerHTML = data.name;
	temperatura.innerHTML = `${parseInt(data.main.temp)}°`;
	sensacion.innerHTML = `Sensación térmica: <span>${data.main.feels_like}°</span>`;
	temp_max.innerHTML = `Temperatura máxima: <span>${data.main.temp_max}°</span>`;
	temp_min.innerHTML = `Temperatura mínima: <span>${data.main.temp_min}°</span>`;
	humedad.innerHTML = `Humedad: <span>${data.main.humidity}%</span>`;
	presion.innerHTML = `Presión atmosférica: <span>${data.main.pressure}hPa</span>`;
	viento.innerHTML = `Velocidad del viento: <span>${data.wind.speed}km/h</span>`;
	mapa.frameborder = `0`;
	mapa.src = `https://www.google.com/maps/embed/v1/place?key=${API_KEY_GOOGLE}&q=${data.coord.lat},${data.coord.lon}`;

	//AGREGANDO ESTILOS AL HTML

	datos.style.background = paleta;
	titulo.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png) no-repeat`;
	titulo.style.backgroundPosition = `bottom`;
	footer.style.background = paleta;
}

function cargarLocalStorage() {
	if (localStorage.storage && localStorage.storage != `[object Response]`) {
		storage = JSON.parse(localStorage.storage);
		mostrarDatos(storage);
	}
}

function cityNotFound() {
	if (d.querySelector(`#container`)) {
		d.querySelector(`#container`).remove();
	}
	let container = d.createElement(`div`),
		auxiliar = d.createElement(`div`),
		error_m1 = d.createElement(`p`),
		error_m2 = d.createElement(`p`);

	auxiliar.append(error_m1, error_m2);
	container.append(auxiliar);
	main.append(container);

	container.id = `container`;
	auxiliar.id = `auxiliar`;
	error_m1.id = `error_m1`;
	error_m2.id = `error_m2`;

	container.className = `row text-center py-5`;
	auxiliar.className = `error text-center col-12 col-sm-10 offset-sm-1 py-5`;
	error_m1.className = ``;
	error_m2.className = ``;

	error_m1.innerHTML = `:(`;
	error_m2.innerHTML = `No se encontró la ciudad que estás buscando, revisa que esté bien escrita o prueba con otra. Recordamos que, por el momento, la búsqueda está limitada a ciudades ubicadas en el Planeta Tierra. Muchas gracias.`;

	footer.style.background = `linear-gradient(45deg,rgba(255,71,71,0.8),rgba(0,0,0,0.8))`
}