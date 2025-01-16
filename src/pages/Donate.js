import React from "react";
import '../styling/Donate.css'
import { useState, useEffect } from "react";

// https://www.geeksforgeeks.org/how-to-upload-image-and-preview-it-using-reactjs/ do display image 15/01/25
// chatGPT [pasted my code to see why the if statements where not working] 16/01/21. Used for file type, FileURL useState and change function.

function Donate() {

    const [file, setFile] = useState("");
    const [fileURL, setFileURL] = useState("");
    const [enableInput, setEnableInput] = useState(false);
    const [address, setAddress] = useState("");

    const change = (evt) => {
        setFile(evt.target.files[0]);
        setFileURL(URL.createObjectURL(evt.target.files[0]));
    }

    useEffect(() => {
        if (file.type === "image/png" || file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/jpg') {
            setEnableInput(true);
            console.log("true");
            console.log(file);
        }
        else {
            setEnableInput(false);
            console.log("false");
            console.log(file);

        }
    }, [file]);

    return (
        <>
            <h1>Donate</h1>

            <div>
                <input type="file" id="imageFile" onChange={change} />
                <img id="selectedImage" src={fileURL} alt="selected file" />
            </div>
            {/* add code that would use the python ai model, if container then display the inputs, else reselect image */}

            {/* Change this to a button called scan for suitable container */}

            {enableInput === false ? null :
                <div>
                    <input type="text" id="address" value={address} onChange={(evt) => setAddress(evt.target.value)} />
                </div>
            }

        </>
    );
}

export default Donate;