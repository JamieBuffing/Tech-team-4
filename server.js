console.log("Server start nu");

const path = require('path');   //Basismodule uit Node gedefinieerd voor Multer 

const express = require("express");
const app = express();      

const bcrypt = require('bcrypt');   // Voor de wachtwoorden om te Hashen

const { MongoClient, ObjectId } = require("mongodb");

const multer  = require('multer');

const session = require("express-session");

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
app.use(
  session({
    secret: 'team vier',
    resave: false, // Prevent unnecessary session saving
    saveUninitialized: false, // Do not save empty sessions
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      // Use secure cookies in production
      httpOnly: true,
      // Prevent client-side JavaScript from accessing cookies
      maxAge: 1000 * 60 * 60 * 1,
      // Session expires after 1 hours
    },
  })
);
app.set('view engine', 'ejs');
app.listen(3000);   

require('dotenv').config();
const uri = process.env.URI;

const client = new MongoClient(uri);
const db = client.db(process.env.DB);   // De login waarden om bij de MongoDB database te komen die worden hier gekoppeld vanuit het bestand .env
const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.isLoggedIn) {
    next(); // User is logged in, proceed to the next middleware or route handler
  } else {
    res.redirect("/login"); // Redirect to the login page if not authenticated
  }
};

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

app.get("/login", toonLogin)
app.get("/games", isLoggedIn, (req, res) => {
  const user = req.session.user; // Retrieve user info from session
  res.render("pages/games", { user }); // Pass user data to the view
});
app.get("/matchen", toonMatchen)
app.get("/settings", toonSettings)
app.get("/login", toonLogin)
app.get("/Clear_Database", ClearDatabase)
app.get("/profile", isLoggedIn, (req, res) => {
  const user = req.session.user; // Retrieve user info from session
  res.render("pages/profile", { user }); // Pass user data to the view
  console.log(user)
});

app.get("/filter", toonfilter)

app.get("/hulp", isLoggedIn, (req, res) => {
  res.render("pages/hulp");
});

 //**connecten met de API om games te zoeken */
// app.get('/api/games', async (req, res) => {
//   const search = req.query.search;
//   if (!search) return res.json({ results: [] });

//   try {
//     const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(search)}&page_size=10`);
//     const data = await response.json();
//     res.json({ results: data.results });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'API request failed' });
//   }
// });


        // Als er wordt geregistreerd dan wordt deze functie uitgevoerd
app.post('/registreren', upload.single('avatar'), async (req, res) => {   
    let postData = req.body
    let hashWord = bcrypt.hashSync(postData.r_password, 10)       // Het wachtwoord hashen
    postData.r_password = hashWord
    if (req.file) {                                 // Alleen als er een afbeelding is geupload dan....
        postData.avatar = req.file.filename
    } else {
        postData.avatar = null
    }
    console.log(postData)
    await db.collection('users').insertOne(postData)
        res.redirect('/profile')           // Naar de profiel pagina
})

app.post('/login', async (req, res) => {
    let postData = req.body
    let email = postData.email
    let user = await db.collection('users').findOne({
    r_email: email
    })
    console.log(user)
    bcrypt.compare(postData.password, user.r_password, function(err, result) {
    if (err) {
        console.log("fout tijdens wachtwoord check")
    }
    if (result) {
        console.log("Wachtwoord komt overeen")
        req.session.isLoggedIn = true; // Set session variable
        req.session.user = { 
          id: user._id, 
          email: user.r_email, 
          voornaam: user.r_voornaam, 
          avatar: user.avatar,
          games: user.games
        }; // Store user info in session
        res.redirect('/profile')           // Naar de profiel pagina
    } else {
      let error2 = "Ongeldig email en of wachtwoord"
        console.log(error2)
        res.render("pages/login", { error2 })
    }
    })

})

app.post('/voorkeuren', async (req, res) => {
  const user = req.session.user;      // De ingelogde gebruiker wordt even opgezocht uit de session
  let email = user.email              // De email wordt hieruit genomen
  let postData = req.body             // De gestuurde data van het form wordt opgehaald
  let addInUser = await db.collection('users').updateOne(   // De functie waarin het volgende gebeurt
    { r_email: email },               // De gebruiker wordt opgezocht in de database via de email
    { $set: postData }                // De data van het form wordt toegevoegd aan het document in de database van de bijbehorende gebruiker
  )
  console.log(addInUser)              // Er wordt gelogd wat er precies is gebeurt tijdens het toevoegen om te kunnen debuggen
  console.log(postData)               // Er wordt nog even gelogd wat er precies is meegekomen van het form
})

app.post("/submit", async (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/login");
  }

  const postData = req.body;
  console.log("Matchvoorkeuren ontvangen:", postData);

  await db.collection("users").updateOne(
    { r_voornaam: user.voornaam },
    { $set: postData }
  );

  res.redirect("/profile");
});

