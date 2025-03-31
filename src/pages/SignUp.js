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

    // zerobounce. (n.d) How to Do Email Validation in JavaScript. Available at:
    // https://www.zerobounce.net/email-guides/email-validation-javascript/ (Accessed: 2 January 2025)
    const validateEmail = (email) => {
        const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return pattern.test(email);//This tests if the email is valid or not
    }

    // javatpoint. (n.d) calculate age using javascript. Available at:
    // https://www.javatpoint.com/calculate-age-using-javascript (Accessed: 2 January 2025)
    const validateAge = (dateOfBirth) => {
        const changeToDate = new Date(dateOfBirth)
        const monthDifference = Date.now() - changeToDate.getTime();//In milliseconds (date.now() starts in 1970)
        const convertToDate = new Date(monthDifference);//Change it to a date
        const year = convertToDate.getUTCFullYear();////Change it to a year
        const age = Math.abs(year - 1970);//remove 1970 to get full age
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
            console.log("Must be 18 or above")
            setValidationMessage("Must be 18 or above")
            setValidate(false);
        }
        else {
            try {
                const res = await axios.post('http://localhost:8000/register', data);

                if (res.data.userID) {
                    console.log("Sign up successful")
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
            <div id="TitleDiv">
                <h1 id="Title">Sign Up</h1>
            </div>

            <div id="details">

                <div className="inputDiv">
                    <label className="inputLabels" htmlFor="name">Name: </label>
                    <input className="signUpInputs" type="text" id="name" data-testid="name" placeholder="Input Name" value={name} onChange={(evt) => setName(evt.target.value)} />
                </div>

                <div className="inputDiv">
                    <label className="inputLabels" htmlFor="surname">Surname: </label>
                    <input className="signUpInputs" type="text" id="surname" data-testid="surname" placeholder="Input Surname" value={surname} onChange={(evt) => setSurname(evt.target.value)} />
                </div>

                <div className="inputDiv">

                    <label className="inputLabels" htmlFor="email">Email: </label>
                    <input className="signUpInputs" type="text" id="email" data-testid="email" placeholder="Input Email" value={email} onChange={(evt) => setEmail(evt.target.value)} />
                </div>

                <div className="inputDiv">

                    <label className="inputLabels" htmlFor="password">Password: </label>
                    <input className="signUpInputs" type="password" data-testid="password" id="password" placeholder="Input Password" value={password} onChange={(evt) => setPassword(evt.target.value)} />
                </div>

                <div className="inputDiv">

                    <label className="inputLabels" htmlFor="dateOfBirth">Date of Birth: </label>
                    <input className="signUpInputs" data-testid="dateOfBirth" type="date" id="dateOfBirth" value={dateOfBirth} onChange={(evt) => setDateOfBirth(evt.target.value)} />
                </div>

                <br></br>

                <p data-testid="validateMessage" id="validationMessage">{validate ? "" : validationMessage}</p>


                <button data-testid="signup" id="signupButton" onClick={submit}>Sign Up</button>
            </div>
        </>
    );
}
export default Signup