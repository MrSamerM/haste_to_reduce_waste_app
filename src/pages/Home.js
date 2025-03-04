import React, { useState } from "react";
import '../styling/Home.css'
import foodWaste from '../image/foodWaste.jpg';
import foodWaste2 from '../image/foodWaste2.jpg';

function Home() {

    const [input, setInput] = useState(null)
    const [question, setQuestion] = useState(["Hello"])
    const [response, setResponse] = useState(["Hi"])

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
                                blablabalasasasasasaasaasasashgjhgjhgjhgjhgjgjhghjgjhghjgjhgjhgjhgjhgjhgjhgjh<br></br>
                                blablabalasasasasasaasaasasashgjhgjhgjhgjhgjgjhghjgjhghjgjhgjhgjhgjhgjhgjhgjh<br></br>
                                blablabalasasasasasaasaasasashgjhgjhgjhgjhgjgjhghjgjhghjgjhgjhgjhgjhgjhgjhgjh<br></br>
                                blablabalasasasasasaasaasasashgjhgjhgjhgjhgjgjhghjgjhghjgjhgjhgjhgjhgjhgjhgjh<br></br>
                                blablabalasasasasasaasaasasashgjhgjhgjhgjhgjgjhghjgjhghjgjhgjhgjhgjhgjhgjhgjh<br></br>
                                blablabalasasasasasaasaasasashgjhgjhgjhgjhgjgjhghjgjhghjgjhgjhgjhgjhgjhgjhgjh<br></br>
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

                        {question.map((question, index) => (
                            <div id="QuestionBox" key={index}>
                                <p>{question}</p>
                            </div>
                        ))}
                        <input type="text" id="input" placeholder="Input question" value={input} onChange={(evt) => setInput(evt.target.value)} />
                        <button>Submit</button>
                    </div>
                    <div className="Responses">
                        {response.map((response, index) => (
                            <div id="ResponseBox" key={index}>
                                <p>{response}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>

    );
}

export default Home;