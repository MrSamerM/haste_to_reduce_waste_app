import React from "react";
import '../styling/UpdateReservedDonation.css'
import axios from "axios";
import { useState, useEffect } from "react";


function UpdateReservedDonation() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);


    axios.defaults.withCredentials = true;


    useEffect(() => {

        const allDonations = async () => {

            try {
                setLoading(true)

                const res = await axios.get('http://localhost:8000/allReservedDonations')
                const allDonatedDonations = res.data.result.map((data) => ({ id: data._id, description: data.description, portionSize: data.portionSize, address: data.address }));
                console.log(allDonatedDonations)
                setData(allDonatedDonations);
                setLoading(false)


            } catch (err) {
                console.log("Error", err)
            }
        }
        allDonations();

    }, []);

    const deleteDonation = async (id) => {

        const data = {
            donationID: id
        }

        try {
            await axios.post('http://localhost:8000/removeReservation', data)
            window.location.reload()

        } catch (err) {
            console.log("Error", err)
        }
    }

    if (loading === true) {
        return <div id="loading"></div>;
    }

    return (
        <div>
            <div id="updatedReservedDonationTitleDiv"><h1 id="updatedReservedDonationTitle">Update Reserved Donation</h1></div>

            {data.map((data) => (
                <div className="reservedDonationEntireBox">

                    <div id="reservedDonationDetailsBox">
                        <div className="reservedDonationDetails">
                            <label className="reservedDonationDetailsInputLabels" htmlFor="reservedDonationAddress">Address: </label>
                            <input className="reservedDonationDetailsInputs" id="reservedDonationAddress" value={data.address} readonly />
                        </div>
                        <div className="reservedDonationDetails">
                            <label className="reservedDonationDetailsInputLabels" htmlFor="reservedDonationDescription">Description: </label>
                            <input className="reservedDonationDetailsInputs" id="reservedDonationDescription" value={data.description} readonly />
                        </div>

                        <div className="reservedDonationDetails">
                            <label className="reservedDonationDetailsInputLabels" htmlFor="reservedDonationPortionSize">Portion Size: </label>
                            <input className="reservedDonationDetailsInputs" id="reservedDonationPortionSize" value={data.portionSize} readonly />
                        </div>
                    </div>

                    <div className="reservedSideInformation">
                        <button className="xIcon" onClick={() => deleteDonation(data.id)}>&#10060;</button>
                        <br></br>
                        <label className="reservedSideInformationLabels">Remove Reservation</label>
                    </div>
                </div>
            ))}
        </div>
    );
}


export default UpdateReservedDonation;