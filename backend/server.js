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


// assistance throughout the web application backend, and frontend. This course regularly updates
// Steele, C. (2025) The Web Developer Bootcamp 2025. Available at:
// https://www.udemy.com/course/the-web-developer-bootcamp (Accessed: 20 December 2024)

// for limits
// Noszone. (2022) 413 payload too large, for base64 string after adjusting size in express. Available at:
// https://stackoverflow.com/questions/54716914/413-payload-too-large-for-base64-string-after-adjusting-size-in-express (Accessed: 18 January 2025)
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));//So it is extended for all types to be encoded

// Chamoli, A. (2024) What is CORS in Node.js 2024: A Comprehensive Guide. Available at:
// https://javascript.plainenglish.io/what-is-cors-in-node-js-2024-a-comprehensive-guide-542630e0a805 (Accessed: 27 December 2025) 
app.use(cors(
    {
        origin: process.env.REACT_APP_API_URL,
        methods: ['GET, POST, PUT, OPTIONS'],
        credentials: true,
        allowedHeaders: 'Content-Type'
    }
))

// Express. (n.d) express-session. Available at:
// https://expressjs.com/en/resources/middleware/session.html (Accessed: 27 December 2025) 
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

mongoose.connect(process.env.REACT_APP_MONGO_PATH)
    .then(() => {
        console.log("Connected")
    })
    .catch((e) => {
        console.log("Error", e);
    })

app.listen(8000, () => {
    console.log("Listening to port 8000")
})


// Manthan Dave (2016) Simple login using Mongoose / MongoDB - Node.js Tutorial 17. 
// Available at: https://www.youtube.com/watch?v=pzGQMwGmCnc (Accessed:27 December 2025)

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
        res.status(500).json({ error: "database can't post data" })
    }
});

app.post('/donate', async (req, res) => {
    try {
        const { image, description, portionSize, address, longitude, latitude } = req.body

        const donation = new Donation(
            {
                image: image,
                description: description,
                portionSize: portionSize,
                address: address,
                longitude: longitude,
                latitude: latitude,
                donatorID: req.session.userID
            }
        )

        const findUser = await User.findByIdAndUpdate(req.session.userID, { $inc: { points: +10 } })

        await findUser.save();
        await donation.save()
        console.log("Donation Successfully");
        res.json({ message: "Donated" })
    }
    catch (e) {
        console.log("Error", e)
        res.status(500).json({ error: "database can't post data" })
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


// To remove cookies
// marcel.js. (2018) express-session. Available at:
// https://stackoverflow.com/questions/50454992/req-session-destroy-and-passport-logout-arent-destroying-cookie-on-client-side (Accessed: 1 January 2025) 

app.get('/remove_session', async (req, res) => {

    if (req.session.userID) {
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.json({ message: "There is no session", available: false })
    }
});

// received assistance from chatGPT to fix type error
// OpenAI. (2025). ChatGPT (26 February Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 26 February 2025).
// prompt 1: how do I fix this error TypeError: Cannot read properties of null (reading 'password')
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            console.log("Email wrong");
            return res.json({ message: "This is not a user" });
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (comparePassword) {
            console.log("Yes it is a user");
            console.log("Yes password matches");
            req.session.userID = user._id;
            return res.json({ message: "This is a user", userID: user._id });
        } else {
            console.log("Incorrect password");
            return res.json({ message: "This is not a user" });
        }
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ message: "database can't post data" });
    }
});


app.get('/allDonations', async (req, res) => {
    try {
        const allDonations = await Donation.find({});
        res.json({ result: allDonations });

    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't get data" })
    }
});

app.get('/allProducts', async (req, res) => {
    try {
        const allProducts = await Product.find({});
        res.json({ result: allProducts });

    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't get data" })
    }
});

app.get('/allDonatedDonations', async (req, res) => {
    try {
        const allDonations = await Donation.find({ donatorID: req.session.userID });
        res.json({ result: allDonations });

    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't get data" })
    }
})

