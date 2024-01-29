const express = require("express");
const path = require("path");
const { collection, datamodel } = require("./mongodb");

const bcrypt = require('bcrypt');

const app = express();
app.use('/static', express.static('static'));

app.use(express.json());

// app.use(express.static("public"));

app.set("view engine", "ejs");
// Update your '/next' route in app.js
app.get("/", async (req, res) => {
    try {
        res.render("model")
    } catch (error) {
        console.error(error);
        res.status(500).send("error", error);
    }
});


app.use(express.urlencoded({ extended: false }));

// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name:req.body.name,
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
            

            // Hash the password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword;

            const userdata = await collection.create(data);
            console.log(userdata);
            res.render("next");
        }
    } else {
        res.send("user data already exists");
    }
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        
        if (isPasswordMatch) {
            const userdata = await collection.findOne({ email: req.body.email });

            res.render("next");
        } else {
            res.send("wrong Password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("please correct it");
    }
});
app.get('/upload',async(req,res)=>{
    try {
        res.render("upload")
    } catch (error) {
        console.error(error);
        res.status(500).send("error", error);
    }
})

app.post('/submit_form', async (req, res) => {
    try {
        // Connect to MongoDB
        const formData = {
            name: req.body.name,
            email: req.body.email,
            collegeName: req.body.collegeName,
            yearOfStudy:req.body.yearOfStudy,
            branch: req.body.branch,
            groupMembers: req.body.groupMembers,
            mentor: req.body.mentor,
            projectName: req.body.projectName,
            genre: req.body.genre,
            spanOfProjectTime: req.body.spanOfProjectTime,
            description: req.body.description,
            projectInfo: req.body.projectInfo,
            urlink: req.body.link
          
            
        };

        
        const datasCollection = datamodel.model('datas').collection; 
        await datasCollection.insertOne(formData);
        console.log(formData)
        res.render("next")
        // res.status(200).send('Successfully stored the form data');

        // Close the MongoDB connection
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// Search route
app.get("/search", async (req, res) => {
    try {
        const searchTerm = req.query.search;
        console.log(searchTerm)

            const searchData = searchTerm
                ? await datamodel.find({
                    $or: [
                        { collegeName: { $regex: new RegExp(searchTerm, "i") } },
                        { name: { $regex: new RegExp(searchTerm, "i") } },
                        { genre: { $regex: new RegExp(searchTerm, "i") } },
                        { branch: { $regex: new RegExp(searchTerm, "i") } },
                        { spanOfProjectTime: { $regex: new RegExp(searchTerm, "i") } },
                        { projectName: { $regex: new RegExp(searchTerm, "i") } },

                    ]
                })
                : [];

            res.render('data', {data: searchData });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/collab',async(req,res)=>{
    res.render('collab');
})







const port = 8000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// pradeep,praneeth,abhinay,abhishek,shiva,navya.