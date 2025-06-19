document.addEventListener('DOMContentLoaded', () => {
  // Maakt de toggle-knop
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'toggleMode';
  toggleBtn.innerText = 'Dark/Light Mode';
  document.body.appendChild(toggleBtn);

  // Functie om de juiste modus toe te passen
  const applyMode = () => {
    const storedMode = localStorage.getItem('mode');

    if (storedMode) {
      // Gebruik de opgeslagen voorkeur
      document.body.classList.toggle('lightMode', storedMode === 'dark');
    } else {
      // Geen voorkeur opgeslagen volgt het systeeminstelling
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('lightMode', prefersDark);
    }
  };

  // Wanneer je op de knop klikt, wissel tussen light en dark en sla het op
  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('lightMode');
    localStorage.setItem('mode', isDark ? 'dark' : 'light');
  });

  // Pas de modus toe bij opstart
  applyMode();
});
