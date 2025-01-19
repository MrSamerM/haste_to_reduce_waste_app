import React from "react";
import '../styling/ReserveDonation.css'
import axios from "axios";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from "leaflet";

// https://react-leaflet.js.org/docs/start-installation/ 
// https://www.youtube.com/watch?v=jD6813wGdBA&t=442s watch this
function ReserveDonation() {

    const position = [51.505, -0.09]
    const customIcon = new Icon({
        // image marker from https://www.iconfinder.com/icons/285659/marker_map_icon
        iconUrl: require('../image/marker.png'),
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
                <Marker position={position} icon={customIcon}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>,

        </div>
    );
}

export default ReserveDonation;