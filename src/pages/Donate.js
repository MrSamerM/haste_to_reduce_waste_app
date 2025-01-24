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
    const [disableScanner, setDisableScanner] = useState(true);
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
            // POST request to backend with credentials (if needed)
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
                    {percentage > 70 && predictedClass === "a Container" ? <button id="donateButton" disabled={false} onClick={donate}>Donate</button>
                        : <button id="donateButton" disabled={true} onClick={donate}>Donate</button>}
                </div>


            </div>
        </>
    );
}

export default Donate;


// import { useState, useEffect } from "react";
// import axios from "axios";

// function Donate() {
//     const [data, setData] = useState("");
//     const [val, setVal] = useState("Upload image to predict");
//     const [filename, setFilename] = useState("No file Uploaded");
//     const [file, setFile] = useState(null);

//     useEffect(() => {
//         // Fetching the home message from the backend
//         fetch("http://localhost:5000")
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log(data);
//                 setData(data.message);
//             })
//             .catch((error) => console.error("Error fetching home message:", error));
//     }, []);

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         if (!file) {
//             alert("Please upload a file first!");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             // POST request to backend with credentials (if needed)
//             const response = await axios.post("http://localhost:5000/upload", formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//                 withCredentials: true, // This is optional, depending on whether you need to send credentials with the request
//             });
//             console.log(response.data.message);
//             setVal(response.data.message);
//             alert("File uploaded and prediction made successfully!");
//         } catch (error) {
//             console.error("Error during file upload:", error);
//             alert("Error uploading file. Please try again.");
//         }
//     };

//     const handleFileUpload = (event) => {
//         const uploadedFile = event.target.files[0];
//         setFile(uploadedFile);
//         setFilename(uploadedFile ? uploadedFile.name : "No file Uploaded");
//     };

//     return (
//         <>
//             <h1 className="mt-[5rem] mb-4 text-3xl font-extrabold dark:text-indigo-800 md:text-5xl lg:text-6xl">
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r to-violet-600 from-blue-900">
//                     Machine Learning Model to
//                 </span>
//                 <br /> Detect Cats & Dogs
//             </h1>
//             <p className="text-lg font-normal text-white lg:text-xl">
//                 Upload the image file to detect.
//             </p>
//             <form onSubmit={handleSubmit}>
//                 <div className="flex w-full items-start justify-center bg-grey-lighter mb-5 mt-[5rem]">
//                     <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-blue-600">
//                         <svg
//                             className="w-8 h-8"
//                             fill="blue"
//                             xmlns="http://www.w3.org/2000/svg"
//                             viewBox="0 0 20 20"
//                         >
//                             <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
//                         </svg>
//                         <span className="mt-2 text-base leading-normal">Select a file</span>
//                         <input
//                             type="file"
//                             name="file"
//                             className="hidden"
//                             onChange={(e) => { setFile(e.target.files[0]); handleFileUpload(e) }}
//                         />
//                     </label>
//                 </div>
//                 <span className="text-white">File Uploaded: {filename}</span>

//                 <div className="flex items-center justify-center">
//                     <button
//                         className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5"
//                         type="submit"
//                     >
//                         PREDICT
//                     </button>
//                 </div>
//             </form>

//             <div className="mt-[5rem] mb-4 text-2xl">
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r to-violet-600 from-blue-900 font-black">
//                     Detected Image is: {val}
//                 </span>
//             </div>
//         </>
//     );
// }

// export default Donate;