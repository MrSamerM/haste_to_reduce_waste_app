import React from "react";
import '../styling/FoodLabels.css'
import { useState, useEffect, useRef } from "react";
// import Tesseract from 'tesseract.js';
import axios from "axios";




function FoodLabels() {

    const [file, setFile] = useState("");
    const [fileURL, setFileURL] = useState("");
    const [disableScanner, setDisableScanner] = useState(true);
    const [baseSixtyFour, setBaseSixtyFour] = useState("");
    const [text, setText] = useState("");
    const [recievedString, setRecievedString] = useState("");


    const change = (evt) => {
        setBaseSixtyFour("");
        setText("");
        setFile(evt.target.files[0]);
        setFileURL(URL.createObjectURL(evt.target.files[0]));
    }

    useEffect(() => {
        if (file.type === "image/png" || file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/jpg') {
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
    }, [file]);


    const fileInputRef = useRef(null);

    const submit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/text", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            // https://stackoverflow.com/questions/65461724/how-can-i-remove-commas-or-whatever-from-within-a-string answered by munerik 30/01/2025

            const result = response.data.text[0];
            const newString = result.toString().replace(/[!.,]/g, ' ')

            const pattern = /(BB|Expiry Date|BBE|EXP|Best Before|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{6}|\d{1,2}\-\d{1,2}\-\d{2,4}|\d{1,2}\.\d{1,2}\.\d{2,4}|\d{1,2}\ \d{1,2}\ \d{2,4}|\d{1,2}[a-zA-Z]{3}\d{2,4})/gim;

            const matches = [...newString.matchAll(pattern)];
            const output = matches.map(match => match[0]).join(" ");
            setText(output);
            console.log(output);
        } catch (error) {
            console.error("Can't send the file", error);
        };

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp reference 26/01/2025
        // https://www.freecodecamp.org/news/regex-for-date-formats-what-is-the-regular-expression-for-matching-dates/
        // https://stackoverflow.com/questions/33017274/find-all-words-with-3-letters-with-regex
        // https://stackoverflow.com/questions/2951915/javascript-reg-ex-to-match-whole-word-only-bound-only-by-whitespace 
        // chatGPT about gim at the end, i for case insensitivity, and matching by mapping Prompt: still a error (my pattern)


    };

    return (
        <div>
            <div id="foodLabelTitleDiv"><h1 id="foodLabelTitle">Food Labels</h1></div>

            <div id="foodLabelBox">
                <div id="selectLabelImage">
                    <div id="preLabelImageInformation">
                        <label htmlFor="imageFoodLabelFile" id="selectFoodLabelFileLabel">Click here to upload label</label>
                        <input type="file" id="imageFoodLabelFile" onChange={change} ref={fileInputRef} />

                        <p id="imageFoodLabelRequirement">
                            The image must be a .png, jpeg, jpg, of gif file.<br></br>
                            This is to allow you to press scan to scan the image.<br></br>
                        </p>
                        <button id="scanFoodLabelImage" disabled={disableScanner} onClick={submit}>Scan</button>
                    </div>

                    <div id="foodLabelImage">
                        <img id="selectedFoodLabelImage" src={fileURL} alt="selected file" />
                    </div>
                </div>

                <div id="foodLabelDetails">
                    <textarea id="textArea" value={text} readOnly></textarea>
                </div>


            </div>

        </div>
    );
}

export default FoodLabels;