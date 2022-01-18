require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema); // important to pass the encryption  plugin before the collection is created. so do that bofre this line


const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/register", function (req, res) {
    res.render("register");
});


app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function (err) {
        if (err) {
            console.log("error: " + err);
        } else {
            console.log("registered successfully");
            res.render("secrets");
        };
    });
});

app.post("/login", function (req, res) {
    // const checkUser = {
    //     email: req.body.username,
    //     password: req.body.password
    // };
    User.find({ email: req.body.username }, function (err, user) {
        if (err) {
            console.log("error: " + err);
        } else {
            //console.log(user);
            if (user[0].password === req.body.password) {
                console.log("Login Success");
                res.render("secrets");
            } else {
                console.log("wrong Password Try again")
                res.render("login");
            };
        };
    });
});





const port = 3000;
app.listen(port, () => {
    console.log("Server started on port " + port);
});