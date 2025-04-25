const intro = document.getElementById('intro');
let messageShown = false; // Flag to track if message has been shown

// These are the same positions from drag.js
const correctPositions = {
    rj: { x: 40, y: 45 },
    fruit: { x: 50, y: 50 },
    tata: { x: 39, y: 52 },
    sakura: { x: 5, y: 38 },
    libretagise: { x: 15, y: 48 },
    kirby: { x: 4, y: 28 },
    sonny: { x: 15, y: 24 },
};

function typingAnim(text) {
    const words = text.split(' ');

    // Add each word with animation delay
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word; // Just the word without space
        span.className = 'word';
        span.style.animationDelay = `${index * 0.3}s`; // Delay each word
        intro.appendChild(span);

        // Add a space after each word (except the last one)
        if (index < words.length - 1) {
            const space = document.createTextNode(' ');
            intro.appendChild(space);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");
    
    // Show initial message when page loads
    changeIntro(true);
    
    // Mark the initial message as shown
    messageShown = true;

    // Check when items are moved
    document.querySelectorAll('.draggable').forEach(item => {
        item.addEventListener('mouseup', function () {
            // Only show message when all items are placed
            if (checkAllItemsPlaced()) {
                changeIntro(false);
            }
        });

        // Also check on touchend for mobile
        item.addEventListener('touchend', function () {
            // Only show message when all items are placed
            if (checkAllItemsPlaced()) {
                changeIntro(false);
            }
        });
    });
});

// Add a global event listener for item placement
document.addEventListener('itemsPlacementChanged', function (e) {
    if (e.detail && e.detail.allPlaced) {
        changeIntro(false); // Update text when placement is complete
    }
});

function changeIntro(isPageLoad) {
    intro.innerHTML = "";
    let text;

    if (checkAllItemsPlaced()) {
        text = "Place looks good!";
        // Always show the completion message
        typingAnim(text);
    } else if (isPageLoad) {
        // Only show initial message on page load
        text = "I probably should put everything back in its place.";
        typingAnim(text);
    }
    // Don't show any message if not page load and not all items placed
}

// Function to check if all items are placed correctly (checking localStorage values)
function checkAllItemsPlaced() {
    let allCorrect = true;
    const maxItems = 6; // Number of items
    let placedItems = 0;

    document.querySelectorAll('.draggable').forEach(item => {
        const id = item.id;

        // Skip if no position defined for item
        if (!correctPositions[id]) return;

        // Get the position from localStorage to check if it's placed
        const isPlaced = localStorage.getItem(`${id}_placed`) === "true";

        if (isPlaced) {
            placedItems++;
        }
    });

    console.log(`Items placed: ${placedItems}/${maxItems}`);
    // If all items are placed, return true
    return placedItems === maxItems;
}

// In drag.js file, make sure to update localStorage after each item is placed:
function updateItemPlacement(id) {
    localStorage.setItem(`${id}_placed`, "true");
    console.log(`Item ${id} placed correctly`);
}

// In drag.js's "end" event of the draggable items, call updateItemPlacement:
interact('.draggable').draggable({
    listeners: {
        end(event) {
            const el = event.target;
            const id = el.id;

            // Check if the item is placed correctly and update localStorage
            if (checkSnap(el, id)) {
                updateItemPlacement(id);  // Mark item as placed in localStorage
            }
        }
    }
});