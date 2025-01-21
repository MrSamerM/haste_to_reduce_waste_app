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
    const [enableInput, setEnableInput] = useState(false);
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
            setEnableInput(true);
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
            setEnableInput(false);
            console.log("false");
            console.log(file);
        }
    }, [file]);

    const submit = async () => {

        const formData = new FormData();
        formData.append("image", file);


        try {
            const res = await axios.post('http://localhost:8000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const logits = res.data.prediction[0];

            // This is all ChatGPT
            //Main Prompt: i get 197 percent, is this correct? (my code)

            // Apply Softmax to get probabilities
            const softmax = (logits) => {
                const expValues = logits.map(x => Math.exp(x));  // Calculate e^logit for each logit
                const sum = expValues.reduce((acc, val) => acc + val, 0);  // Sum of all e^logits
                return expValues.map(x => x / sum);  // Normalize to get probabilities
            };

            const probabilities = softmax(logits);  // Get probabilities from logits

            // Determine the predicted class based on probabilities
            const predictedClass = probabilities[0] > probabilities[1] ? 'container' : 'not container';
            console.log(predictedClass);

            // Set the percentage based on the highest probability
            const confidence = Math.max(probabilities[0], probabilities[1]);
            setPercentage(confidence * 100);  // Valid percentage (0-100)
            setPredictedClass(predictedClass);


        } catch (err) {
            console.log("error", err);
        }
    }

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
                    <label htmlFor="imageFile" id="selectFileLabel">Click here to upload donation image: </label>
                    <input type="file" id="imageFile" onChange={change} ref={fileInputRef} />
                    <img id="selectedImage" src={fileURL} alt="selected file" />
                </div>


                {/* GeoApify API  https://apidocs.geoapify.com/samples/autocomplete/react-geoapify-geocoder-autocomplete/ 
            // https://www.npmjs.com/package/@geoapify/react-geocoder-autocomplete*/}


                {enableInput === false ? null :
                    <div id="allDonationResults">
                        <div id="aiResult">
                            <button onClick={submit}>Scan</button>
                            <p>The Image is {percentage} {predictedClass}</p>
                        </div>

                        <div id="donateDetails">

                            <div className="donationInputDiv">
                                <label className="donateInputLabels" htmlFor="descriptionInput">Description:</label>
                                <input type="text" id="descriptionInput" placeholder="Enter description here" value={description} onChange={(evt) => setDescription(evt.target.value)} />
                            </div>
                            <br></br>
                            <div className="donationInputDiv">
                                <label className="donateInputLabels" htmlFor="portionSizeInput">Portion Size:</label>
                                <input type="number" id="portionSizeInput" value={portionSize} onChange={(evt) => setPortionSize(evt.target.value)} />
                            </div>
                            <br></br>
                            <div className="donationInputDiv">
                                <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
                                    <GeoapifyGeocoderAutocomplete placeholder="Enter address here"
                                        lang='en'
                                        limit={5}
                                        value={address}
                                        onChange={updatedAddress}
                                        placeSelect={onPlaceSelect}
                                    />
                                </GeoapifyContext>
                            </div>
                        </div>
                        <br></br>
                        <button id="donateButton" onClick={donate}>Donate</button>
                    </div>
                }

            </div>
        </>
    );
}

export default Donate;