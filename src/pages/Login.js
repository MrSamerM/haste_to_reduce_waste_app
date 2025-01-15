import React, { useEffect, useState } from "react";
import '../styling/Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'




function Login({ setSessionAvailability }) {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validate, setValidate] = useState(true);
    const [validationMessage, setValidationMessage] = useState("");

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const submit = async (evt) => {

        evt.preventDefault();

        const data = {

            email: email,
            password: password
        };

        if (email === "" || password === "") {
            setValidationMessage("You must input an email and a password")
            setValidate(false);
        }

        else {
            try {
                const res = await axios.post('http://localhost:8000/login', data);

                if (res.data.userID) {
                    setSessionAvailability(true)
                    navigate('/')
                }

            }
            catch (e) {
                if (e.response.status === 400) {
                    setValidationMessage("The email or password is incorrect")
                    setValidate(false);
                    console.log("Error posting", e)
                }
            }
        }
    }

    return (
        <>
            <div id='loginTitleDiv'>
                <h1 id="Login">Login</h1>
            </div>
            <div id="loginDetails">
                <div className="loginInputDiv">
                    <label className="loginInputLabel" htmlFor="email">Email: </label>
                    <input type="text" id="email" placeholder="Input Email" value={email} onChange={(evt) => setEmail(evt.target.value)} />
                </div>

                <div className="loginInputDiv">
                    <label className="loginInputLabel" htmlFor="password">Password: </label>
                    <input type="password" id="password" placeholder="Input Password" value={password} onChange={(evt) => setPassword(evt.target.value)} />
                </div>

                {validate === true ? null : <p id="loginValidation">{validationMessage}</p>}
                <button id="loginButton" onClick={submit}>Login</button>
            </div>

        </>
    );
}
export default Login