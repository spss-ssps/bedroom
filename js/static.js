function syncSkyboxSize() {
    const bedroom = document.getElementById('bedroom');
    const skybox = document.querySelector('.skybox');

      const bookshelf = document.getElementById('bookshelfside');
      const journal = document.getElementById('journal');
      const laptop = document.getElementById('laptop');
      const deskchair = document.getElementById('deskchair');
      const controls = document.querySelector('.controls');
  
    if (bedroom) {
      const rect = bedroom.getBoundingClientRect();
  
      // Resize skybox to match bedroom
      if (skybox) {
        skybox.style.width = `${rect.width}px`;
        skybox.style.height = `${rect.height}px`;
      }
  
      // Position bookshelfside relative to bedroom
      if (bookshelf) {
        const x = rect.left + 0.0001 * rect.width;
        const y = rect.top + rect.height - bookshelf.offsetHeight;
  
        bookshelf.style.left = `${x}px`;
        bookshelf.style.top = `${y}px`;
      }

      // Position journal
      if (journal) {
        const x = rect.left + rect.width * (1 - 0.08) - journal.offsetWidth; // right: 25%
        const y = rect.top + rect.height * (1 - 0.19) - journal.offsetHeight; // bottom: 17%
        journal.style.left = `${x}px`;
        journal.style.top = `${y}px`;
      }

      // Position laptop
      if (laptop) {
        const x = rect.left + rect.width * (1 - 0.13) - laptop.offsetWidth; // right: 29%
        const y = rect.top + rect.height * (1 - 0.33) - laptop.offsetHeight; // bottom: 32%
        laptop.style.left = `${x}px`;
        laptop.style.top = `${y}px`;
      }

      // Position deskchair
      if (deskchair) {
        const x = rect.left + rect.width * (1 - 0.20) - deskchair.offsetWidth; // right: 30%
        const y = rect.top + rect.height * (1 - 0.06) - deskchair.offsetHeight; // bottom: 6%
        deskchair.style.left = `${x}px`;
        deskchair.style.top = `${y}px`;
      }

      if (controls) {
        const x = rect.left + rect.width * (1 - 0.435); // right: 43.5%
        const y = rect.top + rect.height * (0.13); // top: 13vh
        controls.style.left = `${x}px`;
        controls.style.top = `${y}px`;
      }
    }
  }
  
  window.addEventListener('load', syncSkyboxSize);
  window.addEventListener('resize', syncSkyboxSize);
  