window.addEventListener("DOMContentLoaded", () => {
  const correctPositions = {
    rj: { x: 43, y: 45 },
    fruit: { x: 48, y: 50 },
    tata: { x: 43, y: 53 },
    sakura: { x: 25, y: 38 },
    deskchair: { x: 70, y: 94 }

  };

  const lastVisit = localStorage.getItem("lastVisit");
  const now = new Date();
  let daysMissed = 0;

  if (lastVisit) {
    const then = new Date(lastVisit);
    const diffTime = Math.abs(now - then);
    daysMissed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  // Auto-unlock logic
const allIds = Object.keys(correctPositions);

if (daysMissed > 2) {
  const numToUnlock = Math.min((daysMissed - 2) * 2, allIds.length);

  const lockedItems = allIds.filter(id => localStorage.getItem(`${id}_locked`) === "true");
  const shuffled = lockedItems.sort(() => 0.5 - Math.random());
  const toUnlock = shuffled.slice(0, numToUnlock);

  toUnlock.forEach(id => {
    localStorage.setItem(`${id}_locked`, "false");
  });
}


  localStorage.setItem("lastVisit", now.toISOString());

  // 💡 Scatter images randomly within the screen
  function scatterItem(el, id) {
    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    el.style.left = `${randomX}px`;
    el.style.top = `${randomY}px`;
    el.dataset.x = randomX;
    el.dataset.y = randomY;
    el.dataset.locked = "false";
  }

  function checkSnap(el, id) {
    const correct = correctPositions[id];
    const correctX = (correct.x / 100) * window.innerWidth;
    const correctY = (correct.y / 100) * window.innerHeight;

    const dx = parseFloat(el.dataset.x || 0) - correctX;
    const dy = parseFloat(el.dataset.y || 0) - correctY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < 50; // pixel threshold
  }

  // Position elements
  document.querySelectorAll(".draggable").forEach((el) => {
    const id = el.id;
    const isLocked = localStorage.getItem(`${id}_locked`) === "true";

    if (isLocked) {
      const correct = correctPositions[id];
      const x = (correct.x / 100) * window.innerWidth;
      const y = (correct.y / 100) * window.innerHeight;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.dataset.x = x;
      el.dataset.y = y;
      el.dataset.locked = "true";
    } else {
      scatterItem(el, id);
    }
  });

  // Draggable interaction
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

        if (checkSnap(el, id)) {
          const correct = correctPositions[id];
          const x = (correct.x / 100) * window.innerWidth;
          const y = (correct.y / 100) * window.innerHeight;

          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
          el.dataset.x = x;
          el.dataset.y = y;
          el.dataset.locked = "true";
          localStorage.setItem(`${id}_locked`, "true");
        }
      }
    }
  });
});

// Object.keys(localStorage).forEach(key => {
//   if (key.endsWith('_locked')) {
//     localStorage.removeItem(key);
//   }
// });
// localStorage.removeItem('lastVisit');
