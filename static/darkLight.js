document.addEventListener('DOMContentLoaded', () => {
  const radios = document.querySelectorAll('input[name="theme"]');

  // Zet het juiste thema op basis van de keuze
  function setTheme(mode) {
    document.body.classList.remove('lightMode', 'darkMode');

    // volgt light of dark op basis dat je hebt gekozen maakt het aan
    if (mode === 'light') {
      document.body.classList.add('lightMode');
    } else if (mode === 'dark') {
      document.body.classList.add('darkMode');
    } else if (mode === 'auto') {
      // Volgt de systeeminstelling
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.add(prefersDark ? 'darkMode' : 'lightMode');
    }

    // Sla de voorkeur op
    localStorage.setItem('mode', mode);
  }

  // Haal opgeslagen voorkeur op of standaard 'auto'
  const savedMode = localStorage.getItem('mode') || 'auto';
  setTheme(savedMode);

  // Vink de juiste radio button aan op basis van opgeslagen voorkeur
  document.querySelector(`input[name="theme"][value="${savedMode}"]`).checked = true;

  // kijkt of iets is veranderd in de selectie
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      setTheme(e.target.value);
    });
  });

  // Als systeem verandert en 'auto' staat aan, pas thema aan
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('mode') === 'auto') {
      setTheme('auto');
    }
  });
});
