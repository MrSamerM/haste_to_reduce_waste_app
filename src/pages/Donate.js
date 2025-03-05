import React from "react";
import '../styling/Donate.css'
import { useState, useEffect, useRef } from "react";
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

import suitableContainer1 from '../image/Aluminuim.jpg';
import suitableContainer2 from '../image/plasticContainer.jpg';
import suitableContainer3 from '../image/takeawayContainer.jpg';

import nonSuitableContainer1 from '../image/foamContainer.jpg';
import nonSuitableContainer2 from '../image/cardboardContainer.jpg';
import nonSuitableContainer3 from '../image/polytheneBag.jpg';

import points from '../image/points.PNG';


import donationImage from '../image/Donation.jpg';


import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend);


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
    const [education, setEducation] = useState(false);
    const [educationState, setEducationState] = useState(0);
    const [displayScore, setDisplayScore] = useState(false);
    const [quizScore, setQuizScore] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [foodPortion, setFoodPortion] = useState(0);
    const [answerSelected, setAnswerSelected] = useState(null);
    const [wrongAnswers, setWrongAnswers] = useState([]);



    const questions = [
        {
            question: "How many tonnes of food waste was prevented in 2024?",
            options: ["1000 tonnes", "5000 tonnes", "10,000 tonnes"],
            answer: "5000 tonnes"
        },
        {
            question: "Which container is a suitbale container to use when donating?",
            options: ["Aluminium container", "Foam container", "Polythene bag"],
            answer: "Aluminium container"
        },
        {
            question: "what does donating exess food do?",
            options: ["reduces global warming", "nothing, it does not matter", "saves up space in the fridge"],
            answer: "reduces global warming"
        }
    ]

    axios.defaults.withCredentials = true;


    const change = (evt) => {

        setPercentage(0);
        setAddress("");
        setDescription("");
        setPortionSize(0);
        setBaseSixtyFour("");
        setPredictedClass("");
        setDisableInput(true);
        setLongitude(0);
        setLatitude(0);

        setFile(evt.target.files[0]);
        setFileURL(URL.createObjectURL(evt.target.files[0]));
    }

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

    const effectRan = useRef(false);

    useEffect(() => {

        // Used chatGPT for the effectRan, because useEffect ran twice which messes with the value
        // prompt: Why is the use effect running twice. It is affecting my value

        if (effectRan.current) return;
        effectRan.current = true;

        const portionToTonne = async () => {
            try {
                let totalPortion = 0
                const response = await axios.get("http://localhost:8000/everyDonatedDonations")

                response.data.result.forEach((portion) => {
                    totalPortion += portion.portionSize;
                });

                const toTonne = (totalPortion * 75) / 1000000;
                console.log(toTonne);
                setFoodPortion(prevPortionSize => {
                    const newPortionSize = prevPortionSize + toTonne;
                    console.log("Updated portionSize:", newPortionSize);
                    return newPortionSize;
                });

            } catch (error) {
                console.error("Can't send the file", error);
            }

        };

        portionToTonne();

    }, []);

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
                window.location.reload();
            }


            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }

        } catch (e) {
            console.log("Error with submission", e)
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


    const chartData = {
        labels: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
        datasets: [
            {
                label: 'Food waste prevented per tonne',
                data: [5000, 10000, 5000, 5000, 5000, 5000, 6000, 7000, 8000, 5000, 6000],
                backgroundColor: '#61DFB0',
                color: '#000000'
            },
            {
                label: 'My App prevented per tonne',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, foodPortion],
                backgroundColor: 'red',
                color: '#000000'
            }
        ]

    }

    // Required chatGPT to change the colour of the labels
    // Prompt: Can I change the colour of the labels on the top. because it is grey right now
    // Prompt: how can I change the colour of the axes

    const chartOptions = {

        plugins: {
            legend: {
                labels: {
                    color: '#000000'
                }
            }
        },

        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: 'black'
                },
                grid: {
                    color: '#black'
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: 'black'
                },
                grid: {
                    color: '#black'
                }
            }
        }

    }

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

            </>)
            :
            (
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
                                    If the image is a container, then you can donate.<br></br>
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
                            {predictedClass === "a Container" ? <button id="donateButton" disabled={false} onClick={donate}>Donate</button>
                                : <button id="donateButton" disabled={true} onClick={donate}>Donate</button>}
                        </div>
                    </div>
                </>)
    );
}

export default Donate;