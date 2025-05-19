console.log("Server start nu");

const path = require('path');   //Basismodule uit Node gedefinieerd voor Multer 

const express = require("express");
const app = express();      

const bcrypt = require('bcrypt');   // Voor de wachtwoorden om te Hashen

const { MongoClient, ObjectId } = require("mongodb");

const multer  = require('multer');

const storage = multer.diskStorage({    // De locatie van de upload afbeeldingen is in
  destination: function (req, file, cb) {
    cb(null, 'static/uploads/')         // de map static en dan uploads
  },
  filename: function (req, file, cb) {          // De afbeeldingen moeten volgens de volgende regels een naam krijgen.
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // Een random suffix string
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)     // De naam van het veld (Avatar) + de random Suffix en de bestands extensie
  }
})
const upload = multer({ storage: storage }); // De opslag locatie van Multer is in de variabele storage.

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.listen(3000);   

require('dotenv').config();
const uri = process.env.URI;

const client = new MongoClient(uri);
const db = client.db(process.env.DB);   // De login waarden om bij de MongoDB database te komen die worden hier gekoppeld vanuit het bestand .env


console.log("Server is gestart")
console.log('http://localhost:3000/')

async function connectDB() {        // De functie om te verbinden met de database
    try {
        await client.connect();
        console.log("Client connected to database");
    } catch (error) {
        console.log(error);
    }
}

connectDB()                         // Verbinden met de database

app.get('/', function(req, res) {   // Als er niks is ingevuld of gewoon de home url. Toon dan index.ejs
    res.render('pages/index');
});


                // Routes voor verschillende pagina's
app.get("/login", toonLogin)    
app.get("/Clear_Database", ClearDatabase)
app.get("/filter", toonfilter)


        // Als er wordt geregistreerd dan wordt deze functie uitgevoerd
app.post('/login', upload.single('avatar'), async (req, res) => {   
    let postData = req.body
    let hashWord = bcrypt.hashSync(postData.password, 10)       // Het wachtwoord hashen
    postData.password = hashWord
    if (req.file) {                                 // Alleen als er een afbeelding is geupload dan....
        postData.avatar = req.file.filename
    } else {
        postData.avatar = null
    }
    console.log(postData)
    await db.collection('users').insertOne(postData)
    res.redirect('/')           // Terug naar home pagina
})

function toonLogin(req, res) {      // Als dit adress wordt ingevuld
    res.render("pages/login");
}

function toonfilter(req, res) {
    res.render("pages/filter");
}






        // Tijdelijke functie om de Database op te kunnen schonen. shhhh deze functie zouden wij nooit durven gebruiken
function ClearDatabase() {
    db.collection('users').deleteMany({})
    console.log("Alles verwijderd")
}