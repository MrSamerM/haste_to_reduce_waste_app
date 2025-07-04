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

import star from '../image/star.PNG';

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
    const [predictedClass, setPredictedClass] = useState(""); // State for predicted class Change after test
    const [education, setEducation] = useState(false); //Change after test
    const [educationState, setEducationState] = useState(0);
    const [displayScore, setDisplayScore] = useState(false);
    const [quizScore, setQuizScore] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [foodPortion, setFoodPortion] = useState(0);
    const [answerSelected, setAnswerSelected] = useState(null);
    const [wrongAnswers, setWrongAnswers] = useState([]);


    //ONLY FOR TESTING
    // const [predictedClass, setPredictedClass] = useState("a Container"); // State for predicted class Change after test
    // const [address2, setAddress2] = useState("");
    // const [education, setEducation] = useState(true); //Change after test
    // const [baseSixtyFour, setBaseSixtyFour] = useState("image.png/base64String");

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

        // assited to display an image
        // geekforgeeks. (2025). How to convert an uploaded image to base64. 
        // Available at:https://www.geeksforgeeks.org/how-to-upload-image-and-preview-it-using-reactjs/ (Accessed:15 January 2025)

        setFile(evt.target.files[0]);
        setFileURL(URL.createObjectURL(evt.target.files[0]));
    }

    // OpenAI. (2025). ChatGPT (16 January Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 16 January 2025).
    // Prompt: (pasted my code to see why the if statements where not working for the file.type). 
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

            // Convert to base64
            // coder4life (2022) How to convert an uploaded image to base64. 
            // Available at:https://www.youtube.com/watch?v=pxkE2tT6Y-o (Accessed:17 January 2025)
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

        // OpenAI. (2025). ChatGPT (20 February Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 20 February 2025).
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

    // useEffect(() => {

    //     console.log(address2); only for testing

    // }, [address2]);

    const submit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("file", file);

        try {
            // to time performance of ai.
            //Bengtsson, P.(2024).Measuring JavaScript Functions’ Performance 
            //Available at: https://www.sitepoint.com/measuring-javascript-functions-performance/ (Accessed: 20 March 2025)
            const timeStart = performance.now()

            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            console.log(response.data.message);
            setPredictedClass(response.data.message);
            setPercentage(response.data.confidence);
            const timeEnd = performance.now()
            console.log(((timeEnd - timeStart).toFixed(4)) / 1000 + ' Seconds')

        } catch (error) {
            console.error("Can't send the file", error);
        }
    };



    // from chatgpt to be able to update the address
    // OpenAI. (2025). ChatGPT (18 January Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 18 January 2025).
    // prompt: why is the address not saving (added my code)
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

    const clearAddress = () => {
        setAddress('');
    };

    //  OpenAI. (2025). ChatGPT (19 January Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 19 January 2025).
    //  Prompt: (image of my code) I want everything to reset, however the file still says the name of the previous file?

    const fileInputRef = useRef(null); // Add a ref for the file input

    const donate = async (e) => {
        e.preventDefault();
        const data = {
            image: baseSixtyFour,
            description: description,
            portionSize: portionSize,
            address: address,
            // address: address2,
            longitude: longitude,
            latitude: latitude
        }

        if (description.length === 0) {
            alert("You have to add a desciption");
        }
        else if (portionSize <= 0) {
            alert("You have to have at least 1 portion size");
        }
        else if (address.length === 0) {
            alert("You have to add a address");
        }
        // else if (address2.length === 0) {
        //     alert("You have to add a address");
        // }

        else {
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
            // OpenAI. (2025). ChatGPT (20 March Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 20 March 2025).
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
                setWrongAnswers(prevWrongAnswers => [...prevWrongAnswers, questions[currentQuestion].question]);
                setCurrentQuestion(prevQuestion => prevQuestion + 1);
                setSelectedAnswer("");
                setAnswerSelected(null);
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
    // OpenAI. (2025). ChatGPT (20 February Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 20 February 2025).
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
                                {/* Freires, T.(2022) Meals in Boxed Prepared for Box Diet. Available at: 
                                https://www.pexels.com/photo/meals-in-boxed-prepared-for-box-diet-12050951/ (Accessed: 10 February 2025).*/}
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
                                    {/*Reynaga, J.(2023) Takeaway Chicken Served in a Restaurant. Available at: 
                                    https://www.pexels.com/photo/takeaway-chicken-served-in-a-restaurant-17429048/ (Accessed: 7 March 2025).*/}
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
                                    {/* Alkady, A.(2021) Photo of Burger and Fries in a Takeout Box. Available at: 
                                    https://www.pexels.com/photo/photo-of-burger-and-fries-in-a-takeout-box-8228281/ (Accessed: 7 March 2025).*/}
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
                                    {/* Shvets, A.(2020) Fruits In A Plastic Bag. Available at: 
                                    https://www.pexels.com/photo/fruits-in-a-plastic-bag-3645504/ (Accessed: 7 March 2025).*/}
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

                {/* recieved some assistant for quiz managment
                    Learn Web Dev with Norbert. (2024) Build an Engaging Quiz App with React | Step-by-Step Tutorial. 
                    Available at:https://www.youtube.com/watch?v=jE2Ivb7dlSQ&t=986s (Accessed:9 February 2025)
                */}

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
                                        // OpenAI. (2025). ChatGPT (10 February Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 10 February 2025). 
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
                                        <p className="resultMessage">Congratulations You Got Full Marks<br></br>Retry whenever you want</p><br></br>
                                        <img id="points" src={star} alt="gold star" />
                                        {/* OpenClipart-Vectors.(2013). star favorite bookmark 3d gold. Available at: 
                                            https://pixabay.com/vectors/star-favorite-bookmark-3d-gold-152151/ (Accessed: 7 March 2025).*/}

                                    </>
                                    :
                                    <>
                                        <p className="resultMessage">Well done for attempting the quiz provided<br></br>try again and beat your score to gain points<br></br>
                                            Learn from the questions you got wrong bellow</p>
                                        <div>
                                            {wrongAnswers.map((wrongAnswer, index) => (
                                                <div key={index} className="wrongAnswers">{wrongAnswer}</div>
                                            ))}
                                        </div>
                                    </>
                                }
                            </div >
                        )}

                        <button className="nextButton" onClick={changeState}>Next</button>
                    </div >
                }

            </>)
            :
            (
                <>
                    <div id="donateTitleDiv"><h1 id="donateTitle">Donate</h1></div>

                    <div id="donationBox">

                        <div id="selectDonationImage">
                            {/* to remove select file button
                              21/01/2025 
                                Ateeb Asif.(2023).How to change default text in input type=“file” in reactjs?. 
                                Available at: https://stackoverflow.com/questions/61468441/how-to-change-default-text-in-input-type-file-in-reactjs (Accessed: 21 January 2025)
                             */}
                            <div id="preDonationInformation">
                                <label htmlFor="imageFile" id="selectFileLabel">Click here to upload donation image</label>
                                <input type="file" id="imageFile" onChange={change} ref={fileInputRef} />

                                <p id="imageRequirement">
                                    The image must be a .png, jpeg, jpg, or gif file.<br></br>
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

                        {/* GeoApify use and it's API: 
                       geoapify(n.d) @geoapify/react-geocoder-autocomplete - React component
                       Available at: https://apidocs.geoapify.com/samples/autocomplete/react-geoapify-geocoder-autocomplete/ (Accessed: 15 January 2025)

                       npm.(2024). React Geocoder Autocomplete.
                       Available at: https://www.npmjs.com/package/@geoapify/react-geocoder-autocomplete (Accessed: 15 January 2025)
                        
                        */}

                        <div id="allDonationResults">
                            <div id="donateDetails">

                                <div className="donationInputDiv">
                                    <label className="donateInputLabels" htmlFor="descriptionInput">Description:</label>
                                    <input className="donationInputs" data-testid="descriptionInput" disabled={disableInput} type="text" id="descriptionInput" placeholder="Enter description here" value={description} onChange={(evt) => setDescription(evt.target.value)} />
                                </div>
                                <br></br>
                                <div className="donationInputDiv">
                                    <label className="donateInputLabels" htmlFor="portionSizeInput">Portion Size:</label>
                                    <input className="donationInputs" data-testid="portionSizeInput" disabled={disableInput} type="number" id="portionSizeInput" value={portionSize} onChange={(evt) => setPortionSize(evt.target.value)} />
                                </div>
                                <br></br>
                                <div className="donationInputDiv">

                                    <label className="donateInputLabels" htmlFor="addressInput">Address:</label>
                                    {disableInput === true ? <input className="donationInputs" id="addressInput" placeholder="Enter address here" disabled={disableInput} />
                                        : <div className="donationInputs" id="autoCompleteAddress">
                                            <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
                                                <GeoapifyGeocoderAutocomplete data-testid="addressInput" id="addressInput" placeholder="Enter address here"
                                                    lang='en'
                                                    limit={5}
                                                    value={address}
                                                    onChange={updatedAddress}
                                                    placeSelect={onPlaceSelect}
                                                />
                                            </GeoapifyContext>
                                        </div>}
                                    {address && (
                                        <div id="XButtonDiv" className="addressRemoval">
                                            <button id="XButton" onClick={clearAddress}>
                                                X
                                            </button>
                                        </div>)}

                                    {/* <input value={address2} data-testid="testAddressInput" id="testAddressInput" onChange={(evt) => setAddress2(evt.target.value)} /> */}
                                    {/* only for testing */}
                                </div>
                            </div>
                            <br></br>
                            <button data-testid="donateButton" id="donateButton" disabled={false} onClick={donate}>Donate</button>
                        </div>
                    </div>
                </>)
    );
}

export default Donate;