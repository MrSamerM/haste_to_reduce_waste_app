import React, { useEffect, useState } from "react";
import '../styling/Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'




function Login({ setSessionAvailability }) {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const submit = async (evt) => {

        evt.preventDefault();

        const data = {

            email: email,
            password: password
        };

        try {

            const res = await axios.post('http://localhost:8000/login', data);

            if (res.data.userID) {
                setSessionAvailability(true)
                navigate('/')
            }

        }
        catch (e) {
            console.log("Error posting", e)
        }

    }

    return (
        <>
            <h1 id="Login">Login</h1>

            <label htmlFor="email">Email: </label>
            <input type="text" id="email" placeholder="Input Email" value={email} onChange={(evt) => setEmail(evt.target.value)} />

            <label htmlFor="password">Password: </label>
            <input type="password" id="password" placeholder="Input Password" value={password} onChange={(evt) => setPassword(evt.target.value)} />


            <button onClick={submit}>Login</button>
        </>
    );
}
export default Login