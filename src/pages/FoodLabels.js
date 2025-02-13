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
    const [education, setEducation] = useState(false);
    const [educationState, setEducationState] = useState(0);
    const [displayScore, setDisplayScore] = useState(false);
    const [quizScore, setQuizScore] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [answerSelected, setAnswerSelected] = useState(null);
    const [wrongAnswers, setWrongAnswers] = useState([]);


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

            for (let i = 0; i < result.length; i++) {

                if (result[i].toUpperCase() === "BEFORE") {
                    result.unshift(result[i]);
                }

                else if (result[i].toUpperCase() === "BEST") {
                    result.unshift(result[i]);
                }
            }

            if (result[0].toUpperCase() === "BEFORE" && result[1].toUpperCase() === "BEST") {
                // result[0] = result[1];
                // result[1] = result[0];
                result.swap(result[0], result[1]);
                const joining = result.slice(0, 2);
                const newString = joining.join(" ");
                result.splice(0, 2);
                result.unshift(newString);
                console.log(newString)
                console.log(result);
            }

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

    useEffect(() => {
        const addPoints = async () => {
            try {
                if (quizScore === 3) {
                    const response = await axios.post("http://localhost:8000/addPoints");
                    if (response.data.message === "Added") {
                        console.log("Points were added")
                    }
                }
            } catch (error) {
                console.error("Can't send the points", error);
            }
        };

        addPoints();

    }, [quizScore]);

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
                    <div id="educationBox1">
                        <button className="skipButton" onClick={skipState}>Skip  →</button>
                        <div className="educationDonateTitleDiv"><h1 className="educationDonateTitle">Why Donate?</h1></div>
                        <div className="boxOfEverything">
                            <div className="theContents">
                                <p className="paragraphDetails">
                                    Donating is a way that individuals can get rid of exess food or
                                    food that it about to expire. The method of donating is very well know
                                    but missed opportunities are assisting waste to good preishable foods
                                </p>
                                <div><img className="suitableContainers" src={donationImage} alt="Image of foods in containers" /></div>
                                {/* image from https://www.pexels.com/photo/meals-in-boxed-prepared-for-box-diet-12050951/ 10/02/2025*/}
                            </div>
                        </div>

                        <div className="boxOfEverything">
                            <div className="theContents">
                                <p className="paragraphDetails">
                                    The right chart shows the progress that our app is making
                                    Based on the number of portions we were able to help distibute
                                    we were able to prevent 1000 tonnes of food waste
                                </p>
                                <div id="barChart">
                                    <Bar data={chartData} options={chartOptions}></Bar>
                                </div>
                            </div>
                        </div>

                        <div className="boxOfEverything">

                            <div className="theContents">

                                <p className="paragraphDetails">
                                    Facts: Did you know that 5000 tonnes of exess food was wasted <br></br><br></br>
                                    Facts: Did you know that the food wasted contributes to environmental issues like global warming <br></br><br></br>
                                    Facts: Did you know that we lose over 20 million pounds in the UK due to food wasted
                                </p>
                                <div><p id="didYouKnow">DID<br></br>YOU<br></br>KNOW</p></div>
                            </div>
                        </div>

                        <button className="nextButton" onClick={changeState}>Next</button>
                    </div>
                }
                {educationState === 1 &&
                    <div id="entireSecondBox">
                        <button className="skipButton" onClick={skipState}>Skip  →</button>
                        <div className="educationDonateTitleDiv"><h1 className="educationDonateTitle">Suitable Containers</h1></div>
                        <div className="interactP"><p id="interactionParagraph">
                            Specification for each containers is a must. There are some container that are not
                            suitbale to use when donating food, as it will contribute further to food waste.
                            Hover and learn the different types of container that are suitable to gain an uderstanding</p></div>
                        <div id="educationBox2">
                            <br></br>
                            <div id="firstHalf">
                                <div className="suitableImages">
                                    <img className="appropriateContainers" src={suitableContainer1} alt="Aluminium container" />
                                    <div className="textOverlay">
                                        <h4>Aluminium Container</h4><br></br>
                                        <p>
                                            This containers are suitable for
                                            hot food, especially for hot food,
                                            and are able to contain heat and store food
                                            properly without any affect
                                        </p>
                                    </div>
                                </div>

                                <div className="suitableImages">
                                    <img className="appropriateContainers" src={suitableContainer2} alt="Plastic container" />
                                    <div className="textOverlay">
                                        <h4>Plastic container</h4><br></br>
                                        <p>
                                            This containers are suitable for
                                            hot food, especially for hot food,
                                            and are able to contain heat and store food
                                            properly without any affect
                                        </p>
                                    </div>
                                </div>

                                <div className="suitableImages">
                                    <img className="appropriateContainers" src={suitableContainer3} alt="Takeaway containers" />
                                    <div className="textOverlay">
                                        <h4>Takeaway containers</h4><br></br>
                                        <p>
                                            This containers are suitable for
                                            hot food, especially for hot food,
                                            and are able to contain heat and store food
                                            properly without any affect
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div id="secondHalf">
                                <div className="suitableImages">
                                    <img className="appropriateContainers" src={nonSuitableContainer1} alt="Foam container" />
                                    {/* image generated from dream.ai prompt: white foam container takeaway box  11/02/2025 */}
                                    <div className="textOverlay">
                                        <h4>Foam container</h4><br></br>
                                        <p>
                                            This containers is not suitbale to
                                            store food. This is because it can
                                            possibly mix the food with chemical, and thus
                                            affect the food, which is not safe to consume
                                            thus leaving it to waste
                                        </p>
                                    </div>
                                </div>

                                <div className="suitableImages">
                                    <img className="appropriateContainers" src={nonSuitableContainer2} alt="Cardboard container" />
                                    {/* Photo by Abdulrhman Alkady: https://www.pexels.com/photo/photo-of-burger-and-fries-in-a-takeout-box-8228281/ */}
                                    <div className="textOverlay">
                                        <h4>Cardboard container</h4><br></br>
                                        <p>
                                            This containers is not suitbale to
                                            store food. This is because it can
                                            possibly mix the food with chemical, and thus
                                            affect the food, which is not safe to consume
                                            thus leaving it to waste
                                        </p>
                                    </div>
                                </div>

                                <div className="suitableImages">
                                    <img className="appropriateContainers" src={nonSuitableContainer3} alt="Polythene bags" />
                                    {/* Photo by Anna Shvets: https://www.pexels.com/photo/fruits-in-a-plastic-bag-3645504/ */}
                                    <div className="textOverlay">
                                        <h4>Polythene bags</h4><br></br>
                                        <p>
                                            This containers is not suitbale to
                                            store food. This is because it can
                                            possibly mix the food with chemical, and thus
                                            affect the food, which is not safe to consume
                                            thus leaving it to waste
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="nextButton" onClick={changeState}>Next</button>
                    </div>
                }

                {/* https://www.youtube.com/watch?v=jE2Ivb7dlSQ&t=986s recieved some assistant 09/02/2025 */}

                {educationState === 2 &&
                    <div id="educationBox3">
                        <button className="skipButton" onClick={skipState}>Skip  →</button>
                        <div className="educationDonateTitleDiv"><h1 className="educationDonateTitle">Quiz</h1></div>

                        {displayScore === false ? (
                            <>
                                <div id="quizQuestion"><p>{questions[currentQuestion].question}</p></div>
                                <div id="quizSelections">

                                    {questions[currentQuestion].options.map((option, index) => (

                                        <button className={`answers ${answerSelected === index ? "selected" : ""}`} key={option} onClick={() => handleSelection(option, index)}>{option}</button>
                                        // Used chatGPT to change colour of selected button: 
                                        // prompt 1: I have this quiz feature where users select the answer they think is correct. the css is on clikc the button changes color,
                                        // But the thing is now, lets say the user want to swtch answeres, the colour of the previous selection will still be there. What can I do
                                        // prompt 2: I am using react
                                    ))}

                                </div>
                            </>) : (
                            <div id="finalQuizPage">
                                <div id="finalScore"> Score: {quizScore}/3</div><br></br>
                                {quizScore === 3 ?
                                    <>
                                        <p className="resultMessage">Congratulations You Got Full Marks<br></br>50 Points added</p><br></br>
                                        <img id="points" src={points} alt="gold points coin" />
                                        {/* image generated from dream.ai prompt: round circle yellow animated coin with P in the middle 12/02/2025 */}

                                    </>
                                    :
                                    <>
                                        <p className="resultMessage">Well done for attempting the quiz provided<br></br>try again and beat your score to gain points<br></br>
                                            Learn from the questions you got wrong bellow</p>
                                        <div>
                                            {wrongAnswers.map((wrongAnswer) => (
                                                <div className="wrongAnswers">{wrongAnswer}</div>
                                            ))}
                                        </div>
                                    </>
                                }
                            </div>
                        )}

                        <button className="nextButton" onClick={changeState}>Next</button>
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
                </div>)
    );
}

export default FoodLabels;