app.get('/everyDonatedDonations', async (req, res) => {
    try {
        const allDonations = await Donation.find({});
        res.json({ result: allDonations });

    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't get data" })
    }
})

app.get('/donatedDonation/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const allDonations = await Donation.findById(id);
        res.json(allDonations);

    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't get data" })
    }
})


app.get('/allReservedDonations', async (req, res) => {
    try {
        const allDonations = await Donation.find({ recipientID: req.session.userID });
        res.json({ result: allDonations });

    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't get data" })
    }
})

app.get('/allReceipts', async (req, res) => {
    try {

        // received from chatGPT to get the data from the foreign key
        // OpenAI. (2025). ChatGPT (26 March Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 26 March 2025).
        // prompt1: I want to do something. Right now the productid array stores productIDs,but I want it to store the names of the products which is in another table in mongo, how can I fix this 
        // prompt2: it just does not work when productID is repeated

        const allReceipts = await Receipt.aggregate([
            {
                $match: { userID: new mongoose.Types.ObjectId(req.session.userID) }
            },
            {
                $unwind: "$productID" // Flatten the productID array
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productID",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails" // Ensure each product has its own document
            },
            {
                $group: {
                    _id: "$_id",
                    userID: { $first: "$userID" },
                    cost: { $first: "$cost" },
                    address: { $first: "$address" },
                    productNames: { $push: "$productDetails.productName" } // Collect product names, including duplicates
                }
            }
        ]);

        res.json({ result: allReceipts });


    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't get data" })
    }
})

app.get('/userPoints', async (req, res) => {
    try {
        const points = await User.findById(req.session.userID);
        res.json({ result: points });

    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't get data" })
    }
})

app.post('/purchase', async (req, res) => {
    try {
        const { listOfProducts, totalAmount, address } = req.body;

        const registerReceipt = new Receipt(
            {
                userID: req.session.userID,
                productID: listOfProducts,
                cost: totalAmount,
                address: address
            }
        )

        for (let i = 0; i < listOfProducts.length; i++) {
            await Product.findByIdAndUpdate(listOfProducts[i], { $inc: { quantity: -1 } });
        }

        const findUser = await User.findByIdAndUpdate(req.session.userID, { $inc: { points: -totalAmount } })
        await findUser.save();
        await registerReceipt.save()
        res.json({ message: "Purchased" })


    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't post data" })
    }
})

app.post('/updateReservation', async (req, res) => {
    try {
        const { reserved, donationID } = req.body;
        const findID = await Donation.findByIdAndUpdate(donationID, { reserved: reserved, recipientID: req.session.userID, })
        findID.save();

        res.json({ message: "Reserved" });


    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't post data" })
    }
})

app.post('/updateDonation', async (req, res) => {
    try {
        const { donationId, image, description, portionSize, address, longitude, latitude } = req.body;
        await Donation.findByIdAndUpdate(donationId, {
            image: image,
            description: description,
            portionSize: portionSize,
            address: address,
            longitude: longitude,
            latitude: latitude
        });
        res.json({ message: "Updated" })
    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't post data" })
    }
})

app.post('/removeReservation', async (req, res) => {
    try {
        const { donationID } = req.body

        const findID = await Donation.findByIdAndUpdate(donationID, { reserved: false, recipientID: null, })
        await findID.save();

        console.log("Removed Reservation")
        res.json({ message: "Reservation Removed" });

    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't post data" })
    }
});

app.post('/removeReceipt', async (req, res) => {
    try {
        const { receiptID } = req.body

        await Receipt.findByIdAndDelete(receiptID)

        console.log("Removed Receipt")
        res.json({ message: "Receipt Removed" });

    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't post data" })
    }
});

app.post('/removeDonation', async (req, res) => {
    try {
        const { donationID } = req.body
        await Donation.findByIdAndDelete(donationID)
        res.json({ message: "donation Removed" });
        console.log("Donation Removed")

    } catch (err) {
        console.log("error", err)
        res.status(500).json({ message: "database can't post data" })
    }
});