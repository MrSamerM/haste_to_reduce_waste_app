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
                const allDonations = res.data.result.map((data) => [data.latitude, data.longitude]);
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
                    <Marker key={index} position={listOfMarker} icon={customIcon}>
                        <Popup>
                            A pretty CSS3 popup. <br />
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>,

        </div>
    );
}

export default ReserveDonation;