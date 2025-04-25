window.addEventListener("DOMContentLoaded", () => {

  // Use the shared postions instead of redefining them
  const correctPositions = window.itemPositions;

  const bedroom = document.getElementById('bedroom');
  const skybox = document.querySelector('.skybox');

  const lastVisit = localStorage.getItem("lastVisit");
  const now = new Date();
  let daysMissed = 0;

  if (lastVisit) {
    const then = new Date(lastVisit);
    const diffTime = Math.abs(now - then);
    daysMissed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  const allIds = Object.keys(correctPositions);
  if (daysMissed > 2) {
    const numToUnlock = Math.min((daysMissed - 2) * 2, allIds.length);
    const lockedItems = allIds.filter(id => localStorage.getItem(`${id}_locked`) === "true");
    const shuffled = lockedItems.sort(() => 0.5 - Math.random());
    const toUnlock = shuffled.slice(0, numToUnlock);
    toUnlock.forEach(id => localStorage.setItem(`${id}_locked`, "false"));
  }

  localStorage.setItem("lastVisit", now.toISOString());

  function positionItems() {
    const bedroomRect = bedroom.getBoundingClientRect();
    skybox.style.width = `${bedroomRect.width}px`;
    skybox.style.height = `${bedroomRect.height}px`;

    document.querySelectorAll(".draggable").forEach((el) => {
      const id = el.id;
      const isLocked = localStorage.getItem(`${id}_locked`) === "true";

      if (correctPositions[id]) {
        if (isLocked) {
          const correct = correctPositions[id];
          const x = bedroomRect.left + (correct.x / 100) * bedroomRect.width;
          const y = bedroomRect.top + (correct.y / 100) * bedroomRect.height;
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
          el.dataset.x = x;
          el.dataset.y = y;
          el.dataset.locked = "true";
        } else {
          scatterItem(el, bedroomRect);
        }
      }
    });
  }

  function scatterItem(el, bounds) {
    const maxX = bounds.left + bounds.width - el.offsetWidth;
    const maxY = bounds.top + bounds.height - el.offsetHeight;

    const randomX = bounds.left + Math.random() * (maxX - bounds.left);
    const randomY = bounds.top + Math.random() * (maxY - bounds.top);

    el.style.left = `${randomX}px`;
    el.style.top = `${randomY}px`;
    el.dataset.x = randomX;
    el.dataset.y = randomY;
    el.dataset.locked = "false";
  }

  function checkSnap(el, id) {
    const correct = correctPositions[id];
    const bedroomRect = bedroom.getBoundingClientRect();
    const correctX = bedroomRect.left + (correct.x / 100) * bedroomRect.width;
    const correctY = bedroomRect.top + (correct.y / 100) * bedroomRect.height;

    const dx = parseFloat(el.dataset.x || 0) - correctX;
    const dy = parseFloat(el.dataset.y || 0) - correctY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < 50;
  }

  positionItems(); // initial call
  window.addEventListener("resize", positionItems);

  interact('.draggable').draggable({
    listeners: {
      move(event) {
        const el = event.target;
        if (el.dataset.locked === "true") return;

        const x = (parseFloat(el.dataset.x) || 0) + event.dx;
        const y = (parseFloat(el.dataset.y) || 0) + event.dy;

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.dataset.x = x;
        el.dataset.y = y;
      },
      end(event) {
        const el = event.target;
        const id = el.id;

        // Store the result to avoid calling checkSnap multiple times
        const isInCorrectPosition = checkSnap(el, id);

        if (isInCorrectPosition) {
          const correct = correctPositions[id];
          const bedroomRect = bedroom.getBoundingClientRect();
          const x = bedroomRect.left + (correct.x / 100) * bedroomRect.width;
          const y = bedroomRect.top + (correct.y / 100) * bedroomRect.height;

          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
          el.dataset.x = x;
          el.dataset.y = y;
          el.dataset.locked = "true";
          localStorage.setItem(`${id}_locked`, "true");

          // Play sound using the shared function from positions.js
          window.playPopSound(id);
        }
      }
    }
  });
});

//clearlocalstorage
function clearLocalStorage() {
  localStorage.clear();
  console.log('All LocalStorage items cleared');
}
clearLocalStorage();



// Object.keys(localStorage).forEach(key => {
//   if (key.endsWith('_locked')) {
//     localStorage.removeItem(key);
//   }
// });
// localStorage.removeItem('lastVisit');
