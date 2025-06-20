const apiKey = '80731283f03d46cfbd7f0053cf1fc99e';
const gebruiker = document.body.dataset.userGebruiker;
let LikeGames = document.body.dataset.userGames.split(',');
console.log(LikeGames)

async function Data(games) {
    for (const game of games) {
        console.log(game);
        const gameDiv = document.getElementById("likedGames");
        const response = await fetch(`https://api.rawg.io/api/games/${game}?key=${apiKey}`);
        const data = await response.json();
        console.log(data);
        const name = data.name;
        const genre = data.genres.map(g => g.name).join(', ');
        const platform = data.platforms.map(p => p.platform.name).join(', ');
        const image = data.background_image
        const description = data.description

        const title = document.createElement('h2');
        title.textContent = name;

        const img = document.createElement('img');
        // Gebruik game-afbeelding of standaardplaatje als er geen is
        img.src = image || 'https://via.placeholder.com/200x100?text=No+Image';
        img.alt = name;
        img.width = 300;

        // haalt de objecten op en vertaald het naar leesbare tekst
        const genres = document.createElement('p');
        genres.innerHTML = `<strong>Genres:</strong> ${genre}`;

        // zelfde maar dan voor platform
        const platforms = document.createElement('p');
        platforms.innerHTML = `<strong>Platforms:</strong> ${platform}`;

        // maakt info button
        const button = document.createElement('button');
        button.textContent = 'Meer informatie';
        
        // Eventlistener toevoegen zodat de overlay verschijnt met info als je op de knop klikt
        button.addEventListener('click', () => {
            openOverlay(game);
        });

        const form = document.createElement('form');  // voegt een form toe met de volgende class, action en method
        form.className = 'like';
        form.action = '/like';
        form.method = 'post';

        const input = document.createElement('input');  // voegt een input toe met de volgende waardes
        input.type = "image" 
        input.src = "images/like_leeg.png" 
        input.alt = "Submit" 
        input.width = 24;
        input.height = 24;
        input.classList.add("heart");
        input.id = game;
        
        const input_hidden = document.createElement('input'); // voegt een input toe die niet zichtbaar is met de game id
        input_hidden.type = "hidden"
        input_hidden.name = "game_id"
        input_hidden.value = game;
      
        const gameContainer = document.createElement('li'); // Maak een div aan voor elke game
        gameContainer.classList.add("liked"); // een class voor styling
        gameContainer.id = game; // Voeg een id toe dat overeenkomt met het id van de game

        form.append(input_hidden, input);
        gameContainer.append(form, title, img, genres, platforms, button);
        gameDiv.append(gameContainer);
    }
    setTimeout(() => { // Wacht even 1 seconden voor de hartjes worden toegevoegd
        hartjes()
    }, 1000)
}
Data(LikeGames)

function hartjes() { // de functie om de hartjes per game toe te voegen.
  const userGames = document.body.dataset.userGames;  // Haal data op vanuit de body (hierin staan de gelikte games van de ingelogde gebruiker)
  if (!userGames) return; // Als er geen data is ga dan maar gewoon verder
  const userGamesArray = userGames.split(","); // split de lijst met data zodat het een leesbare array wordt
  console.log(userGamesArray);  // log de array even voor debug
  userGamesArray.forEach(gameID => {  // Voor elke losse game....
    let gameDIV = document.getElementById(gameID);  // Zoek de game id op als id om de pagina.
    if (!gameDIV) return; // Als het niet wordt gevonden kom dan terug
    let heart = gameDIV.querySelector("form input.heart[type='image']");  // variabele heart is het input type van een form met type img
    if (heart) {  // als heart wordt gevonden...
      heart.src = "images/like_vol.png";  // verander het dan zodat het een rood heartje wordt
    }
  });
}

// Functie om overlay te vullen en tonen
async function openOverlay(game) {
    const response = await fetch(`https://api.rawg.io/api/games/${game}?key=${apiKey}`);
    const data = await response.json();
  const overlay = document.getElementById('overlay');
  const overlayInfo = document.getElementById('overlayInfo');

  // Vul overlay met gewenste info van de game
  overlayInfo.innerHTML = `
    <h2>${data.name}</h2>
    <img src="${data.background_image || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${data.name}" style="width: 100%; max-width: 400px;"/>
    <p><strong>Genres:</strong> ${data.genres.map(g => g.name).join(', ')}</p>
    <p><strong>Platforms:</strong> ${data.platforms.map(p => p.platform.name).join(', ')}</p>
    <p><strong>Releasedatum:</strong> ${data.released || 'Onbekend'}</p>
    <p><strong>Rating:</strong> ${data.rating} / 5 (${data.ratings_count || '0'} reviews)</p>
    <p><strong>Beschrijving:</strong> ${data.description_raw || 'Geen beschrijving beschikbaar.'}</p>
  `;

  // Toon overlay
  overlay.style.display = 'flex';
}

// Sluitknop eventlistener
document.getElementById('sluitOverlay').addEventListener('click', () => {
  document.getElementById('overlay').style.display = 'none';
});



const vriendenData = document.body.dataset.userVrienden;
const vriendenHunData = JSON.parse(document.body.dataset.userVriendendata);

const vrienden = vriendenData.split(",");

const mijnVriendenDiv = document.getElementById("mijnVrienden");

