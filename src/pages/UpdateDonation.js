import React, { useEffect, useState } from "react";
import '../styling/UpdateDonation.css'
import axios from "axios";


function UpdateDonation() {

    const [data, setData] = useState([]);

    useEffect(() => {

        const allDonations = async () => {

            try {
                const res = await axios.get('http://localhost:8000/allDonatedDonations')
                const allDonatedDonations = res.data.result.map((data) => ({ description: data.description, portionSize: data.portionSize, reserved: data.reserved, address: data.address }));
                setData(allDonatedDonations);

            } catch (err) {
                console.log("Error", err)
            }
        }
        allDonations();

    }, []);

    return (
        <div>
            <div id="updatedDonationTitleDiv"><h1 id="updatedDonationTitle">Update Donations</h1></div>

            {data.map((data) => (
                <div className="donationEntireBox">

                    <div id="donationDetailsBox">
                        <div className="donationDetails">
                            <label className="donationDetailsInputLabels" htmlFor="donationAddress">Address: </label>
                            <input className="donationDetailsInputs" id="donationAddress" value={data.address} readonly />
                        </div>
                        <div className="donationDetails">
                            <label className="donationDetailsInputLabels" htmlFor="donationDescription">Description: </label>
                            <input className="donationDetailsInputs" id="donationDescription" value={data.description} readonly />
                        </div>

                        <div className="donationDetails">
                            <label className="donationDetailsInputLabels" htmlFor="donationPortionSize">Portion Size: </label>
                            <input className="donationDetailsInputs" id="donationPortionSize" value={data.portionSize} readonly />
                        </div>

                    </div>

                    <div className="sideInformation">
                        {data.reserved === true ? <p className="tickXAndEditIcon">&#9989;</p> : <p className="tickXAndEditIcon">&#10060;</p>}
                        <br></br>
                        <label className="sideInformationLabels">Reservation Status</label>
                    </div>

                    <div className="sideInformation">
                        <p className="tickXAndEditIcon">&#10060;</p>
                        <br></br>
                        <label className="sideInformationLabels">Delete Donation</label>
                    </div>

                    <div className="sideInformation">
                        <p className="tickXAndEditIcon">&#9998;</p>
                        <br></br>
                        <label className="sideInformationLabels">Update Donation</label>
                    </div>


                </div>
            ))}

        </div>
    );
}

export default UpdateDonation;