import React, { useEffect, useState } from "react";
import '../styling/Home.css'
import foodWaste from '../image/foodWaste1.jpg';
// https://www.pexels.com/photo/pile-of-organic-waste-14824327/
import foodWaste2 from '../image/foodWaste2.jpg';
// https://www.pexels.com/photo/a-cardboard-box-with-food-label-beside-a-charity-sign-and-paper-cups-6646847/
import axios from "axios";

function Home() {

    const [input, setInput] = useState(null)
    const [question, setQuestion] = useState([])
    const [response, setResponse] = useState([])
    const [chatbotInformation, setChatbotInformation] = useState(true)

    const addQuestionAndResponse = async () => {
        setQuestion((prevQuestion) => [...prevQuestion, input])
        setInput("")
        const data = {
            input: input
        }
        try {
            const response = await axios.post("http://localhost:5000/response", data, { withCredentials: true });
            console.log(response.data.response);
            setResponse((prevQuestion) => [...prevQuestion, response.data.response])
        } catch (error) {
            console.error("Can't send the file", error);
        }
    }

    useEffect(() => {
        if (question.length !== 0) {
            setChatbotInformation(false)
        }
    }, [question, chatbotInformation])
    return (
        <>
            <div id='homeTitleDiv'>
                <h1 id="home">Home</h1>
            </div>

            <div className="overviewBox">
                <div id="overviewInformationBox">
                    <div className="overviewDetails">
                        <div id='overviewTitleDiv'><h1 id="overviewTitle">What is this web application?</h1></div>
                        <div id="overviewParagraphsDiv">
                            <p className="overviewParagraphs">
                                This web application is to help you gain knowledge, the minimal required to help you to start reducing food waste.
                                There are so many different functionalities to help you be well educated with the main household food waste.
                                This includes being better educated with labellings, and dates so that it is easier to understand.
                                This includes storage and disposal of food items with the chatbot bellow, also generating recipies with remaining food items.
                                Finally, being able to donate correctly, with suitable containers to help prevent food being contaminated and innedible .
                            </p>
                        </div>
                    </div>
                    <div className="sideImages">
                        <img src={foodWaste} className="xIcon" />
                        <img src={foodWaste2} className="xIcon" />
                    </div>
                </div>
            </div>

            <div className="overviewBox">
                <div id="overviewInformationBox">
                    <div className="Questions">
                        <div id='overviewTitleDiv'><h1 id="overviewTitle">Haste Bot</h1></div>
                        {chatbotInformation === false ?
                            question.map((question, index) => (
                                <div id="questionBox" key={index}>
                                    <div id="youBubble">
                                        <p>YOU</p>
                                    </div>
                                    <div id="typeQuestion">
                                        <p>{question}</p>
                                    </div>
                                </div>
                            ))
                            :
                            <div id="noQuestionBox">
                                <p>
                                    This is where you can ask Haste about your troubles understanding how to store fruits,
                                    vegetables, meat and other. Also troubles with understanding how to dipose of waste that
                                    has already expired. Just input your question, and wait for a response.
                                </p>
                            </div>
                        }
                        <input type="text" id="input" placeholder="Input question" value={input} onChange={(evt) => setInput(evt.target.value)} />
                        <button id="submitQuestion" onClick={addQuestionAndResponse}>Submit</button>
                    </div>
                    <div className="Responses">
                        {chatbotInformation === false ?
                            response.map((response, index) => (
                                <div id="responseBox" key={index}>
                                    <div id="hasteBubble">
                                        <p>HASTE</p>
                                    </div>

                                    {/* OpenAI. (2025). ChatGPT (10 March Version) [Large Language Model]. 
                                    Available at: https://chatgpt.com/ (Accessed: 10 March 2025).
                                    prompt: when I return this return 
                                    (f"\nRecipe: {recipe_name}\n Ingredients: {recipe_ingredients}\n URL: {recipe_url}"), 
                                    frompython, in react js it is still together. How can I fix this*/}
                                    <div id="responseSent">
                                        {response.split("\n").map((line, index) => (
                                            <p key={index}>{line}</p>
                                        ))}
                                    </div>
                                </div>
                            )) :
                            <div id="noQuestionBoxResponse">
                                <p>
                                    Haste is waiting for a question to answer...
                                </p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>

    );
}

export default Home;