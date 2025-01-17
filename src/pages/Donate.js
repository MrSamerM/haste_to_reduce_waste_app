import React from "react";
import '../styling/Donate.css'
import { useState, useEffect } from "react";
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'
import axios from 'axios';



// https://www.geeksforgeeks.org/how-to-upload-image-and-preview-it-using-reactjs/ do display image 15/01/25
// chatGPT [pasted my code to see why the if statements where not working] 16/01/21. Used for file type, FileURL useState and change function.

function Donate() {

    const [file, setFile] = useState("");
    const [fileURL, setFileURL] = useState("");
    const [enableInput, setEnableInput] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [portionSize, setPortionSize] = useState(0);
    const [baseSixtyFour, setBaseSixtyFour] = useState("");

    const change = (evt) => {
        setFile(evt.target.files[0]);
        setFileURL(URL.createObjectURL(evt.target.files[0]));

        const base = new FileReader();
        setBaseSixtyFour(base.result)
        base.readAsDataURL(evt.target.files[0]);
        console.log(baseSixtyFour);

    }




    useEffect(() => {
        if (file.type === "image/png" || file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/jpg') {
            setEnableInput(true);
            console.log("true");

        }
        else {
            setEnableInput(false);
            console.log("false");
            console.log(file);

        }
    }, [file]);

    const submit = async () => {

        const formData = new FormData();
        formData.append("image", fileURL);

        try {
            const res = await axios.post('http://localhost:8000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPercentage(res.data);

        } catch (err) {
            console.log("error", err);
        }
    }

    const onPlaceSelect = (evt) => {

        if (address === "") {
            setAddress("");
        }
    }

    const donate = async (e) => {

        e.preventDefault();

        const data = {
            image: fileURL,
            description: description,
            portionSize: portionSize,
            address: address,
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
            }

        } catch (e) {
            console.log("Error with submission", e)
        }

    }

    return (
        <>
            <h1>Donate</h1>

            <div>
                <input type="file" id="imageFile" onChange={change} />
                <img id="selectedImage" src={fileURL} alt="selected file" />
            </div>
            {/* add code that would use the python ai model, if container then display the inputs, else reselect image */}

            {/* Change this to a button called scan for suitable container */}

            {/* GeoApify API  https://apidocs.geoapify.com/samples/autocomplete/react-geoapify-geocoder-autocomplete/ 
            // https://www.npmjs.com/package/@geoapify/react-geocoder-autocomplete*/}


            {enableInput === false ? null :
                <div>
                    <button onClick={submit}>Scan</button>
                    <p>The Image is {percentage}</p>

                    <div className="donationInputs">
                        <label htmlFor="descriptionInput">Description:</label>
                        <input type="text" id="descriptionInput" placeholder="Enter description here" value={description} onChange={(evt) => setDescription(evt.target.value)} />
                    </div>
                    <br></br>
                    <div className="donationInputs">
                        <label htmlFor="portionSizeInput">Portion Size:</label>
                        <input type="number" id="portionSizeInput" value={portionSize} onChange={(evt) => setPortionSize(evt.target.value)} />
                    </div>
                    <br></br>
                    <div className="donationInputs">
                        <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
                            <GeoapifyGeocoderAutocomplete placeholder="Enter address here"
                                lang='en'
                                limit={5}
                                value={address}
                                placeSelect={onPlaceSelect}
                            />
                        </GeoapifyContext>
                    </div>
                    <br></br>
                    <button id="donateButton" onClick={donate}>Donate</button>
                </div>
            }

        </>
    );
}

export default Donate;