// Constants for when to show the message
const CALL_DELAY_MS = 2 * 60 * 1000; // 2 minutes in milliseconds
console.log(`Phone call will appear in ${CALL_DELAY_MS / 1000} seconds (${CALL_DELAY_MS / 60000} minutes) if not shown today`);

const manualTimeInput = document.getElementById('manualTime');
let timeValue = 12;
let useRealTime = true;
let pageLoadTime = new Date(); // Track when the page was loaded
let callScheduled = false; // Track if call is scheduled

// Check if call was already shown today
const now = new Date();
const today = now.toDateString();
const callReceivedToday = localStorage.getItem("callReceivedDate") === today;
if (callReceivedToday) {
  console.log("Phone call already shown today - won't appear again until tomorrow");
} else {
  const callTime = new Date(now.getTime() + CALL_DELAY_MS);
  console.log(`Phone call scheduled to appear at: ${callTime.toLocaleTimeString()}`);
}

// 🔄 Manual time input listener
manualTimeInput.addEventListener('input', function () {
  const value = manualTimeInput.value.trim();

  if (/^\d{1,2}:\d{2}$/.test(value)) {
    const [h, m] = value.split(':').map(Number);
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      useRealTime = false;
      timeValue = h + m / 60; // Convert to decimal
    }
  }
});

// 🌅 Update background gradient based on time
function updateGradient(timeValue) {
  const t = (timeValue % 24) / 24;
  const dayFactor = Math.sin(Math.PI * t); // Smooth transition

  const DAY = {
    top: [135, 206, 235],
    bottom: [252, 234, 187]
  };
  const NIGHT = {
    top: [8, 8, 46],
    bottom: [0, 0, 50]
  };

  const topColor = interpolateColor(NIGHT.top, DAY.top, dayFactor);
  const bottomColor = interpolateColor(NIGHT.bottom, DAY.bottom, dayFactor);

  const box = document.querySelector('.skybox');
  box.style.setProperty('--color-top', rgbString(topColor));
  box.style.setProperty('--color-bottom', rgbString(bottomColor));
}

// 🧮 Helper: interpolate between two colors
function interpolateColor(c1, c2, t) {
  return c1.map((v, i) => Math.round(lerp(v, c2[i], t)));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function rgbString(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// 🕒 Format time to input value (hh:mm)
function formatForInput(h, m) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// 📞 Check if the message should be shown now
function checkAndShowMessage() {
  const now = new Date();
  const today = now.toDateString();
  const callReceivedToday = localStorage.getItem("callReceivedDate") === today;

  // If call has already been received today, don't show it again
  if (callReceivedToday) {
    return;
  }

  // Schedule the call if it hasn't been scheduled yet
  if (!callScheduled) {
    callScheduled = true;
    console.log(`Call timer started. Will appear in ${CALL_DELAY_MS / 1000} seconds`);

    setTimeout(() => {
      // Only show if it hasn't been shown today
      if (localStorage.getItem("callReceivedDate") !== today) {
        const messagePopup = document.getElementById("notification");
        const acceptBtn = document.getElementById("accept");
        const declineBtn = document.getElementById("decline");

        if (messagePopup) messagePopup.style.display = "block";
        if (acceptBtn) acceptBtn.style.display = "block";
        if (declineBtn) declineBtn.style.display = "block";

        console.log(`PHONE CALL APPEARING NOW: ${new Date().toLocaleTimeString()}`);

        // Mark that call has been received today
        localStorage.setItem("callReceivedDate", today);
      }
    }, CALL_DELAY_MS);
  }
}

// 🔁 Main loop that runs every frame
function loop() {
  let currentHour, currentMinute;

  if (useRealTime) {
    const now = new Date();
    currentHour = now.getHours();
    currentMinute = now.getMinutes();
    timeValue = currentHour + currentMinute / 60;

    manualTimeInput.value = formatForInput(currentHour, currentMinute);
  } else {
    const hours = Math.floor(timeValue);
    const minutes = Math.round((timeValue - hours) * 60);
    currentHour = hours;
    currentMinute = minutes;
  }

  updateGradient(timeValue);
  checkAndShowMessage();

  requestAnimationFrame(loop);
}

// ⏱️ On page load, initialize time input to current time
(function initInput() {
  const now = new Date();
  manualTimeInput.value = formatForInput(now.getHours(), now.getMinutes());
})();

loop(); // Start the animation loop
