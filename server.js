console.log("Server start nu");
const express = require("express");
const app = express();

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.URI;

const client = new MongoClient(uri);
const db = client.db(process.env.DB);

async function connectDB() {
    try {
        await client.connect();
        console.log("Client connected to database");
    } catch (error) {
        console.log(error);
    }
}

connectDB()

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get("/login", toonLogin)

app.post('/login', async (req, res) => {
    let postData = req.body
    console.log(postData)
    db.collection('users').insertOne(postData)
    console.log(postData.voornaam)
    res.redirect('/')
    res.send("partials/")
})


function toonLogin(req, res) {
    res.render("pages/login");
}

function toonIndex(req, res) {
    res.render("index");
}


app.listen(3000)
console.log("Server is gestart")
console.log('http://localhost:3000/')