app.post('/like', async (req, res) => {
  console.log("--------------------")
  console.log("Like/unlike gestart")
  console.log("--------------------")
  // Het email adres van de ingelogde gebruiker er even bij pakken
  const email = req.session.user.email;

  // De gebruiker opzoeken en klaarzetten
  const gebruiker = await db.collection('users').findOne({ r_email: email });

  // Als eerste de game ID uit de postData halen
  let postData = req.body
  let game_id = postData.game_id
  console.log("Game_ID")
  console.log(game_id)
  console.log("--------------------")

  // Alvast een let aanmaken waar de games inkomen
  let newGames = ""

  // Opzoeken of de gebruiker al eerder een game heeft gelikt en hiermee al een game array heeft
  if (req.session.user && Array.isArray(req.session.user.games)) {
  console.log("De gebruiker heeft een games-array");

  // Als de gebruiker al games heeft gelikt dan moeten die games even worden opgeslagen
  newGames = req.session.user.games;
  } else {
  // Anders gebeurt er nog niks
  console.log("Geen games-array gevonden/ nog geen games geliked");
  }

  console.log("--------------------")

  // De al eerder opgeslagen games en de nieuwe game opslaan in een array
  if(!newGames.includes(game_id)) {
    console.log("Game is nog niet geliked")
    console.log("--------------------")
    newGames.push(game_id)
    console.log("newGames")
    console.log(newGames)
    console.log("--------------")
      // Van de gebruiker die is ingelogd voeg de nieuwe volledige games lijst toe
    await db.collection('users').updateOne(
    { r_email: email },
    { $addToSet: { games: game_id } }
    );
  } else {
    console.log("Game is al geliked")
    console.log("--------------------")
    await db.collection('users').updateOne(
    { r_email: email },
    { $pull: { games: game_id } } // verwijdert game_id uit de array
    );
    // uit de newGames array sla alleen de waardes op die niet overeenkomen met game_id
    newGames = newGames.filter(g => g !== game_id);
    console.log("newGames")
    console.log(newGames)
  }
  
  // Voeg de volledige nieuwe lijst ook toe aan de session van de gebruiker
  req.session.user.games = newGames

  // Ga opnieuw naar de games pagina
  let user = req.session.user;
  console.log("--------------------")
  console.log("Einde like/unlike")
  console.log("--------------------")
  res.render("pages/games", {user});
})

app.post("/uitloggen", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Er is een fout opgetreden bij het uitloggen.");
    }
    console.log("Uitgelogd")
    res.redirect("/");

  });
});

function toonLogin(req, res) {      // Als dit adress wordt ingevuld
    res.render("pages/login");
}
 
