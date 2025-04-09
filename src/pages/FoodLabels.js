import React from "react";
import '../styling/FoodLabels.css'
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import England from '../image/England.jpg'
// Vesakaran, A.(2022). The Flag of the United Kingdom. Available at: 
// https://www.pexels.com/photo/the-flag-of-the-united-kingdom-13863652/ (Accessed: 7 March 2025).

import UseBy from '../image/UseByDate.jpg';
import BestBefore from '../image/BestBeforeDate.jpg';
import Expiry from '../image/ExpiryDate.jpg';

import star from '../image/star.PNG';
// OpenClipart-Vectors.(2013). star favorite bookmark 3d gold. Available at: 
// https://pixabay.com/vectors/star-favorite-bookmark-3d-gold-152151/ (Accessed: 7 March 2025).

import FullFoodLabel from '../image/FullFoodLabel.jpg';

function FoodLabels() {

    const [file, setFile] = useState("");
    const [fileURL, setFileURL] = useState("");
    // const [disableScanner, setDisableScanner] = useState(true);
    const [baseSixtyFour, setBaseSixtyFour] = useState("");
    const [text, setText] = useState("");
    const [education, setEducation] = useState(false);
    const [educationState, setEducationState] = useState(0);
    const [displayScore, setDisplayScore] = useState(false);
    const [quizScore, setQuizScore] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [answerSelected, setAnswerSelected] = useState(null);
    const [wrongAnswers, setWrongAnswers] = useState([]);

    const questions = [
        {
            question: "What does BB stand for?",
            options: ["Best By", "Best Before", "Better Before"],
            answer: "Best Before"
        },
        {
            question: "How many types of dates can there be in a food label?",
            options: ["1", "2", "3"],
            answer: "3"
        },
        {
            question: "What percentage of people understand food labels?",
            options: ["21%", "42%", "36%"],
            answer: "36%"
        }
    ]


    const change = (evt) => {
        setBaseSixtyFour("");
        setText("");
        setFile(evt.target.files[0]);
        setFileURL(URL.createObjectURL(evt.target.files[0]));
    }

    useEffect(() => {
        if (file.type === "image/png" || file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/jpg') {
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

            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);

            // bottom 4 lines from chatGPT to differentiate between 2 and 4 digits
            // prompt 1: no that is not my question. the last regex is {2,4} meaning it could be 18, or 2018, how can I differentiate them.
            // prompt 2:assume that it is always 20xx

            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);

            return newDate.getTime();
        }

        else if (date.match(/\d{2}\/\d{2}\/\d{2,4}/)) {
            const parts = date.split("/");
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);
            return newDate.getTime();
        }

        else if (date.match(/\d{2}\\\d{2}\\\d{2,4}/)) {
            const parts = date.split("'\'");
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);
            return newDate.getTime();
        }

        else if (date.match(/\d{2}\-\d{2}\-\d{2,4}/)) {
            const parts = date.split("-");
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);
            return newDate.getTime();
        }

        else if (date.match(/\d{2}\.\d{2}\.\d{2,4}/)) {
            const parts = date.split(".");
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);
            return newDate.getTime();
        }

        else if (date.match(/\d{2}\ \d{2}\ \d{2,4}/)) {
            const parts = date.split(" ");
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);
            return newDate.getTime();
        }

        else if (date.match(/\d{2}\/\d{2,4}/)) {
            const parts = date.split("/");
            const month = parseInt(parts[0], 10) - 1;
            const yearString = parts[1];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, 1);
            return newDate.getTime();
        }

        // const parts=date.match got from chatGPT 
        // prompt1: string.split () but 2 charcters
        // prompt2: No i mean every two characters it splits
        // prompt3:in js. there is a split method

        else if (date.match(/\d{6}/)) {
            const parts = date.match(/.{2}/g);
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);
            return newDate.getTime();
        }


        else {
            return null
        }

    }

    function dateConvertionToDate(date) {

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

            // 5 Lines below recieved from chatgpt to convert to date 22/02/2025
            // main prompt: why is this wrong (my code)
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);

            return `${String(newDate.getDate()).padStart(2, '0')}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()}`;
        }

        else if (date.match(/\d{2}\/\d{2}\/\d{2,4}/)) {
            const parts = date.split("/");
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);

            return `${String(newDate.getDate()).padStart(2, '0')}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()}`;
        }

        else if (date.match(/\d{2}\\\d{2}\\\d{2,4}/)) {
            const parts = date.split("'\'");
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);

            return `${String(newDate.getDate()).padStart(2, '0')}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()}`;
        }

        else if (date.match(/\d{2}\-\d{2}\-\d{2,4}/)) {
            const parts = date.split("-");
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);

            return `${String(newDate.getDate()).padStart(2, '0')}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()}`;
        }

        else if (date.match(/\d{2}\.\d{2}\.\d{2,4}/)) {
            const parts = date.split(".");
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);

            return `${String(newDate.getDate()).padStart(2, '0')}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()}`;
        }

        else if (date.match(/\d{2}\ \d{2}\ \d{2,4}/)) {
            const parts = date.split(" ");
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);

            return `${String(newDate.getDate()).padStart(2, '0')}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()}`;
        }

        else if (date.match(/\d{2}\/\d{2,4}/)) {
            const parts = date.split("/");
            const month = parseInt(parts[0], 10) - 1;
            const yearString = parts[1];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, 1);
            return `${String(newDate.getDate()).padStart(2, '0')}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()}`;
        }

        else if (date.match(/\d{6}/)) {
            const parts = date.match(/.{2}/g);
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const yearString = parts[2];
            const year = parseInt(yearString, 10);
            const fullYear = yearString.length === 2 ? 2000 + year : year;
            const newDate = new Date(fullYear, month, day);
            return `${String(newDate.getDate()).padStart(2, '0')}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()}`;
        }
        else {
            return null
        }

    }

    const fileInputRef = useRef(null);

    const submit = async (event) => {
        event.preventDefault();

        if (!file) {
            alert("You must add a label to recieve a response")
        }
        else {

            const formData = new FormData();
            formData.append("file", file);

            try {
                const timeStart = performance.now()

                const response = await axios.post("http://localhost:5000/text", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                });

                // https://stackoverflow.com/questions/65461724/how-can-i-remove-commas-or-whatever-from-within-a-string answered by munerik 30/01/2025

                let result = response.data.text;
                console.log(result);

                // Used chatGPT for bottom function 
                // Main Prompts 1:I want this for loop to loop through a array with strings. If it finds 'by', and the next is 'before' or vise versa, then put it in front. For example [hello, very, best, by] => will be [best, by, hello, very]. I want to do this with use by. However I can't because both best by, and use by have by in it. what should I do (My code)
                //Main Prompt 2: No you do not understand. I need to try and find the pairs either Best and By || By and Best || Best and Before || Before and Best || Use and By || By and Use, when these pairs are found, it does not mean they are next to each other, they could be very far a part, if they are found in the same array then I need to put them into the front

                result = result.map(word => word.replace(/[^a-zA-Z0-9\s\/\-\.]/g, "").toUpperCase());

                const targetPairs = [
                    ["BY", "BEST"],
                    ["BY", "USE"],
                    ["BEST", "BY"],
                    ["BEST", "USE"],
                    ["USE", "BY"],
                    ["USE", "BEST"],
                    ["BEFORE", "BEST"],
                    ["BEST", "BEFORE"]
                ];

                let pairs = [];

                for (let i = 0; i < targetPairs.length; i++) {
                    let pair = targetPairs[i];
                    let firstWord = pair[0];
                    let secondWord = pair[1];

                    let firstIndex = result.indexOf(firstWord);
                    let secondIndex = result.indexOf(secondWord, firstIndex + 1);

                    if (firstIndex !== -1 && secondIndex !== -1) {
                        pairs.push([firstWord, secondWord]);

                        result.splice(secondIndex, 1);
                        result.splice(firstIndex, 1);
                    }
                }

                result = [...pairs.flat(), ...result];

                console.log(result);


                if ((result[0] === "BEFORE" && result[1] === "BEST" ||
                    result[0] === "BEST" && result[1] === "BEFORE")) {
                    const newString = "Best Before";
                    result.splice(0, 2);
                    result.unshift(newString);
                    console.log(newString)
                    console.log(result);
                }
                else if ((result[0] === "BY" && result[1] === "BEST" ||
                    result[0] === "BEST" && result[1] === "BY")) {

                    const newString = "Best By";
                    result.splice(0, 2);
                    result.unshift(newString);
                    console.log(newString)
                    console.log(result);

                }

                else if ((result[0] === "USE" && result[1] === "BY") ||
                    (result[0] === "BY" && result[1] === "USE")) {
                    const newString = "Use By";
                    result.splice(0, 2);
                    result.unshift(newString);
                    console.log(newString)
                    console.log(result);
                }

                const numberArray = [];

                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp reference 26/01/2025
                // https://www.freecodecamp.org/news/regex-for-date-formats-what-is-the-regular-expression-for-matching-dates/
                // https://stackoverflow.com/questions/33017274/find-all-words-with-3-letters-with-regex
                // https://stackoverflow.com/questions/2951915/javascript-reg-ex-to-match-whole-word-only-bound-only-by-whitespace 
                // chatGPT i for case insensitivity, and matching by mapping Prompt: still a error (my pattern)

                const pattern1 = /(BB|Expiry Date|BBE|EXP|BEST BY|Best By|Best Before|Use By|Expiry)/i;
                const pattern2 = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{6}(?<=^\d{2}[01-9]{1}[0-9]{1}[0-9]{1})|\d{1,2}\-\d{1,2}\-\d{2,4}|\d{1,2}\.\d{1,2}\.\d{2,4}|\d{1,2} \d{1,2} \d{2,4}|\d{1,2}[A-Za-z]{3}\d{1,2}|\d{1,2} [A-Za-z]{3} \d{2,4}|\d{2}\/\d{2,4})/i;

                // filter method recieved by chatgpt, and remove gm, due to global issues with .test() 22/03/2025
                //prompt: I have this EXP 02/2027, why would it match in this regex (pattern 2)
                //prompt2: No, I want to remove EXP from it
                //prompt3: would this not work (old code)


                const words = result
                    .map(element => {
                        const match = element.match(pattern1);
                        return match ? match[0] : null;
                    })
                    .filter(Boolean);


                const dates = result
                    .map(element => {
                        const match = element.match(pattern2);
                        return match ? match[0] : null;
                    })
                    .filter(Boolean);

                if (words.length === 0 || dates.length === 0) {
                    console.log(`The image provided was not sufficient. The reason could be because the image was not clear enough, of the dates were not displayed, please find the dates and take clearer picture`);
                    setText(`The image provided was not sufficient. The reason could be because the image was not clear enough, of the dates were not displayed, please find the dates and take clearer picture`);
                    const timeEnd = performance.now()
                    console.log(((timeEnd - timeStart).toFixed(4)) / 1000 + ' Seconds')
                    return;
                }


                console.log("this is word", words);
                console.log("this is dates", dates);

                for (let i = 0; i < words.length; i++) {
                    // if best before or use by date
                    if (words[i].toUpperCase().charAt(0) === "B" || words[i].toUpperCase().charAt(0) === "U") {
                        numberArray.push({
                            word: words[i],
                            number: 1
                        });
                    }

                    // if expiry date only

                    else if ((words[i].toUpperCase().charAt(0) !== "B" || words[i].toUpperCase().charAt(0) !== "U") && (words[i].toUpperCase().charAt(0) === "E")) {
                        numberArray.push({
                            word: words[i],
                            number: 1
                        });
                    }

                    // if expiry date with a use by / best before date.
                    else if (words[i].toUpperCase().charAt(0) === "E") {
                        numberArray.push({
                            word: words[i],
                            number: 3
                        });
                    }

                }

                // if there are two dates, the latest date is the expiry date, words.length is for expiry date
                if (dates.length === 2 && words.length === 1) {
                    if (dateConvertion(dates[0]) < dateConvertion(dates[1])) {
                        numberArray.push({
                            word: dates[1],
                            number: 4
                        });
                    }
                }

                else if (dates.length === 1) {
                    numberArray.push({
                        word: dates[0],
                        number: 2
                    });
                }

                // if there are two dates, and two words

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

                if ((numberArray[0].word.toUpperCase().charAt(0) === ("E") || numberArray[0].word.toUpperCase().charAt(0) === ("U"))) {
                    console.log(`This means that you have until ${dateConvertionToDate(numberArray[1].word)} to consume. That is it`);
                    setText(`Based on the image that was posted, the label means that you have until ${dateConvertionToDate(numberArray[1].word)} to consume, it should not be consumed if over this date `);
                }
                else if ((numberArray[0].word.toUpperCase().charAt(0) === ("B"))) {
                    console.log(`This means that you have until ${dateConvertionToDate(numberArray[1].word)} to consume while it is closed, however if stored properly, and quality looks suitbale, it can extend over the date`);
                    setText(`This means that you have until ${dateConvertionToDate(numberArray[1].word)} to consume while it is closed, however if stored properly, and quality looks suitbale, it can extend over the date`);

                }

                else if ((numberArray[0].word.toUpperCase().charAt(0) === "B" || numberArray[0].word.toUpperCase().charAt(0) === "D") && (numberArray[2].word.toUpperCase().charAt(0) === ("E") || numberArray[2].word.toUpperCase().charAt(0) === ("U"))) {
                    console.log(`This means that you have until ${dateConvertionToDate(numberArray[1].word)} to consume while it is closed, however if stored properly, and quality looks suitbale, it may extend over the date`)
                    console.log(`This means that you have until ${dateConvertionToDate(numberArray[3].word)} to consume. That is it`)
                    setText(`This means that you have until ${dateConvertionToDate(numberArray[1].word)} to consume while it is closed, however if stored properly, and quality looks suitbale, it make extend over the date`,
                        `This means that you have until ${dateConvertionToDate(numberArray[3].word)} to consume. That is it`
                    );
                }
                else {
                    console.log(`The image provided was not sufficient. The reason could be because the image was not clear enough, of the dates were not displayed, please find the dates and take clearer picture`);
                    setText(`The image provided was not sufficient. The reason could be because the image was not clear enough, of the dates were not displayed, please find the dates and take clearer picture`);
                }
                const timeEnd2 = performance.now()
                console.log(((timeEnd2 - timeStart).toFixed(4)) / 1000 + ' Seconds')

            } catch (error) {
                console.error("Can't send the file", error);
            }
        }
    }

    const changeState = (() => {
        if (educationState < 2) {
            setEducationState(recentState => recentState + 1);
        }
        else if (displayScore === true) {
            setEducation(true);
            setDisplayScore(false);
        }

        else if (educationState === 2) {
            if (selectedAnswer === "") {
                alert("Must select a answer first")
            }
            // The bottom else if, received assistance from chatGPT due to quiz store not updating correctly
            // prompt 1: (Code) why does this code give me the incorrect score at the end. if I get all of them correct, the score does not show 3/3
            // prompt 2: It still shows 2/3

            else if (currentQuestion >= 2) {
                if (selectedAnswer === questions[currentQuestion].answer) {
                    setQuizScore(prevScore => prevScore + 1);
                }
                else if (selectedAnswer !== questions[currentQuestion].answer) {
                    setWrongAnswers(prevWrongAnswers => [...prevWrongAnswers, questions[currentQuestion].question]);
                }
                setDisplayScore(true);
            }
            else if (selectedAnswer === questions[currentQuestion].answer) {
                setQuizScore(currentQuizScore => currentQuizScore + 1);
                setCurrentQuestion(prevQuestion => prevQuestion + 1);
                setSelectedAnswer("")
                setAnswerSelected(null);
            }
            else {
                setCurrentQuestion(prevQuestion => prevQuestion + 1);
                setSelectedAnswer("");
                setAnswerSelected(null);
                setWrongAnswers(wrongAnswers => [...wrongAnswers, questions[currentQuestion].question])
            }
        }
        else {
            setEducation(true);
        }
    });

    const skipState = (() => {
        setEducation(true);

    })

    const handleSelection = ((answerSelected, index) => {

        setSelectedAnswer(answerSelected);
        setAnswerSelected(index);

    })

    return (
        education === false ?
            (<>
                {educationState === 0 &&
                    <div id="educationBox1Label">
                        <button className="skipButtonLabel" onClick={skipState}>Skip  →</button>
                        <div className="educationTitleDivLabel"><h1 className="educationTitleLabel">What are Labels?</h1></div>
                        <div className="boxOfEverythingLabel">
                            <div className="theContentsLabel">
                                <p className="paragraphDetailsLabel">
                                    Labels on a food package is a description of the everything
                                    about the food, this includes ingridients, allergy warning,
                                    nutritional description, and finally dates of food.
                                </p>
                                <div><img className="suitableContainersLabel" src={FullFoodLabel} alt="Image a food label" /></div>
                            </div>
                        </div>

                        <div className="boxOfEverythingLabel">
                            <div className="theContentsLabel">
                                <p className="paragraphDetailsLabel">
                                    It was stated by <a href="https://www.edinburghnews.scotsman.com/must-read/over-a-third-of-brits-struggle-to-understand-food-labels-according-to-research-4935330">Edinburgh News </a>
                                    that around 36% of british people struggle to identify
                                    the food labels. This is due to lack of knowledge on what they mean, and
                                    how to deal with them.
                                </p>
                                <div><img className="suitableContainersLabel" src={England} alt="Image of UK" /></div>
                            </div>
                        </div>

                        <div className="boxOfEverythingLabel">

                            <div className="theContentsLabel">

                                <p className="paragraphDetailsLabel">
                                    Facts: Did you know that there are 3 types of dates that can be displayed in a package <br></br><br></br>
                                    Facts: Did you know that bb stands for best before, and EXP stands for expiry date <br></br><br></br>
                                    Facts: Did you know that <a href="https://www.weforum.org/stories/2022/08/waitrose-scrap-best-before-dates-cut-food-waste/">WRAP</a> found the 70% of 6.6 million tonnes of food every year was consumable.
                                </p>
                                <div><p id="didYouKnowLabel">DID<br></br>YOU<br></br>KNOW</p></div>
                            </div>
                        </div>

                        <button className="nextButtonLabel" onClick={changeState}>Next</button>
                    </div>
                }
                {educationState === 1 &&
                    <div id="entireSecondBoxLabel">
                        <button className="skipButtonLabel" onClick={skipState}>Skip  →</button>
                        <div className="educationTitleDivLabel"><h1 className="educationTitleLabel">Suitable Containers</h1></div>
                        <div className="interactPLabel"><p id="interactionParagraphLabel">
                            There are three main dates that you should look for on the food labels.<br></br> <br></br>
                            1. Best before date, hover over the first row to see more <br></br> <br></br>
                            2. Use by date, hover over the second row to see more<br></br> <br></br>
                            3. Expiry date, hover over the third row to see more
                        </p></div>

                        <div id="educationBox2Label">
                            <br></br>
                            <div id="firstHalfLabel">
                                <div className="suitableImagesLabel">
                                    <img className="appropriateContainersLabel" src={UseBy} alt="Aluminium container" />
                                    <div className="textOverlayLabel">
                                        <h4>Use By Date</h4><br></br>
                                        <p>
                                            Use By Date is where the food consumed
                                            has to be eaten before or on that date.
                                            It should not be consumed pass that date
                                            due to some risks that it may come with
                                        </p>
                                    </div>
                                </div>

                                <div className="suitableImagesLabel">
                                    <img className="appropriateContainersLabel" src={BestBefore} alt="Plastic container" />
                                    <div className="textOverlayLabel">
                                        <h4>Best Before Date</h4><br></br>
                                        <p>
                                            Best Before Date is the date where
                                            the food quality begins to lose, however
                                            if stored properly it can be suitbale even
                                            after the date by a couple of days, so do not be keen waste the item.
                                        </p>
                                    </div>
                                </div>

                                <div className="suitableImagesLabel">
                                    <img className="appropriateContainersLabel" src={Expiry} alt="Takeaway containers" />
                                    <div className="textOverlayLabel">
                                        <h4>Expiry Date</h4><br></br>
                                        <p>
                                            Expriy Date is where the food consumed
                                            has to be eaten before or on that date.
                                            It should not be consumed pass that date
                                            due to some risks that it may come with
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="nextButtonLabel" onClick={changeState}>Next</button>
                    </div>
                }

                {/* https://www.youtube.com/watch?v=jE2Ivb7dlSQ&t=986s recieved some assistant 09/02/2025 */}

                {educationState === 2 &&
                    <div id="educationBox3Label">
                        <button className="skipButtonLabel" onClick={skipState}>Skip  →</button>
                        <div className="educationTitleDivLabel"><h1 className="educationTitleLabel">Quiz</h1></div>

                        {displayScore === false ? (
                            <>
                                <div id="quizQuestionLabel"><p>{questions[currentQuestion].question}</p></div>
                                <div id="quizSelectionsLabel">

                                    {questions[currentQuestion].options.map((option, index) => (

                                        <button className={`answersLabel ${answerSelected === index ? "selectedLabel" : ""}`} key={option} onClick={() => handleSelection(option, index)}>{option}</button>
                                        // Used chatGPT to change colour of selected button: 
                                        // prompt 1: I have this quiz feature where users select the answer they think is correct. the css is on clikc the button changes color,
                                        // But the thing is now, lets say the user want to swtch answeres, the colour of the previous selection will still be there. What can I do
                                        // prompt 2: I am using react
                                    ))}

                                </div>
                            </>) : (
                            <div id="finalQuizPageLabel">
                                <div id="finalScoreLabel"> Score: {quizScore}/3</div><br></br>
                                {quizScore === 3 ?
                                    <>
                                        <p className="resultMessageLabel">Congratulations You Got Full Marks<br></br></p><br></br>
                                        <img id="pointsLabel" src={star} alt="gold points coin" />

                                    </>
                                    :
                                    <>
                                        <p className="resultMessageLabel">Well done for attempting the quiz provided<br></br>try again and beat your score<br></br>
                                            Learn from the questions you got wrong bellow</p>
                                        <div>
                                            {wrongAnswers.map((wrongAnswer) => (
                                                <div className="wrongAnswersLabel">{wrongAnswer}</div>
                                            ))}
                                        </div>
                                    </>
                                }
                            </div>
                        )}

                        <button className="nextButtonLabel" onClick={changeState}>Next</button>
                    </div>
                }

            </>) :
            (
                <div>
                    <div id="foodLabelTitleDiv"><h1 id="foodLabelTitle">Food Labels</h1></div>

                    <div id="foodLabelBox">
                        <div id="selectLabelImage">
                            <div id="preLabelImageInformation">
                                <label htmlFor="imageFoodLabelFile" id="selectFoodLabelFileLabel">Click here to upload label</label>
                                <input type="file" id="imageFoodLabelFile" onChange={change} ref={fileInputRef} />

                                <p id="imageFoodLabelRequirement">
                                    The image must be a .png, jpeg, jpg, or gif file.<br></br>
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
                </div>)
    );
}

export default FoodLabels;