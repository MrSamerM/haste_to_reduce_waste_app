import React, { useState } from "react";
import '../styling/SignUp.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function Signup({ setSessionAvailability }) {

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [validate, setValidate] = useState(true);
    const [validationMessage, setValidationMessage] = useState("");

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const validateEmail = (email) => {
        const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; //https://www.zerobounce.net/email-guides/email-validation-javascript/ for reference
        return pattern.test(email);//This tests if the email is valid or not
    }

    const validateAge = (dateOfBirth) => { //https://www.javatpoint.com/calculate-age-using-javascript as reference
        const changeToDate = new Date(dateOfBirth)
        const monthDifference = Date.now() - changeToDate.getTime();
        const convertToDate = new Date(monthDifference);
        const year = convertToDate.getUTCFullYear();
        const age = Math.abs(year - 1970);
        return age;
    }

    const submit = async (evt) => {

        evt.preventDefault();

        const data = {
            name: name,
            surname: surname,
            email: email,
            password: password,
            dateOfBirth: dateOfBirth
        };


        if (name === "" || surname === "" || email === "" || password === "" || dateOfBirth === "") {
            console.log("Must input correct details")
            setValidationMessage("Must input all details")
            setValidate(false);
        }
        else if (password.length <= 6) {
            console.log("Must have a longer password")
            setValidationMessage("Must have a longer password")
            setValidate(false);
        }
        else if (!validateEmail(email)) {
            console.log("Must have a valid email")
            setValidationMessage("Must have a valid email")
            setValidate(false);
        }
        else if (validateAge(dateOfBirth) < 18) {
            console.log("Must have be 18 or above")
            setValidationMessage("Must have be 18 or above")
            setValidate(false);
        }
        else {
            try {
                const res = await axios.post('http://localhost:8000/register', data);

                if (res.data.userID) {
                    setValidate(true);
                    setSessionAvailability(true)
                    navigate('/')
                }
            }
            catch (e) {
                if (e.response.status === 400) {
                    console.log("This email has already been used")
                    setValidationMessage("This email has already been used")
                    setValidate(false);
                }
                console.log("Error posting", e)
            }
        }
    }

    return (
        <>
            <h1 id="Title">Sign Up</h1>

            <label htmlFor="name">Name: </label>
            <input type="text" id="name" placeholder="Input Name" value={name} onChange={(evt) => setName(evt.target.value)} />

            <label htmlFor="surname">Surname: </label>
            <input type="text" id="surname" placeholder="Input Surname" value={surname} onChange={(evt) => setSurname(evt.target.value)} />

            <label htmlFor="email">Email: </label>
            <input type="text" id="email" placeholder="Input Email" value={email} onChange={(evt) => setEmail(evt.target.value)} />

            <label htmlFor="password">Password: </label>
            <input type="password" id="password" placeholder="Input Password" value={password} onChange={(evt) => setPassword(evt.target.value)} />

            <label htmlFor="dateOfBirth">Date of Birth: </label>
            <input type="date" id="dateOfBirth" value={dateOfBirth} onChange={(evt) => setDateOfBirth(evt.target.value)} />
            <br></br>

            {validate === true ? null : <p>{validationMessage}</p>}

            <button onClick={submit}>Sign Up</button>
        </>
    );
}
export default Signup