document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggleMode';
    toggleBtn.innerText = 'dark/light Mode';
    document.body.appendChild(toggleBtn);
  
    const applyMode = () => {
      const mode = localStorage.getItem('mode');
      if (mode === 'dark') {
        document.body.classList.add('lightMode');
      } else {
        document.body.classList.remove('lightMode');
      }
    };
  
    toggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('lightMode');
      localStorage.setItem('mode', isDark ? 'dark' : 'light');
    });
  
    applyMode();
  });