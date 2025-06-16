const apiKey = '80731283f03d46cfbd7f0053cf1fc99e';
let allGames = [];

async function Data() {
  // Deze functie start het hele proces: haalt de games op en laat ze zien en maakt filters
  const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&page_size=200`); // toont 200 games
  const data = await response.json();
  allGames = data.results;

  vulFilters(allGames);  // Maak filters voor genres en platforms
  laatZien(allGames);    // Toon alle games op de pagina
}

Data();
function laatZien(games) {
  const gameDiv = document.getElementById('games');
  gameDiv.innerHTML = "";  // Maak de container leeg zodat oude games verdwijnen

  games.forEach(game => {
    const gameContainer = document.createElement('div'); // Maak een div aan voor elke game
    gameContainer.classList.add("game"); // een class voor styling
    gameContainer.id = game.id; // Voeg een id toe dat overeenkomt met het id van de game

    const title = document.createElement('h2');
    title.textContent = game.name;

    const img = document.createElement('img');
    // Gebruik game-afbeelding of standaardplaatje als er geen is
    img.src = game.background_image || 'https://via.placeholder.com/200x100?text=No+Image';
    img.alt = game.name;
    img.width = 300;

    // bron:https://api.rawg.io/docs/#tag/developers
    const rating = document.createElement('p');
    rating.innerHTML = `<strong>Rating:</strong> ${game.rating} / 5`;

    // haalt de objecten op en vertaald het naar leesbare tekst
    const genres = document.createElement('p');
    genres.innerHTML = `<strong>Genres:</strong> ${game.genres.map(g => g.name).join(', ')}`;

    // zelfde maar dan voor platform
    const platforms = document.createElement('p');
    platforms.innerHTML = `<strong>Platforms:</strong> ${game.platforms.map(p => p.platform.name).join(', ')}`;

    // maakt info button
    const button = document.createElement('button');
    button.textContent = 'Meer informatie';

    // Eventlistener toevoegen zodat de overlay verschijnt met info als je op de knop klikt
    button.addEventListener('click', () => {
      openOverlay(game);
    });

    gameContainer.append(title, img, genres, platforms, button);
    gameDiv.appendChild(gameContainer);
  });
  
}

// Functie om overlay te vullen en tonen
function openOverlay(game) {
  const overlay = document.getElementById('overlay');
  const overlayInfo = document.getElementById('overlayInfo');

  // Vul overlay met gewenste info van de game
  overlayInfo.innerHTML = `
    <h2>${game.name}</h2>
    <img src="${game.background_image || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${game.name}" style="width: 100%; max-width: 400px;"/>
    <p><strong>Genres:</strong> ${game.genres.map(g => g.name).join(', ')}</p>
    <p><strong>Platforms:</strong> ${game.platforms.map(p => p.platform.name).join(', ')}</p>
    <p><strong>Releasedatum:</strong> ${game.released || 'Onbekend'}</p>
    <p><strong>Rating:</strong> ${game.rating} / 5 (${game.ratings_count || '0'} reviews)</p>
    <p><strong>Beschrijving:</strong> ${game.description_raw || 'Geen beschrijving beschikbaar.'}</p>
  `;

  // Toon overlay
  overlay.style.display = 'flex';
}

// functie om te filteren (de checkboksen)
function vulFilters(games) {
  // zodat er geen dubbele waardes zijn
  const genreSet = new Set();
  const platformSet = new Set();

  // gaat door de games heen
  games.forEach(game => {
    // toevoegen en genreSet en platformSet
    game.genres.forEach(g => genreSet.add(g.name));
    game.platforms.forEach(p => platformSet.add(p.platform.name));
  });

  // Div voor de filters
  const genreDiv = document.getElementById('genreFilters');
  const platformDiv = document.getElementById('platformFilters');

  // Maak checkboxen voor genres
  genreSet.forEach(genre => {
    const label = document.createElement('label');
    // genre tonen
    label.innerHTML = `<input type="checkbox" name="genre" value="${genre}"> ${genre}`;
    // toevoegen aan genreDiv
    genreDiv.append(label);
  });

  // Maak checkboxen voor platforms
  platformSet.forEach(platform => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" name="platform" value="${platform}"> ${platform}`;
    platformDiv.append(label);
  });

  // Voeg eventlistener toe om te filteren bij wijziging
  genreDiv.addEventListener('change', filterGames);
  platformDiv.addEventListener('change', filterGames);
}

function filterGames() {
  // Pak alle genres die aangevinkt zijn
  const selectedGenres = Array.from(document.querySelectorAll('input[name="genre"]:checked')).map(cb => cb.value);

  // Pak alle platforms die aangevinkt zijn
  const selectedPlatforms = Array.from(document.querySelectorAll('input[name="platform"]:checked')).map(cb => cb.value);

  // Filter alle games in allGames:
  // tonen van games die aangevinkt zijn
  const filteredGames = allGames.filter(game => {
    // Check of de game een van de geselecteerde genres heeft of als er geen genre is geselecteerd wordt het sowieso getoont
    // .some() checkt of er een element in de array is die de voorwaarde waar maakt
    const genreMatch = selectedGenres.length === 0 || game.genres.some(g => selectedGenres.includes(g.name));

    // Check hetzelfde voor platforms
    const platformMatch = selectedPlatforms.length === 0 || game.platforms.some(p => selectedPlatforms.includes(p.platform.name));

    // Return true als beide matchen waar zijn, anders false
    return genreMatch && platformMatch;
  });

  // Laat alleen de gefilterde games zien
  laatZien(filteredGames);
  hartjes()
}

// Sluitknop eventlistener
document.getElementById('sluitOverlay').addEventListener('click', () => {
  document.getElementById('overlay').style.display = 'none';
});