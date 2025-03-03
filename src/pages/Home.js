import React from "react";
import '../styling/Home.css'


function Home() {
    return (
        <>
            <div id='homeTitleDiv'>
                <h1 id="home">Home</h1>
            </div>

            <div className="overviewBox">

                <div id="overviewInformationBox">
                    <div className="receiptsDetails">
                        <div id='overviewTitleDiv'><h1 id="overviewTitle">What is this web application?</h1></div>
                        <label className="receiptsDetailsInputLabels" htmlFor="receiptsPurchases">Purchases: </label>
                        <input className="receiptsDetailsInputs" id="receiptsPurchases" readonly />
                    </div>

                    <div className="receiptsDetails">
                        <label className="receiptsDetailsInputLabels" htmlFor="receiptsCost">Cost: </label>
                        <input className="receiptsDetailsInputs" id="receiptsCost" readonly />
                    </div>
                    <div className="receiptsDetails">
                        <label className="receiptsDetailsInputLabels" htmlFor="receiptsAddress">Delivery Address: </label>
                        <input className="receiptsDetailsInputs" id="receiptsAddress" readonly />
                    </div>
                </div>

                <div className="receiptsSideInformation">
                    <button className="xIcon">&#10060;</button>
                    <br></br>
                    <label className="receiptsSideInformationLabels">Remove Receipt</label>
                </div>
            </div>

        </>

    );
}

export default Home;