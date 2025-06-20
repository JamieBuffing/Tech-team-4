document.addEventListener('DOMContentLoaded', () => {
  const radios = document.querySelectorAll('input[name="theme"]');

  function setTheme(mode) {
    document.body.classList.remove('lightMode', 'darkMode');

    if (mode === 'light') {
      document.body.classList.add('lightMode');
    } else if (mode === 'dark') {
      document.body.classList.add('darkMode');
    } else if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.add(prefersDark ? 'darkMode' : 'lightMode');
    }

    localStorage.setItem('mode', mode);
  }

  // Initialiseer op basis van opgeslagen voorkeur
  const savedMode = localStorage.getItem('mode') || 'auto';
  setTheme(savedMode);

  // Zet de juiste radio button actief
  document.querySelector(`input[name="theme"][value="${savedMode}"]`).checked = true;

  // Event listener op radio buttons
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      setTheme(e.target.value);
    });
  });

  // Luister op systeemverandering als 'auto' geselecteerd is
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('mode') === 'auto') {
      setTheme('auto');
    }
  });
});
