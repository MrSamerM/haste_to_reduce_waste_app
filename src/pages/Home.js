import React, { useEffect, useState } from "react";
import '../styling/Home.css'
import foodWaste from '../image/foodWaste.jpg';
import foodWaste2 from '../image/foodWaste2.jpg';
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
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </div>
                    <div className="sideImages">
                        {/* image from chatGPT prompt :can you show me a image of food waste*/}
                        <img src={foodWaste} className="xIcon" />
                        {/* image from chatGPT prompt: show me one in bags */}
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
                                    <div id="responseSent">
                                        <p>{response}</p>
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