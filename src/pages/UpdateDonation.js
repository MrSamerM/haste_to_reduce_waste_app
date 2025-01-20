import React, { useEffect } from "react";
import '../styling/UpdateDonation.css'
import axios from "axios";


function UpdateDonation() {

    const [data, setData] = ([]);

    useEffect(() => {

        const allDonations = async () => {

            try {
                const res = await axios.get('http://localhost:8000/allDonatedDonations')
                const allDonatedDonations = res.data.result
                    .map((data) => ({ description: data.description, portionSize: data.portionSize, reserved: data.reserved, address: data.address }));
                setData(allDonatedDonations);

            } catch (err) {
                console.log("Error", err)
            }
        }
        allDonations();

    }, []);

    return (
        <div>
            <h1 id="updateDonationTitle">Update Donations</h1>

            {data.map((data) => (
                <div id="donationDetailsBox">
                    <div className="donationDetails">
                        <label className="donationDetailsInputLabels" htmlFor="donationAddress">Address: </label>
                        <input className="donationDetailsInputs" id="donationAddress" value={data.address} />
                    </div>
                    <div className="donationDetails">
                        <label className="inputLabels" htmlFor="donationDescription">Description: </label>
                        <input className="donationDetailsInputs" id="donationDescription" value={data.description} />
                    </div>

                    <div className="donationDetails">
                        <label className="inputLabels" htmlFor="donationPortionSize">Portion Size: </label>
                        <input className="donationDetailsInputs" id="donationPortionSize" value={data.portionSize} />
                    </div>

                    <div className="sideInformation">
                        {data.reserved === true ? <p className="tickXAndEditIcon">&#9989;</p> : <p className="tickXAndEditIcon">&#10060;</p>}
                        <br></br>
                        <label>Reservation Status</label>
                    </div>

                    <div className="sideInformation">
                        <p className="tickXAndEditIcon">&#10060;</p>
                        <br></br>
                        <label>Delete Donation</label>
                    </div>

                    <div className="sideInformation">
                        <p className="tickXAndEditIcon">&#10060;</p>
                        <br></br>
                        <label>Update Donation</label>
                    </div>


                </div>
            ))}

        </div>
    );
}

export default UpdateDonation;