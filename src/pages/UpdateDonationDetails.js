import React from "react";
import '../styling/Donate.css'
import { useState, useEffect } from "react";
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'
import axios from 'axios';



// https://www.geeksforgeeks.org/how-to-upload-image-and-preview-it-using-reactjs/ do display image 15/01/25
// chatGPT [pasted my code to see why the if statements where not working] 16/01/21. Used for file type, FileURL useState and change function.

//  https://www.youtube.com/watch?v=pxkE2tT6Y-o to convert image to base64 17/01/2025

function UpdateDonationDetails() {

    const [address, setAddress] = useState("");
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [description, setDescription] = useState("");
    const [portionSize, setPortionSize] = useState(0);

    axios.defaults.withCredentials = true;

    useEffect(() => {

    }, []);

    const donate = async (e) => {

        e.preventDefault();

        const data = {

            description: description,
            portionSize: portionSize,
            address: address,
            longitude: longitude,
            latitude: latitude
        }

        try {
            const res = await axios.post("http://localhost:8000/donate", data)
            if (res.data.message === "Donated") {
                alert("The update has been made");

                setAddress("");
                setDescription("");
                setPortionSize(0);
                setLongitude(0);
                setLatitude(0);
            }

        } catch (e) {
            console.log("Error with submission", e)
        }

    }

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

    return (
        <>
            <div id="donateTitleDiv"><h1 id="donateTitle">Update</h1></div>


            {/* GeoApify API  https://apidocs.geoapify.com/samples/autocomplete/react-geoapify-geocoder-autocomplete/ 
            // https://www.npmjs.com/package/@geoapify/react-geocoder-autocomplete*/}


            <div id="donationBox">

                <div id="allDonationResults">
                    <div id="donateDetails">
                        {/* <img src={image} /> <br /> */}

                        <div className="donationInputDiv">
                            <label className="donateInputLabels" htmlFor="descriptionInput">Description:</label>
                            <input className="donationInputs" type="text" id="descriptionInput" placeholder="Enter description here" value={description} onChange={(evt) => setDescription(evt.target.value)} />
                        </div>
                        <br></br>
                        <div className="donationInputDiv">
                            <label className="donateInputLabels" htmlFor="portionSizeInput">Portion Size:</label>
                            <input className="donationInputs" type="number" id="portionSizeInput" value={portionSize} onChange={(evt) => setPortionSize(evt.target.value)} />
                        </div>
                        <br></br>
                        <div className="donationInputDiv">

                            <label className="donateInputLabels" htmlFor="addressInput">Address:</label>
                            <div className="donationInputs" id="autoCompleteAddress">
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
                        </div>
                    </div>
                    <br></br>
                    <button id="donateButton" onClick={donate}>Donate</button>
                </div>


            </div>
        </>
    );
}

export default UpdateDonationDetails;