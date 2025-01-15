import React from "react";
import '../styling/Donate.css'
import { useState, useEffect } from "react";

// https://www.geeksforgeeks.org/how-to-upload-image-and-preview-it-using-reactjs/ do display image 15/01/25

function Donate() {

    const [file, setFile] = useState("");
    const [enableInput, setEnableInput] = useState(false);
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (file[0].endsWith('.png') || file[0].endsWith('.jpg') || file[0].endsWith('.gif')) {
            setEnableInput(true);
            console.log("true");
            console.log(file);
        }
        else {
            setEnableInput(false);
            console.log("false");
            console.log(file);

        }
    }, []);

    return (
        <>
            <h1>Donate</h1>

            <div>
                <input type="file" id="imageFile" onChange={(evt) => setFile(URL.createObjectURL(evt.target.files[0]))} />
                <img src={file} />
            </div>
            {enableInput === false ? null :
                <div>
                    <input type="text" id="address" value={address} onChange={(evt) => setAddress(evt.target.value)} />
                </div>
            }

        </>
    );
}

export default Donate;