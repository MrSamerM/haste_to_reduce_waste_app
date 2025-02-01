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


    // https://stackoverflow.com/questions/7335075/compare-2-dates-in-format-dd-mm-yyyy-with-javascript-jquery By Maxx 31/01/2025
    // https://sentry.io/answers/how-to-insert-an-item-into-an-array-at-a-specific-index-using-javascript/ 01/02/2025 for .splice method

    function dateConvertion(date) {

        if (date.match(/\d{2} [A-Za-z]{3} \d{2,4}/)) {
            const parts = date.split(" ");

            if (parts[2].length === 2) {
                parts[2] = `20${parts[2]}`;
            }

            if (parts[1].toUpperCase() === "JAN") {
                parts[1] = 0
            }
            else if (parts[1].toUpperCase() === "FEB") {
                parts[1] = 1
            }
            else if (parts[1].toUpperCase() === "MAR") {
                parts[1] = 2
            }
            else if (parts[1].toUpperCase() === "APR") {
                parts[1] = 3
            }
            else if (parts[1].toUpperCase() === "MAY") {
                parts[1] = 4
            }
            else if (parts[1].toUpperCase() === "JUN") {
                parts[1] = 5
            }
            else if (parts[1].toUpperCase() === "JUL") {
                parts[1] = 6
            }
            else if (parts[1].toUpperCase() === "AUG") {
                parts[1] = 7
            }
            else if (parts[1].toUpperCase() === "SEP") {
                parts[1] = 8
            }
            else if (parts[1].toUpperCase() === "OCT") {
                parts[1] = 9
            }
            else if (parts[1].toUpperCase() === "NOV") {
                parts[1] = 10
            }
            else if (parts[1].toUpperCase() === "DEC") {
                parts[1] = 11
            }
            const newDate = new Date(parts[1] + "/" + parts[0] + "/" + parts[2])
            return newDate.getTime();
        }

        else if (date.match(/\d{2}\/\d{2}\/\d{2,4}/)) {
            const parts = date.split("/");
            // this changes date to mm/dd/yy
            const newDate = new Date(parts[1] + "/" + parts[0] + "/" + parts[2]);
            return newDate.getTime();
        }

        else if (date.match(/\d{2}\-\d{2}\-\d{2,4}/)) {
            const parts = date.split("-");
            // this changes date to mm/dd/yy
            const newDate = new Date(parts[2], parts[0] - 1, parts[1]);
            return newDate.getTime();
        }

    }
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

            const result = response.data.text;
            console.log(result);
            // const newString = result.toString().replace(/[!.,]/g, ' ')

            // const pattern = /(BB|Expiry Date|BBE|EXP|BEST BY|Best By|Best Before|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{6}|\d{1,2}\-\d{1,2}\-\d{2,4}|\d{1,2}\.\d{1,2}\.\d{2,4}|\d{1,2} \d{1,2} \d{2,4}|\d{1,2}[a-zA-Z]{3}\\d{1,2} [a-zA-Z]{3} \d{2,4})/i;

            // const matches = [...newString.matchAll(pattern)];
            // const output = matches.map(match => match[0]).join(" ");
            // console.log(output);
            // const workArray = output.split(" ");
            // setText(output);
            // console.log(workArray);

            // const array = ["best before", "Expiry date", "10/09/2024", "10/10/2024"];
            const numberArray = [];

            const pattern1 = /(BB|Expiry Date|BBE|EXP|BEST BY|Best By|Best Before)/i;
            const pattern2 = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{6}|\d{1,2}\-\d{1,2}\-\d{2,4}|\d{1,2}\.\d{1,2}\.\d{2,4}|\d{1,2} \d{1,2} \d{2,4}|\d{1,2}[A-Za-z]{3}\d{1,2}|\d{1,2} [A-Za-z]{3} \d{2,4})/i;

            // filter method recieved by chatgpt, and remove gm, due to global issues with .test()
            //prompt: I have a array but I want to remove the elements that dont follow a regex pattern. 31/01/2025
            //prompt2: why is this not working (the method).

            const words = result.filter(element => pattern1.test(element));
            const dates = result.filter(element => pattern2.test(element));

            console.log("this is word", words);
            console.log("this is dates", dates);

            for (let i = 0; i < words.length; i++) {
                if (words[i].toUpperCase().charAt(0) === "B") {
                    numberArray.push({
                        word: words[i],
                        number: 1
                    });
                }
                else if (words[i].toUpperCase().charAt(0) === "E") {
                    numberArray.push({
                        word: words[i],
                        number: 3
                    });
                }

            }

            if (dates.length === 1) {
                numberArray.push({
                    word: dates[0],
                    number: 2
                });
            }
            else if (dateConvertion(dates[0]) < dateConvertion(dates[1])) {
                numberArray.push({
                    word: dates[1],
                    number: 4
                });

                numberArray.push({
                    word: dates[0],
                    number: 2
                });
            }

            else {
                numberArray.push({
                    word: dates[0],
                    number: 4
                });

                numberArray.push({
                    word: dates[1],
                    number: 2
                });
            }

            console.log("this is the array", numberArray);

            // https://www.geeksforgeeks.org/insertion-sort-algorithm/ for the insertion sort 31/01/2025
            // chatgpt to help with handling it with objects.
            // prompt1: what I am expecting is for the array to sort the complete object. Not the value of the number in the object. how can I do this (my code)
            // prompt2: questioning
            // prompt3: but how about if I want to use my one regardless

            for (let i = 1; i < numberArray.length; i++) {

                let key = numberArray[i];
                let j = i - 1;

                while (j >= 0 && numberArray[j].number > key.number) {
                    numberArray[j + 1] = numberArray[j];
                    j = j - 1;
                }

                numberArray[j + 1] = key;
            }

            console.log(numberArray)

            // https://www.betterhealth.vic.gov.au/health/healthyliving/food-use-by-and-best-before-dates 01/02/2025
            // https://www.webmd.com/diet/features/do-food-expiration-dates-matter 01/02/2025

            // Best before is the date where the food quality begins to lose, however if stored properly can be suitbale even after the date.
            // Use by date is the date where the food consumed has to be eaten before or on that date.
            // Expiry date is similar to use by date. Meaning it is not recommended to be conumed after the date. 

            if ((numberArray[0].word.toUpperCase().charAt(0) === ("E") || ("U"))) {
                console.log(`This means that you have until ${numberArray[1].word} to consume. That is it`)
            }
            else if ((numberArray[0].word.toUpperCase().charAt(0) === ("B"))) {
                console.log(`This means that you have until ${numberArray[1].word} to consume while it is closed, however if stored properly, and quality looks suitbale, it make extend over the date`)
            }

            else if ((numberArray[0].word.toUpperCase().charAt(0) === ("B" || "D")) && (numberArray[2].word.toUpperCase().charAt(0) === ("E") || ("U"))) {
                console.log(`This means that you have until ${numberArray[1].word} to consume while it is closed, however if stored properly, and quality looks suitbale, it make extend over the date`)
                console.log(`This means that you have until ${numberArray[3].word} to consume. That is it`)
            }


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
                        <button id="scanFoodLabelImage" disabled={false} onClick={submit}>Scan</button>
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