vrienden.forEach(vriendId => {
    if (!vriendId) return;
    
    const vriendObj = vriendenHunData.find(v => v._id === vriendId);

    if (vriendObj) {
        const container = document.createElement("article");
        container.classList.add("vriend");
        container.id = vriendObj._id
        container.onclick = () => showUser(vriendObj);
        const p = document.createElement("p");
        p.textContent = vriendObj.r_voornaam;
        const img = document.createElement("img")
        img.src = vriendObj.avatar ? "/uploads/" + vriendObj.avatar : "/images/default-avatar.png";
        img.className = "smallAvatar"

        container.append(img, p)
        mijnVriendenDiv.append(container);
    }
});


async function showUser(vriend) {
  const display = document.getElementById("showUser");
  display.style.display = "block";
  const container = document.getElementById("showUserData");
  container.innerHTML = '<button onclick="closeShowUser()">Sluiten</button>';
  const username = vriend.r_voornaam;
  const talen = vriend.taal;
  let zin = `${username} spreekt `;

  const naam = document.createElement("h3");
  const afbeelding = document.createElement("img");
  const land = document.createElement("p");
  const taal = document.createElement("p");
  const platforms = document.createElement("details");
  const platformTitel = document.createElement("summary");
  const games = document.createElement("ul");
  const genres = document.createElement("details");
  const genresTitel = document.createElement("summary");
  const gamesDiv = document.createElement("div");

  naam.id = "vriendShowNaam";
  afbeelding.id = "vriendShowAfbeelding";
  gamesDiv.id = "vriendShowGamesDiv";
  genres.id = "vriendShowGenres";
  land.id = "vriendShowLand";
  taal.id = "vriendShowTaal";
  platforms.id = "vriendShowPlatforms";

  naam.textContent = `${vriend.r_voornaam} (${vriend.r_leeftijd})`;
  land.textContent = vriend.r_voornaam + " komt uit " + vriend.land;
  platformTitel.textContent = vriend.r_voornaam + "'s gekozen platform(en)"
  genresTitel.textContent = vriend.r_voornaam + "'s gekozen genres"

  afbeelding.src = vriend.avatar ? "/uploads/" + vriend.avatar : "/images/default-avatar.png";

  if (Array.isArray(vriend.genres)) {
    vriend.genres.forEach(genre => {
      const li = document.createElement("li");
      li.textContent = genre;
      genres.append(li);
    });
  }

  if (Array.isArray(talen)) {
    if (talen.length === 1) {
      zin += talen[0];
    } else if (talen.length === 2) {
      zin += `${talen[0]} en ${talen[1]}`;
    } else {
      const laatsteTaal = talen[talen.length - 1];
      const overigeTalen = talen.slice(0, -1);
      zin += `${overigeTalen.join(', ')} en ${laatsteTaal}`;
    }
    zin += ".";
  } else {
    zin += "geen talen.";
  }
  taal.textContent = zin;

  if (Array.isArray(vriend.platform)) {
    vriend.platform.forEach(platform => {
      const li = document.createElement("li");
      li.textContent = platform;
      platforms.append(li);
    });
  }
  genres.append(genresTitel)
  platforms.append(platformTitel)
  container.append(naam, afbeelding, land, taal, games, gamesDiv);

if (Array.isArray(vriend.games)) {
    for (const game of vriend.games) {
      console.log(game);
      const gameDiv = document.getElementById("vriendShowGamesDiv");
      const response = await fetch(`https://api.rawg.io/api/games/${game}?key=${apiKey}`);
      const data = await response.json();
      console.log(data);
      const name = data.name;
      const genre = data.genres.map(g => g.name).join(', ');
      const platform = data.platforms.map(p => p.platform.name).join(', ');
      const image = data.background_image
      const description = data.description

      const title = document.createElement('h2');
      title.textContent = name;

      const img = document.createElement('img');
      // Gebruik game-afbeelding of standaardplaatje als er geen is
      img.src = image || 'https://via.placeholder.com/200x100?text=No+Image';
      img.alt = name;
      img.width = 300;

      // haalt de objecten op en vertaald het naar leesbare tekst
      const genres = document.createElement('p');
      genres.innerHTML = `<strong>Genres:</strong> ${genre}`;

      // zelfde maar dan voor platform
      const platforms = document.createElement('p');
      platforms.innerHTML = `<strong>Platforms:</strong> ${platform}`;

      // maakt info button
      const button = document.createElement('button');
      button.textContent = 'Meer informatie';
      
      // Eventlistener toevoegen zodat de overlay verschijnt met info als je op de knop klikt
      button.addEventListener('click', () => {
          openOverlay(game);
      });

      const form = document.createElement('form');  // voegt een form toe met de volgende class, action en method
      form.className = 'like';
      form.action = '/like';
      form.method = 'post';

      const input = document.createElement('input');  // voegt een input toe met de volgende waardes
      input.type = "image" 
      input.src = "images/like_leeg.png" 
      input.alt = "Submit" 
      input.width = 24;
      input.height = 24;
      input.classList.add("heart");
      input.id = game;
      
      const input_hidden = document.createElement('input'); // voegt een input toe die niet zichtbaar is met de game id
      input_hidden.type = "hidden"
      input_hidden.name = "game_id"
      input_hidden.value = game;
    
      const gameContainer = document.createElement('li'); // Maak een div aan voor elke game
      gameContainer.classList.add("vriendenShowGames"); // een class voor styling
      gameContainer.id = game; // Voeg een id toe dat overeenkomt met het id van de game

      form.append(input_hidden, input);
      gameContainer.append(form, title, img, genres, platforms, button);
      gameDiv.append(gameContainer);
    }
      hartjes()
  }

}

function closeShowUser() {
  const display = document.getElementById("showUser")
  display.style.display = "none"
  const container = document.getElementById("showUserData")
  container.innerHTML = '<button onclick="closeShowUser()">Sluiten</button>';
}