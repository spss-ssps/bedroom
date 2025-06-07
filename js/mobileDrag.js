document.addEventListener('DOMContentLoaded', function () {
  // Simple helper for better mobile drag
  const draggables = document.querySelectorAll('.draggable');

  draggables.forEach(el => {
    // Add visual feedback during drag
    el.addEventListener('touchstart', () => {
      el.classList.add('is-dragging');
    });

    el.addEventListener('touchend', () => {
      el.classList.remove('is-dragging');
    });

    // Prevent default scrolling when touching draggable elements
    el.addEventListener('touchmove', (e) => {
      // Still allow scrolling if item is locked
      if (!el.dataset.locked) {
        e.preventDefault();
      }
    }, { passive: false });
  });

  // Simple tap-to-place for very small screens
  if (window.innerWidth < 600) {
    const bedroom = document.getElementById('bedroom');

    draggables.forEach(el => {
      el.addEventListener('click', function () {
        const id = this.id;
        if (this.dataset.locked !== "true" && window.itemPositions && window.itemPositions[id]) {
          const position = window.itemPositions[id]; // Use existing itemPositions
          const bedroomRect = bedroom.getBoundingClientRect();
          const x = bedroomRect.left + (position.x / 100) * bedroomRect.width;
          const y = bedroomRect.top + (position.y / 100) * bedroomRect.height;

          // Allow a simple tap to position on very small screens
          this.style.transition = "all 0.3s ease";
          this.style.left = `${x}px`;
          this.style.top = `${y}px`;

          // Check if this aligns with your locking logic
          this.dataset.locked = "true";
          localStorage.setItem(`${id}_locked`, "true");
          localStorage.setItem(`${id}_placed`, "true");

          // Use existing playPopSound function
          if (window.playPopSound) {
            window.playPopSound(id);
          }

          setTimeout(() => {
            this.style.transition = "";
          }, 300);
        }
      });
    });
  }
});
