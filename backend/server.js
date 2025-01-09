const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: '../../food_waste_prevention_app/.env' });
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./databaseModels/userModel');
const Donation = require('./databaseModels/donationModel');
const Receipt = require('./databaseModels/receiptModel');
const Product = require('./databaseModels/productModel');

// https://javascript.plainenglish.io/what-is-cors-in-node-js-2024-a-comprehensive-guide-542630e0a805 as reference December 27
// https://expressjs.com/en/resources/middleware/session.html as reference December 27
// https://stackoverflow.com/questions/50454992/req-session-destroy-and-passport-logout-arent-destroying-cookie-on-client-side  as reference 1/1/25
// https://www.youtube.com/watch?v=pzGQMwGmCnc as reference

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//So it is extended for all types to be enoded
app.use(cors(
    {
        origin: 'http://localhost:3000',
        methods: ['GET, POST, PUT, OPTIONS'],
        credentials: true,
        allowedHeaders: 'Content-Type'
    }
))

app.use(session(
    {
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,//24 hours
            secure: false,
            httpOnly: true,
            sameSite: false
        }
    }
))

app.options('*', cors()); //this allows preflight for all routes

mongoose.connect('mongodb+srv://2106040:2106040Password@cluster0.cmsyx.mongodb.net/webAppDatabase?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log("Connected")
    })
    .catch((e) => {
        console.log("Error", e);
    })

app.listen(8000, () => {
    console.log("Listening to port 8000")
})

app.post('/register', async (req, res) => {
    try {
        const { name, surname, email, password, dateOfBirth } = req.body

        const findDuplicate = await User.findOne({ email: email });
        if (findDuplicate) {
            console.log("Yes it is a duplicate")
            return res.status(400).json({ error: "There appears to be a same user with this email" })
        }

        else {

            const hash = await bcrypt.hash(password, 12)
            const registerUser = new User(
                {
                    name: name,
                    surname: surname,
                    email: email,
                    password: hash,
                    dateOfBirth: dateOfBirth
                }
            )
            await registerUser.save()
            req.session.userID = registerUser._id;
            console.log("Registerd Successfully")
            res.json({ message: "You have successfully registered", userID: registerUser._id })
        }
    }
    catch (e) {
        console.log("Error", e)
        res.status(400).json({ error: "There appears to be a error with the input" })
    }
});

app.get('/session_check', async (req, res) => {

    if (!req.session.userID) {
        res.json({ message: "There is no session", available: false })
    }
    else {
        res.json({ message: "There is a session", available: true })
    }
})

app.get('/remove_session', async (req, res) => {

    if (req.session.userID) {
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.json({ message: "There is no session", available: false })
    }
});

app.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (user) {
            console.log("Yes it is a user")
        }

        const comparePassword = await bcrypt.compare(password, user.password)
        if (comparePassword) {
            console.log("Yes password matches")

        }
        req.session.userID = user._id;
        res.json({ message: "This is a user", userID: user._id });
    } catch (err) {
        console.log("error", err)
        res.json({ message: "This is a not a user", validate: false })
    }
});