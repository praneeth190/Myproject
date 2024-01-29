const express = require("express");
const path = require("path");
const {collection,datamodel} = require("./mongodb");

const bcrypt = require('bcrypt');

const app = express();
app.use('/static', express.static('static'));

app.use(express.json());

app.use(express.static("public"));

app.set("view engine", "ejs");
// Update your '/next' route in app.js
app.get("/", async (req, res) => {
    try {
        // Fetch data from the 'data'
        const fdata = await datamodel.find();

        // Debug log to check fetched data
        console.log("Fetched Data:", fdata);

        // Render the 'next' view and pass the fetched data
        res.render('next', { data: fdata });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.use(express.urlencoded({ extended: false }));

// Register User
app.post("/signup", async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
      
    };

    // Check if already exists in the database
    const existingUser = await collection.findOne({ email: data.email });
    if (!existingUser) {
        const emailRege = /^[A-Za-z0-9._%+-]+@gmail.com$/;
        if (!emailRege.test(data.email)) {
            res.render("next");
        } else {
            res.render("base");

            // Hash the password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword;

            const userdata = await collection.create(data);
            console.log(userdata);
        }
    } else {
        res.send("user data already exists");
    }
});

// Login user
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        // Compare the hashed password with password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render("next");
        } else {
            res.send("wrong Password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("please correct it");
    }
});
const port = 8000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

