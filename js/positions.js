// This file contains shared positions data for the app

// Define the positions as percentages of the bedroom dimensions
window.itemPositions = {
  rj: { x: 40, y: 45 },
  fruit: { x: 50, y: 50 },
  tata: { x: 39, y: 52 },
  sakura: { x: 5, y: 38 },
  libretagise: { x: 15, y: 48},
  kirby: { x: 4, y: 28 },
  sonny: { x: 15, y: 24 },
};

// Keep track of which items have played their sound
window.soundPlayed = {};

// Function to play the pop sound
window.playPopSound = function(id) {
  const popSound = document.getElementById('pop');
  popSound.currentTime = 0;
  popSound.play();
  
  // Set item-specific flags if needed
  if (id === 'sakura') {
    localStorage.setItem("sakura_placed", "true");
  }
  if (id === 'fruit') {
    localStorage.setItem("fruit_placed", "true");
  }
  if (id === 'sonny') {
    localStorage.setItem("sonny_placed", "true");
  }
  if (id === 'libretagise') {
    localStorage.setItem("libretagise_placed", "true");
  }
    if (id === 'tata') {
        localStorage.setItem("tata_placed", "true");
    }
    if (id === 'rj') {
        localStorage.setItem("rj_placed", "true");
    }
    if (id === 'kirby') {
        localStorage.setItem("kirby_placed", "true");
    }
};

// Helper function to check if all items are in correct positions
window.checkAllItemsInPlace = function(tolerance = 50) {
  const bedroom = document.getElementById('bedroom');
  const bedroomRect = bedroom.getBoundingClientRect();
  let allCorrect = true;
  
  document.querySelectorAll('.draggable').forEach(item => {
    const id = item.id;
    if (!window.itemPositions[id]) return; // Skip if no position defined
    
    // Calculate correct position based on bedroom dimensions
    const correctX = bedroomRect.left + (window.itemPositions[id].x / 100) * bedroomRect.width;
    const correctY = bedroomRect.top + (window.itemPositions[id].y / 100) * bedroomRect.height;
    
    // Get current position
    const rect = item.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    
    // Calculate distance
    const dx = centerX - correctX;
    const dy = centerY - correctY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > tolerance) {
      allCorrect = false;
    }
  });
  
  return allCorrect;
};

// Add event listeners to draggable items
document.addEventListener('DOMContentLoaded', function() {
  // Initialize soundPlayed for each draggable
  document.querySelectorAll('.draggable').forEach(item => {
    window.soundPlayed[item.id] = false;
    
    // Check position after drag
    item.addEventListener('mouseup', function() {
      setTimeout(() => {
        window.checkAllItemsInPlace();
      }, 100);
    });
    
    // For touch devices
    item.addEventListener('touchend', function() {
      setTimeout(() => {
        window.checkAllItemsInPlace();
      }, 100);
    });
  });
});