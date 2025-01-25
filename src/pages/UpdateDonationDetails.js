import React from "react";
import '../styling/Donate.css'
import { useState, useEffect, useRef } from "react";
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'
import axios from 'axios';
import { useParams } from "react-router-dom";

function UpdateDonationDetails() {

    const [file, setFile] = useState("");
    const [fileURL, setFileURL] = useState("");
    const [disableInput, setDisableInput] = useState(true);
    const [disableScanner, setDisableScanner] = useState(true);
    const [percentage, setPercentage] = useState(0);
    const [address, setAddress] = useState("");
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [description, setDescription] = useState("");
    const [portionSize, setPortionSize] = useState(0);
    const [baseSixtyFour, setBaseSixtyFour] = useState("");
    const [predictedClass, setPredictedClass] = useState("");


    axios.defaults.withCredentials = true;

    const { id } = useParams();


    const change = (evt) => {

        setPercentage(0);
        setAddress("");
        setDescription("");
        setPortionSize(0);
        setBaseSixtyFour("");
        setPredictedClass("");
        setDisableInput(true);
        setLongitude(0);
        setLatitude(0);

        setFile(evt.target.files[0]);
        setFileURL(URL.createObjectURL(evt.target.files[0]));
    }

    useEffect(() => {
        const getDonationDetails = async () => {

            try {
                const res = await axios.get(`http://localhost:8000/donatedDonation/${id}`)
                setFileURL(res.data.image);
                setAddress(res.data.address);
                setDescription(res.data.description);
                setPortionSize(res.data.portionSize);
                setLongitude(res.data.longitude);
                setLatitude(res.data.latitude);
                setPredictedClass("a Container");

            } catch (e) {
                console.log("error when sending data", e)
            }
        }
        getDonationDetails();

    }, [])

    useEffect(() => {

        if (predictedClass === "Not a Container") {
            setDisableInput(true);
            console.log("Must be a container");
        }
        else if (predictedClass === "a Container") {
            setDisableInput(false);
            console.log("It is a container");
        }
        else if (file.type === "image/png" || file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/jpg') {
            setDisableScanner(false);
            console.log("true");

            const base = new FileReader();

            base.onloadend = () => {
                const base64 = base.result;
                setBaseSixtyFour(base64.toString());
                console.log(base64);
            }
            base.readAsDataURL(file);

        }
        else {
            setDisableScanner(true);
            console.log("false");
            console.log(file);
        }
    }, [file, percentage, predictedClass]);

    const submit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            console.log(response.data.message);
            setPredictedClass(response.data.message);
            setPercentage(response.data.confidence);
        } catch (error) {
            console.error("Can't send the file", error);
        }
    };


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

    const fileInputRef = useRef(null);

    const updateDonation = async (e) => {

        // Line bellow is from Chatgpt Prompt: I am making a updated system. But when I update image is "" but it is supposed to be a base64 (my code) 25/01/2025
        const decision = baseSixtyFour === "" ? fileURL : baseSixtyFour;

        const data = {
            donationId: id,
            image: decision,
            description: description,
            portionSize: portionSize,
            address: address,
            longitude: longitude,
            latitude: latitude
        }


        try {
            const res = await axios.post("http://localhost:8000/updateDonation", data)
            if (res.data.message === "Updated") {
                alert("The updated has been made");
                setFile("");
                setFileURL("");
                setPercentage(0);
                setAddress("");
                setDescription("");
                setPortionSize(0);
                setBaseSixtyFour("");
                setPredictedClass("");
                setDisableInput(true);
                setDisableScanner(true);
                setLongitude(0);
                setLatitude(0);
            }


            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }

        } catch (e) {
            console.log("Error with submission", e)
        }

    }

    return (
        <>
            <div id="donateTitleDiv"><h1 id="donateTitle">Update Donation</h1></div>

            <div id="donationBox">

                <div id="selectDonationImage">
                    <div id="preDonationInformation">
                        <label htmlFor="imageFile" id="selectFileLabel">Click here to upload donation image</label>
                        <input type="file" id="imageFile" onChange={change} ref={fileInputRef} />

                        <p id="imageRequirement">
                            The image must be a .png, jpeg, jpg, of gif file.<br></br>
                            This is to allow you to press scan to scan the image.<br></br>
                            If the image is over 70% a container, then you can donate.<br></br>
                            The item should be put in a suitable container.<br></br>
                            such as; aluminium, plastic, or takeaway container.<br></br>
                        </p>
                        <button id="scanImage" disabled={disableScanner} onClick={submit}>Scan</button>
                    </div>

                    <div id="imageAndPercentage">
                        <img id="selectedImage" src={fileURL} alt="selected file" />
                        <br></br>
                        <p>The Image is {percentage}% {predictedClass}</p>
                    </div>
                </div>


                {/* GeoApify API  https://apidocs.geoapify.com/samples/autocomplete/react-geoapify-geocoder-autocomplete/ 
            // https://www.npmjs.com/package/@geoapify/react-geocoder-autocomplete*/}

                <div id="allDonationResults">
                    <div id="donateDetails">

                        <div className="donationInputDiv">
                            <label className="donateInputLabels" htmlFor="descriptionInput">Description:</label>
                            <input className="donationInputs" disabled={disableInput} type="text" id="descriptionInput" placeholder="Enter description here" value={description} onChange={(evt) => setDescription(evt.target.value)} />
                        </div>
                        <br></br>
                        <div className="donationInputDiv">
                            <label className="donateInputLabels" htmlFor="portionSizeInput">Portion Size:</label>
                            <input className="donationInputs" disabled={disableInput} type="number" id="portionSizeInput" value={portionSize} onChange={(evt) => setPortionSize(evt.target.value)} />
                        </div>
                        <br></br>
                        <div className="donationInputDiv">

                            <label className="donateInputLabels" htmlFor="addressInput">Address:</label>
                            {disableInput === true ? <input className="donationInputs" id="addressInput" placeholder="Enter address here" disabled={disableInput} value={address} />
                                : <div className="donationInputs" id="autoCompleteAddress">
                                    <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
                                        <GeoapifyGeocoderAutocomplete id="addressInput" placeholder="Enter address here"
                                            lang='en'
                                            limit={5}
                                            value={address}
                                            onChange={updatedAddress}
                                            placeSelect={onPlaceSelect}
                                        />
                                    </GeoapifyContext>
                                </div>}
                        </div>
                    </div>
                    <br></br>
                    <button id="donateButton" disabled={disableInput} onClick={updateDonation}>Update Donation</button>
                </div>


            </div>
        </>
    );
}

export default UpdateDonationDetails;