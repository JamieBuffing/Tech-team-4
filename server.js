console.log("Server start nu");
const express = require("express");
const app = express();

app.use(express.static("static"));
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
    res.render('index');
});

app.post("/login", verwerkLogin);
app.get("/login", toonLogin)

function verwerkLogin(req, res){
    let formData = req.body;
    res.render("login.ejs");
}

function toonLogin(req, res) {
    res.render("login");
}

function toonIndex(req, res) {
    res.render("Index");
}


app.listen(3000)
console.log("Server is gestart")
console.log('http://localhost:3000/')