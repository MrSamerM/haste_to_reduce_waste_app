const mongoose = require('mongoose');
const user = require('./databaseModels/userModel');

mongoose.connect('mongodb+srv://2106040:2106040Password@cluster0.cmsyx.mongodb.net/webAppDatabase?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log("Connected")
    })
    .catch((e) => {
        console.log("Error", e);
    })

const newUser = new user(
    {
        name: 'Sam',
        surname: 'Moubacher',
        email: 'sam.moubacher@gmail.com',
        password: 'password',
        dateOfBirth: new Date("2002-09-10")
    }
);

newUser.save()
    .then(() => {
        console.log("successfull", newUser)
    })
    .catch((e) => {
        console.log("Errors", e)
    });