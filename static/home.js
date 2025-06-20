const apiKey = '80731283f03d46cfbd7f0053cf1fc99e';

async function haalPopulaireGames() {
  // Haal de eerste 200 games op
  const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&page_size=200`);
  const data = await response.json();

  // Filter games met rating > 4.5 en ratings_count > 0
  // ratings_count is niet altijd aanwezig hier, dus alleen filter op rating
  const populaireGames = data.results.filter(game => game.rating > 4.52);

  return populaireGames;
}

function toonPopulaireGames(games) {
  const container = document.getElementById('populaireGames');
  container.innerHTML = '';

  games.forEach(game => {
    const div = document.createElement('div');
    div.classList.add('game');

    div.innerHTML = `
      <h3>${game.name}</h3>
      <img src="${game.background_image || 'https://via.placeholder.com/200x100?text=No+Image'}" alt="${game.name}" width="300">
      <p><strong>Rating:</strong> ${game.rating} / 5</p>
      <p><strong>Genres:</strong> ${game.genres.map(g => g.name).join(', ')}</p>
      <p><strong>Platforms:</strong> ${game.platforms.map(p => p.platform.name).join(', ')}</p>
      <p><strong>Releasedatum:</strong> ${game.released || 'Onbekend'}</p>
    `;

    container.appendChild(div);
  });
}

// Start het proces
async function startPopulaireGames() {
  const games = await haalPopulaireGames();
  toonPopulaireGames(games);
}

startPopulaireGames();
