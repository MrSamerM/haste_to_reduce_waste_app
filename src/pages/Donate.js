import React from "react";
import '../styling/Donate.css'
import { useState, useEffect } from "react";

// https://www.geeksforgeeks.org/how-to-upload-image-and-preview-it-using-reactjs/ do display image 15/01/25
// chatGPT [pasted my code to see why the if statements where not working] 16/01/21. Used for file type, FileURL useState and change function.

function Donate() {

    const [file, setFile] = useState("");
    const [fileURL, setFileURL] = useState("");
    const [enableInput, setEnableInput] = useState(false);
    const [percentage, setPercentage] = useState(0);
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
                    <button onClick={submit}>Scan</button>
                    <p>The Image is {percentage}</p>
                    <input type="text" id="address" value={address} onChange={(evt) => setAddress(evt.target.value)} />
                </div>
            }

        </>
    );
}

export default Donate;