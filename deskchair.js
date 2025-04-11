let deskchair = document.getElementById('deskchair');
let isDragging = false;
let startX;
let scrollLeft;

// Make the element draggable
deskchair.setAttribute('draggable', 'true');

// Track when drag starts
deskchair.addEventListener('dragstart', function(e) {
    isDragging = true;
    startX = e.clientX;
    scrollLeft = deskchair.offsetLeft;
    
    // This helps with the drag operation
    e.dataTransfer.setData('text/plain', '');
});

// Track drag movement
document.addEventListener('drag', function(e) {
    if (!isDragging) return;
    
    // Calculate the new position
    const x = e.clientX;
    const walk = x - startX;
    deskchair.style.left = `${scrollLeft + walk}px`;
});

// Track when drag ends
deskchair.addEventListener('dragend', function() {
    isDragging = false;
});
