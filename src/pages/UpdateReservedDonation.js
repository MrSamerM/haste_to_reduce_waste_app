import React from "react";
import '../styling/UpdateReservedDonation.css'
import axios from "axios";


function UpdateReservedDonation() {

    axios.defaults.withCredentials = true;

    return (
        <div>
            View and Update Reserved Donations
        </div>
    );
}

export default UpdateReservedDonation;