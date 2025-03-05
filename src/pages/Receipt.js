import React from "react";
import '../styling/Receipt.css'
import axios from "axios";
import { useState, useEffect } from "react";


function Receipt() {

    const [data, setData] = useState([]);

    axios.defaults.withCredentials = true;


    useEffect(() => {

        const allReceipts = async () => {

            try {
                const res = await axios.get('http://localhost:8000/allReceipts')
                const allReceipts = res.data.result.map((data) => ({ id: data._id, userID: data.userID, productNames: data.productNames, cost: data.cost, address: data.address }));

                console.log(allReceipts)
                setData(allReceipts);


            } catch (err) {
                console.log("Error", err)
            }
        }
        allReceipts();

    }, []);

    const deleteReceipt = async (id) => {

        const data = {
            receiptID: id
        }

        try {
            await axios.post('http://localhost:8000/removeReceipt', data)
            window.location.reload()

        } catch (err) {
            console.log("Error", err)
        }
    }

    return (
        <div>
            <div id="receiptsTitleDiv"><h1 id="receiptsTitle">Receipts</h1></div>

            {data.map((data) => (
                <div className="receiptsEntireBox">

                    <div id="receiptsDetailsBox">
                        <div className="receiptsDetails">
                            <label className="receiptsDetailsInputLabels" htmlFor="receiptsPurchases">Purchases: </label>
                            <input className="receiptsDetailsInputs" id="receiptsPurchases" value={data.productNames} readonly />
                        </div>

                        <div className="receiptsDetails">
                            <label className="receiptsDetailsInputLabels" htmlFor="receiptsCost">Cost: </label>
                            <input className="receiptsDetailsInputs" id="receiptsCost" value={data.cost} readonly />
                        </div>
                        <div className="receiptsDetails">
                            <label className="receiptsDetailsInputLabels" htmlFor="receiptsAddress">Delivery Address: </label>
                            <input className="receiptsDetailsInputs" id="receiptsAddress" value={data.address} readonly />
                        </div>
                    </div>

                    <div className="receiptsSideInformation">
                        <button className="xIcon" onClick={() => deleteReceipt(data.id)}>&#10060;</button>
                        <br></br>
                        <label className="receiptsSideInformationLabels">Remove Receipt</label>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default Receipt;