function toonMatchen(req, res) {
  const genres = [
    { name: "Actie", image: "/images/actie.jpeg" },
    { name: "Indie", image: "/images/indie.jpeg" },
    { name: "RPG", image: "/images/rpg.jpeg" },
    { name: "Adventure", image: "/images/adventure.jpeg" },
    { name: "Strategy", image: "/images/strategy.jpeg" },
    { name: "Shooter", image: "/images/shooter.jpeg" },
    { name: "Casual", image: "/images/casual.jpeg" },
    { name: "Simulation", image: "/images/simulation.jpeg" },
    { name: "Puzzle", image: "/images/puzzle.jpeg" },
    { name: "Arcade", image: "/images/arcade.jpeg" },
    { name: "Platformer", image: "/images/platformer.jpeg" },
    { name: "Massively Multiplayer", image: "/images/massivelyMultiplayer.jpeg" },
    { name: "Racing", image: "/images/racing.jpeg" },
    { name: "Sports", image: "/images/sports.jpeg" },
    { name: "Fighting", image: "/images/fighting.jpeg" },
    { name: "Family", image: "/images/family.jpeg" },
    { name: "Board Games", image: "/images/boardGames.jpeg" },
    { name: "Card", image: "/images/card.jpeg" },
    { name: "Educational", image: "/images/educational.jpeg" },
  ];

  const platform = [
    {name: "PC", image:"/images/pc.jpeg"},
    {name: "PlayStation 5", image:"/images/playStation5.jpeg"},
    {name: "Xbox One", image:"/images/xboxOne.jpeg"},
    {name: "PlayStation 4", image:"/images/playStation4.jpeg"},
    {name: "Xbox Series S/X", image:"/images/xboxSeries.jpeg"},
    {name: "Nintendo Switch", image:"/images/nintendoSwitch.jpeg"},
    {name: "iOS", image:"/images/ios.jpeg"},
    {name: "Android", image:"/images/android.jpeg"},
    {name: "Nintendo 3DS", image:"/images/nintendo3DS.jpeg"},
    {name: "Nintendo DS", image:"/images/nintendoDS.jpeg"},
    {name: "Nintendo DSi", image:"/images/nintendoDSi.jpeg"},
    {name: "macOS", image:"/images/actie.jpeg"},
    {name: "Linux", image:"/images/linux.jpeg"},
    {name: "Xbox 360", image:"/images/xbox360.jpeg"},
    {name: "Xbox", image:"/images/xbox.jpeg"},
    {name: "PlayStation 3", image:"/images/playStation3.jpeg"},
    {name: "PlayStation 2", image:"/images/playStation2.jpeg"},
    {name: "PlayStation", image:"/images/playStation.jpeg"},
    {name: "PS Vita", image:"/images/psVita.jpeg"},
    {name: "PSP", image:"/images/psp.jpeg"},
    {name: "Wii U", image:"/images/wiiU.jpeg"},
    {name: "Wii", image:"/images/wii.jpeg"},
    {name: "GameCube", image:"/images/gameCube.jpeg"},
    {name: "Nintendo 64", image:"/images/nintendo64.jpeg"},
    {name: "Game Boy Advance", image:"/images/gameBoyAdvance.jpeg"},
    {name: "Game Boy Color", image:"/images/gameBoyColor.jpeg"},
    {name: "Game Boy", image:"/images/gameBoy.jpeg"},
    {name: "SNES", image:"/images/snes.jpeg"},
    {name: "NES", image:"/images/nes.jpeg"},
    {name: "Classic Macintosh", image:"/images/classicMacintosh.jpeg"},
    {name: "Apple II", image:"/images/apple2.jpeg"},
    {name: "Commodore / Amiga", image:"/images/commodereAmiga.jpeg"},
    {name: "Atari 7800", image:"/images/atari7800.jpeg"},
    {name: "Atari 5200", image:"/images/atari5200.jpeg"},
    {name: "Atari 2600", image:"/images/atari2600.jpeg"},
    {name: "Atari Flashback", image:"/images/atariFlashback.jpeg"},
    {name: "Atari 8-bit", image:"/images/atari8bit.jpeg"},
    {name: "Atari ST", image:"/images/atariST.jpeg"},
    {name: "Atari Lynx", image:"/images/atariLynx.jpeg"},
    {name: "Atari XEGS", image:"/images/atariXEGS.jpeg"},
    {name: "Genesis", image:"/images/genesis.jpeg"},
    {name: "SEGA Saturn", image:"/images/segaSaturn.jpeg"},
    {name: "SEGA CD", image:"/images/segaCD.jpeg"},
    {name: "SEGA 32X", image:"/images/sega32X.jpeg"},
    {name: "SEGA Master System", image:"/images/segaMasterSystem.jpeg"},
    {name: "Dreamcast", image:"/images/dreamcast.jpeg"},
    {name: "3DO", image:"/images/3do.jpeg"},
    {name: "Jaguar", image:"/images/jaguar.jpeg"},
    {name: "Game Gear", image:"/images/gameGear.jpeg"},
    {name: "Neo Geo", image:"/images/neoGeo.jpeg"},
    {name: "Web", image:"/images/web.jpeg"},
  ]

  const land = [
    {name: "Nederland", image:"/images/nederland.jpg"},
    {name: "Duitsland", image:"/images/duitsland.jpg"},
    {name: "Verenigd Koninkrijk", image:"/images/uk.jpg"},
    {name: "Frankrijk", image:"/images/france.jpg"},
    {name: "Spanje", image:"/images/spanje.jpg"},
    {name: "Italië", image:"/images/italie.jpg"},
    {name: "Rusland", image:"/images/rusland.jpg"},
    {name: "China", image:"/images/china.jpg"},
    {name: "Japan", image:"/images/japan.jpg"},
    {name: "Verenigde staten", image:"/images/us.jpg"},
    {name: "België", image:"/images/belgium.jpg"},
    {name: "Portugal", image:"/images/portugal.jpg"},
    {name: "Mexico", image:"/images/mexico.jpg"},
    {name: "Brazilië", image:"/images/brasil.jpg"},
    {name: "Kroatië", image:"/images/kroatie.jpg"},
    {name: "Hongarije", image:"/images/hongarije.jpg"},
  ]

  const taal = [
    {name: "Nederlands", image:"/images/nederland.jpg"},
    {name: "Duits", image:"/images/duitsland.jpg"},
    {name: "Engels", image:"/images/uk.jpg"},
    {name: "Frans", image:"/images/france.jpg"},
    {name: "Spaans", image:"/images/spanje.jpg"},
    {name: "Italiaans", image:"/images/italie.jpg"},
    {name: "Russisch", image:"/images/rusland.jpg"},
    {name: "Chinees", image:"/images/china.jpg"},
    {name: "Japans", image:"/images/japan.jpg"},
    {name: "Portugees", image:"/images/portugal.jpg"},
    {name: "Hongaars", image:"/images/hongarije.jpg"},
    {name: "Kroatisch", image:"/images/kroatie.jpg"},
  ]

    res.render("pages/matchen", {genres, platform, land, taal});
}

 
function toonSettings(req, res) {
    res.render("pages/settings")
}

function toonfilter(req, res) {
    res.render("pages/filter");
}






        // Tijdelijke functie om de Database op te kunnen schonen. shhhh deze functie zouden wij nooit durven gebruiken
function ClearDatabase() {
    db.collection('users').deleteMany({})
    console.log("Alles verwijderd")
}