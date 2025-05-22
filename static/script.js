const apiKey = '80731283f03d46cfbd7f0053cf1fc99e';
let allGames = [];

async function Data() {
  const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&page_size=200`);
  const data = await response.json();
  allGames = data.results;

  vulFilters(allGames);
  laatZien(allGames);
}

Data();
function laatZien(games) {
  const gameDiv = document.getElementById('games');
  gameDiv.innerHTML = "";

  games.forEach(game => {
    const gameContainer = document.createElement('div');
    gameContainer.classList.add("game");

    const title = document.createElement('h2');
    title.textContent = game.name;

    const img = document.createElement('img');
    img.src = game.background_image || 'https://via.placeholder.com/400x200?text=No+Image';
    img.alt = game.name;
    img.width = 300;

    const genres = document.createElement('p');
    genres.innerHTML = `<strong>Genres:</strong> ${game.genres.map(g => g.name).join(', ')}`;

    const platforms = document.createElement('p');
    platforms.innerHTML = `<strong>Platforms:</strong> ${game.platforms.map(p => p.platform.name).join(', ')}`;

    const button = document.createElement('button');
    button.textContent = 'Meer informatie';
    button.addEventListener('click', () => {
      alert(`Meer informatie over: ${game.name}`);
    });

    gameContainer.appendChild(title);
    gameContainer.appendChild(img);
    gameContainer.appendChild(genres);
    gameContainer.appendChild(platforms);
    gameContainer.appendChild(button);

    gameDiv.appendChild(gameContainer);
  });
}


function vulFilters(games) {
  const genreSet = new Set();
  const platformSet = new Set();

  games.forEach(game => {
    game.genres.forEach(g => genreSet.add(g.name));
    game.platforms.forEach(p => platformSet.add(p.platform.name));
  });

  const genreDiv = document.getElementById('genreFilters');
  const platformDiv = document.getElementById('platformFilters');

  genreSet.forEach(genre => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" name="genre" value="${genre}"> ${genre}`;
    genreDiv.appendChild(label);
    genreDiv.appendChild(document.createElement('br'));
  });

  platformSet.forEach(platform => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" name="platform" value="${platform}"> ${platform}`;
    platformDiv.appendChild(label);
    platformDiv.appendChild(document.createElement('br'));
  });

  genreDiv.addEventListener('change', filterGames);
  platformDiv.addEventListener('change', filterGames);
}

function filterGames() {
  const selectedGenres = Array.from(document.querySelectorAll('input[name="genre"]:checked')).map(cb => cb.value);
  const selectedPlatforms = Array.from(document.querySelectorAll('input[name="platform"]:checked')).map(cb => cb.value);

  const filteredGames = allGames.filter(game => {
    const genreMatch = selectedGenres.length === 0 || game.genres.some(g => selectedGenres.includes(g.name));
    const platformMatch = selectedPlatforms.length === 0 || game.platforms.some(p => selectedPlatforms.includes(p.platform.name));
    return genreMatch && platformMatch;
  });

  laatZien(filteredGames);
}
