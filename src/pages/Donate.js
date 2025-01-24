import React from "react";
import '../styling/Donate.css'
import { useState, useEffect, useRef } from "react";
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'
import axios from 'axios';



// https://www.geeksforgeeks.org/how-to-upload-image-and-preview-it-using-reactjs/ do display image 15/01/25
// chatGPT [pasted my code to see why the if statements where not working] 16/01/21. Used for file type, FileURL useState and change function.

//  https://www.youtube.com/watch?v=pxkE2tT6Y-o to convert image to base64 17/01/2025

function Donate() {

    const [file, setFile] = useState("");
    const [fileURL, setFileURL] = useState("");
    const [disableInput, setDisableInput] = useState(true);
    const [percentage, setPercentage] = useState(0);
    const [address, setAddress] = useState("");
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [description, setDescription] = useState("");
    const [portionSize, setPortionSize] = useState(0);
    const [baseSixtyFour, setBaseSixtyFour] = useState("");
    const [predictedClass, setPredictedClass] = useState(""); // State for predicted class


    axios.defaults.withCredentials = true;


    const change = (evt) => {
        setFile(evt.target.files[0]);
        setFileURL(URL.createObjectURL(evt.target.files[0]));
    }
    useEffect(() => {
        if (file.type === "image/png" || file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/jpg') {
            setDisableInput(false);
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
            setDisableInput(true);
            console.log("false");
            console.log(file);
        }
    }, [file]);

    const submit = async (evt) => {
        evt.preventDefault();

        if (!file) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post('http://localhost:5000/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { prediction, predicted_class, confidence } = res.data;  // Get response correctly

            // Ensure predicted_class is available
            if (!predicted_class) {
                console.error("Predicted class is undefined");
                return;
            }

            // Update frontend state with prediction and confidence
            setPercentage(confidence);
            setPredictedClass(predicted_class);  // Directly use predicted class from backend

            console.log("Prediction:", prediction);
            console.log("Predicted Class:", predicted_class);  // No need for class_names here if you're using backend's response
            console.log("Confidence:", confidence);

            // Conditional logic based on predicted class and confidence
            if (confidence > 70 && predicted_class === "Container") {
                alert("You can now donate the item!");
            } else {
                alert("The item does not meet the donation criteria.");
            }

        } catch (err) {
            console.error("Error during prediction:", err);
            alert("An error occurred while processing your request. Please try again.");
        }
    };



    // from chatgpt to be able to update the address prompt: why is the address not saving (added my code) 18/01/2025
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

    // Chatgpt Prompt: (image of my code) I want everything to reset, however the file still says the name of the previous file? 19/01/2025

    const fileInputRef = useRef(null); // Add a ref for the file input

    const donate = async (e) => {

        e.preventDefault();

        const data = {
            image: baseSixtyFour,
            description: description,
            portionSize: portionSize,
            address: address,
            longitude: longitude,
            latitude: latitude
        }


        try {
            const res = await axios.post("http://localhost:8000/donate", data)
            if (res.data.message === "Donated") {
                alert("The donation has been made");
                setFile("");
                setFileURL("");
                setPercentage(0);
                setAddress("");
                setDescription("");
                setPortionSize(0);
                setBaseSixtyFour("")
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
            <div id="donateTitleDiv"><h1 id="donateTitle">Donate</h1></div>

            <div id="donationBox">

                <div id="selectDonationImage">
                    {/* to remove select file button https://stackoverflow.com/questions/61468441/how-to-change-default-text-in-input-type-file-in-reactjs 21/01/2025 */}
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
                        <button id="scanImage" disabled={disableInput} onClick={submit}>Scan</button>
                    </div>

                    <div id="imageAndPercentage">
                        <img id="selectedImage" src={fileURL} alt="selected file" />
                        <br></br>
                        <p>The Image is {percentage} {predictedClass}</p>
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
                            {disableInput === true ? <input className="donationInputs" id="addressInput" placeholder="Enter address here" disabled={disableInput} />
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
                    {percentage > 70 && predictedClass === "container" ? <button id="donateButton" disabled={false} onClick={donate}>Donate</button>
                        : <button id="donateButton" disabled={true} onClick={donate}>Donate</button>}
                </div>


            </div>
        </>
    );
}

export default Donate;


