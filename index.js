const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Or require('bcryptjs');

const app = express();
const saltRounds = 10;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/Database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to database"));
db.once('open', () => console.log("Connected to database"));

app.post("/sign_up", async (req, res) => {
    const { name, age, email, phno, gender, passward } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(passward, saltRounds);
        const data = { name, age, email, phno, gender, passward: hashedPassword };

        await db.collection('users').insertOne(data);
        console.log("Record Inserted Successfully");
        return res.redirect('signup_successful.html');
    } catch (error) {
        console.error("Error inserting record:", error);
        return res.status(500).send("Error inserting record.");
    }
});

app.get("/", (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

app.listen(4000, () => {
    console.log("Listening on port 4000");
});
