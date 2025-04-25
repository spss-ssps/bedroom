const intro = document.getElementById('intro');

// These are the same positions from drag.js
const correctPositions = {
    rj: { x: 40, y: 45 },
    fruit: { x: 50, y: 50 },
    tata: { x: 39, y: 52 },
    sakura: { x: 5, y: 38 },
    libretagise: { x: 15, y: 48 },
    kirby: { x: 4, y: 28 }
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
    // Check the placement status when the page loads
    changeIntro();

    // Check when items are moved
    document.querySelectorAll('.draggable').forEach(item => {
        item.addEventListener('mouseup', function () {
            changeIntro(); // Check placement after each drag
        });

        // Also check on touchend for mobile
        item.addEventListener('touchend', function () {
            changeIntro(); // Check placement after each touch
        });
    });
});

// Add a global event listener for item placement
document.addEventListener('itemsPlacementChanged', function (e) {
    if (e.detail && e.detail.allPlaced) {
        changeIntro(); // Update text when placement is complete
    }
});

function changeIntro() {
    intro.innerHTML = "";

    if (checkAllItemsPlaced()) {
        text = "Place looks good!";
    } else {
        text = "I probably should put everything back in its place.";
    }

    typingAnim(text);
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
    if (placedItems == maxItems) {
        allCorrect = true;
    } else {
        allCorrect = false;
    }
    
    return allCorrect;
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



//old code

// // These are the same percentages from drag.js
// const intro = document.getElementById('intro');

// const correctPositions = {
//     rj: { x: 40, y: 45 },
//     fruit: { x: 50, y: 50 },
//     tata: { x: 39, y: 52 },
//     sakura: { x: 5, y: 38 },
//     libretagise: { x: 15, y: 48 },
//     kirby: { x: 4, y: 28 }
// };

// function typingAnim(text) {
//     const words = text.split(' ');

//     // Add each word with animation delay
//     words.forEach((word, index) => {
//         const span = document.createElement('span');
//         span.textContent = word; // Just the word without space
//         span.className = 'word';
//         span.style.animationDelay = `${index * 0.3}s`; // Delay each word
//         intro.appendChild(span);

//         // Add a space after each word (except the last one)
//         if (index < words.length - 1) {
//             const space = document.createTextNode(' ');
//             intro.appendChild(space);
//         }
//     });
// }


// document.addEventListener('DOMContentLoaded', function () {

//      //check if all items are placed


//     changeIntro()

//     // Check when items are moved
//     document.querySelectorAll('.draggable').forEach(item => {
//         item.addEventListener('mouseup', function () {

//             changeIntro()

//         });

//         // Also check on touchend for mobile
//         item.addEventListener('touchend', function () {

//             changeIntro()
//         });
//     });

// });

// // Add a global event listener for item placement
// document.addEventListener('itemsPlacementChanged', function (e) {
//     if (e.detail && e.detail.allPlaced) {
//         changeIntro();
//     }
// });



// function changeIntro() {
// intro.innerHTML = "";


//     if (checkAllItemsPlaced()) {
//         text = "place looks good!";
//     }
//     else {
//         text = "i probably should put everying back in its place";
//     };

//     typingAnim(text);
// }



// // Function to check if all items are in their correct positions
// function checkAllItemsPlaced() {
//     const bedroom = document.getElementById('bedroom');
//     const bedroomRect = bedroom.getBoundingClientRect();
//     let allCorrect = true;
//     const tolerance = 50; // Pixels of tolerance
//     const maxItems = 6;
//     let placedItems = 0 ;

//     document.querySelectorAll('.draggable').forEach(item => {
//         const id = item.id;
//         if (!correctPositions[id]) return; // Skip if no position defined

//         // Calculate correct position based on bedroom dimensions (same as drag.js)
//         const correctX = bedroomRect.left + (correctPositions[id].x / 100) * bedroomRect.width;
//         const correctY = bedroomRect.top + (correctPositions[id].y / 100) * bedroomRect.height;

//         // Get current position
//         const rect = item.getBoundingClientRect();
//         const centerX = rect.left + rect.width / 2;
//         const centerY = rect.top + rect.height / 2;

//         // Calculate distance
//         const dx = centerX - correctX;
//         const dy = centerY - correctY;
//         const dist = Math.sqrt(dx * dx + dy * dy);

//         if (dist < tolerance) {
//             placedItems++;
//         }
//     });

//     if (placedItems == maxItems) {
//         allCorrect = true;
//     } else {
//         allCorrect = false; 
//     }
//     return allCorrect;
// }