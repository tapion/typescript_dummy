import axios from 'axios';
const form = document.querySelector("form")! as HTMLFormElement;
const adressInput = document.getElementById("address")! as HTMLInputElement;
const GOOGLE_API_KEY = 'AIzaSyAeiu7tSQcN3EygYd9J5rLh269MOoei-j8';

type GOOGLE_RESPONSE = {
    results: { geometry: { location: { lat: number, lng: number } } }[]
}

// declare var google: any;

function eventHandler(event: Event) {
    event.preventDefault();
    const adress = adressInput.value;
    console.log(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(adress)}&key=${GOOGLE_API_KEY}`);
    axios.get<GOOGLE_RESPONSE>(`https://maps.googleapis.com/maps/api/geocode/json?address=${adress}&key=${GOOGLE_API_KEY}`)
    .then(response => {
        const coordinates = response.data.results[0].geometry.location;
        const map = new google.maps.Map(document.getElementById('map')!, {
            center: coordinates,
            zoom: 8
          });
        new google.maps.Marker({
        position: coordinates,
        map: map,
        });
        // console.log(response.data.results[0].geometry.location) 
    }).catch(err => console.log('Error: ', err));
    console.log(adress)
}

form.addEventListener('submit', eventHandler);