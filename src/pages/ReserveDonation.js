import React, { useEffect, useState } from "react";
import '../styling/ReserveDonation.css'
import axios from "axios";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from "leaflet";
import markerIcon from '../image/marker.png';


// https://react-leaflet.js.org/docs/start-installation/ 19/01/2025
// https://www.youtube.com/watch?v=jD6813wGdBA&t=442s  received help from video on 19/01/2025
function ReserveDonation() {
    axios.defaults.withCredentials = true;

    const [markers, setMarkers] = useState([]);

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

    const position = [51.505, -0.09]

    const customIcon = new Icon({
        // image marker from https://www.iconfinder.com/icons/285659/marker_map_icon 19/01/2025
        iconUrl: markerIcon,
        iconSize: [38, 38]
    })

    const reserveDonation = async (id) => {


        const data = {
            reserved: true,
            donationID: id
        }

        try {
            await axios.post('http://localhost:8000/updateReservation', data);
        } catch (err) {
            console.log("Error", err)
        }
    }

    return (
        <div>
            ReserveDonation
            <br></br>
            <br></br>
            <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markers.map((listOfMarker, index) => (
                    <Marker key={index} position={[listOfMarker.latitude, listOfMarker.longitude]} icon={customIcon}>
                        <Popup className="mapPopup" >
                            <img src={listOfMarker.image} /> <br />
                            {listOfMarker.description} <br />
                            {listOfMarker.portionSize} <br />
                            {listOfMarker.reserved === true ? null : <button id="reserveButton" onClick={() => reserveDonation(listOfMarker.id)}>Reserve this donation</button>}
                            {/* used chatgpt for top line, because I had to send the id straight away to the function. Prompt:(My entire code) */}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>,

        </div>
    );
}

export default ReserveDonation;