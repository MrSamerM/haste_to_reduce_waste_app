import React, { useEffect, useState } from "react";
import '../styling/UpdateDonation.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UpdateDonation() {

    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);


    axios.defaults.withCredentials = true;

    useEffect(() => {
        const allDonations = async () => {
            try {
                setLoading(true)
                const res = await axios.get('http://localhost:8000/allDonatedDonations')
                const allDonatedDonations = res.data.result.map((data) => ({
                    id: data._id,
                    description: data.description,
                    portionSize: data.portionSize,
                    reserved: data.reserved,
                    address: data.address
                }));
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
            const res = await axios.post('http://localhost:8000/removeDonation', data);
            if (res.data.message === "donation Removed") {
                window.location.reload();
            }

        } catch (err) {
            console.log("Error", err)
        }
    }

    const navigateUpdate = (id) => {

        navigate(`/update_reserved_donation/update_donation_details/${id}`)
    }

    if (loading === true) {
        return <div id="loading"></div>;
    }

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
                        <button className="tickXAndEditIcon" onClick={() => deleteDonation(data.id)}>&#10060;</button>
                        <br></br>
                        <label className="sideInformationLabels">Delete Donation</label>
                    </div>

                    {/* code With Yousaf.(2023). How to Update Data in React JS | Edit Record/Data using React JS. Available at: https://www.youtube.com/watch?v=CUyU_ySLnIM&t=532s (Accessed 25 January 2025) */}
                    <div className="sideInformation">
                        <button className="tickXAndEditIcon" onClick={() => navigateUpdate(data.id)}>&#9998;</button>
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