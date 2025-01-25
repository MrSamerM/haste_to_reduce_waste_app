import React, { useEffect, useState } from "react";
import '../styling/UpdateDonation.css'
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function UpdateDonation() {

    const navigate = useNavigate();

    const [data, setData] = useState([]);

    axios.defaults.withCredentials = true;

    useEffect(() => {

        const allDonations = async () => {

            try {
                const res = await axios.get('http://localhost:8000/allDonatedDonations')
                const allDonatedDonations = res.data.result.map((data) => ({ id: data._id, description: data.description, portionSize: data.portionSize, reserved: data.reserved, address: data.address }));
                setData(allDonatedDonations);

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
            await axios.post('http://localhost:8000/removeDonation', data);

        } catch (err) {
            console.log("Error", err)
        }
    }

    return (
        <div>
            <div id="updatedDonationTitleDiv"><h1 id="updatedDonationTitle">Update Donations</h1></div>

            {data.map((data) => (
                <div className="donationEntireBox">

                    <div id="donationDetailsBox">
                        <div className="donationDetails">
                            <label className="donationDetailsInputLabels" htmlFor="donationAddress">Address: </label>
                            <input className="donationDetailsInputs" id="donationAddress" value={data.address} disabled={true} />
                        </div>
                        <div className="donationDetails">
                            <label className="donationDetailsInputLabels" htmlFor="donationDescription">Description: </label>
                            <input className="donationDetailsInputs" id="donationDescription" value={data.description} disabled={true} />
                        </div>

                        <div className="donationDetails">
                            <label className="donationDetailsInputLabels" htmlFor="donationPortionSize">Portion Size: </label>
                            <input className="donationDetailsInputs" id="donationPortionSize" value={data.portionSize} disabled={true} />
                        </div>

                    </div>

                    <div className="sideInformation">
                        {data.reserved === true ? <p className="tickXAndEditIcon">&#9989;</p> : <p className="tickXAndEditIcon">&#10060;</p>}
                        <br></br>
                        <label className="sideInformationLabels">Reservation Status</label>
                    </div>

                    <div className="sideInformation">
                        <button className="tickXAndEditIcon" onClick={() => deleteDonation(data.id)}>&#10060;</button>
                        <br></br>
                        <label className="sideInformationLabels">Delete Donation</label>
                    </div>

                    {/* https://www.youtube.com/watch?v=CUyU_ySLnIM&t=532s for reference 25/01/2025 */}
                    <div className="sideInformation">
                        <button className="tickXAndEditIcon"><Link to={`/update_donation_details/${data.id}`}>&#9998;</Link></button>
                        <br></br>
                        <label className="sideInformationLabels">Update Donation</label>
                    </div>
                </div>
            ))
            }

        </div >
    );
}

export default UpdateDonation;