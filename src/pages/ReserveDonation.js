import React, { useEffect, useState } from "react";
import '../styling/ReserveDonation.css'
import axios from "axios";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from "leaflet";

import markerIcon from '../image/marker.png';
//  07/03/2025

// Clker-Free-Vector-Images.(2014). Location, Poi, Pin . Available at: 
// https://pixabay.com/vectors/location-poi-pin-marker-position-304467/ (Accessed: 7 March 2025).

import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'

// OpenAI. (2025). ChatGPT (28 February Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 28 February 2025). 
// Prompt: when I change the address I want the position to move, but it isn't.
const MapUpdater = ({ latitude, longitude }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([latitude, longitude], 13);
    }, [latitude, longitude, map]); // Runs whenever latitude or longitude changes
    return null;
};


// received help from video 
// Alejandro AO - Software & Ai. (2023) React Leaflet Tutorial for Beginners (2023). 
// Available at:https://www.youtube.com/watch?v=jD6813wGdBA&t=442s (Accessed:19 January 2025)

function ReserveDonation() {
    axios.defaults.withCredentials = true;

    const [markers, setMarkers] = useState([]);
    const [address, setAddress] = useState("");
    const [longitude, setLongitude] = useState(-0.09);
    const [latitude, setLatitude] = useState(51.505);

    useEffect(() => {
        const processMarkers = async () => {
            try {
                const res = await axios.get('http://localhost:8000/allDonations')
                const allDonations = res.data.result
                    .filter((data) => data.reserved === false)
                    .map((data) => ({ latitude: data.latitude, longitude: data.longitude, image: data.image, description: data.description, portionSize: data.portionSize, reserved: data.reserved, id: data._id }));
                setMarkers(allDonations);

            } catch (err) {
                console.log("Error", err)
            }
        }
        processMarkers();

    }, []);

    const onPlaceSelect = (place) => {
        if (place && place.properties && place.properties.formatted) {
            setAddress(place.properties.formatted);
            setLongitude(place.geometry.coordinates[0]);
            setLatitude(place.geometry.coordinates[1]);
        }
    }

    const updatedAddress = (value) => {
        setAddress(value);
    }

    const customIcon = new Icon({
        iconUrl: markerIcon,
        iconSize: [38, 38]
    })

    const reserveDonation = async (id) => {

        const data = {
            reserved: true,
            donationID: id
        }

        try {
            const res = await axios.post('http://localhost:8000/updateReservation', data);
            if (res.data.message === "Reserved") {
                window.location.reload();

            }
        } catch (err) {
            console.log("Error", err)
        }
    }

    return (
        <div>
            <div id="reserveDonationTitleDiv"><h1 id="reserveDonationTitle">Reserve Donation</h1></div>

            <div className="reserveDonationInputs" id="autoCompleteAddress">
                <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
                    <GeoapifyGeocoderAutocomplete id="addressInput" placeholder="Enter address here"
                        lang='en'
                        limit={5}
                        value={address}
                        onChange={updatedAddress}
                        placeSelect={onPlaceSelect}
                    />
                </GeoapifyContext>
            </div>
            <br></br>
            <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false}>
                <MapUpdater latitude={latitude} longitude={longitude} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markers.map((listOfMarker, index) => (
                    <Marker key={index} position={[listOfMarker.latitude, listOfMarker.longitude]} icon={customIcon}>
                        <Popup className="mapPopup" >
                            <img src={listOfMarker.image} /> <br />
                            <p>Description: {listOfMarker.description} </p>
                            <p>Portion Size: {listOfMarker.portionSize}</p>
                            {listOfMarker.reserved === true ? null : <button id="reserveButton" onClick={() => reserveDonation(listOfMarker.id)}>Reserve this donation</button>}
                            {/* used chatgpt for top line, because I had to send the id straight away to the function. 
                               OpenAI. (2025). ChatGPT (28 February Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 28 February 2025). 
                               Prompt:(My entire code) */}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>,

        </div>
    );
}

export default ReserveDonation;