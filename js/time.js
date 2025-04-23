const MESSAGE_HOUR = 23;  // The hour when the message should appear
const MESSAGE_MINUTE = 7; // The minute when the message should appear

const manualTimeInput = document.getElementById('manualTime');
let timeValue = 12; // Default time value (start with noon)

let useRealTime = true;  // This will control whether we're using real-time or manual time input

// Listen for changes in the manual time input
manualTimeInput.addEventListener('input', function() {
  const value = manualTimeInput.value.trim();

  // If input matches "hh:mm" format, we update the timeValue
  if (/^\d{1,2}:\d{2}$/.test(value)) {
    const [h, m] = value.split(':').map(Number);
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      useRealTime = false;
      timeValue = h + m / 60; // Set the timeValue to the manual input time
    }
  }
});

// Update gradient for day-night cycle
function updateGradient(timeValue) {
  const t = (timeValue % 24) / 24; // Normalize to a [0, 1] range
  const dayFactor = Math.sin(Math.PI * t); // Sine curve for smoother transitions

  const DAY = {
    top: [135, 206, 235], // Day sky color
    bottom: [252, 234, 187] // Day ground color
  };
  const NIGHT = {
    top: [8, 8, 46], // Night sky color
    bottom: [0, 0, 50] // Night ground color
  };

  // Interpolate between day and night colors
  const topColor = interpolateColor(NIGHT.top, DAY.top, dayFactor);
  const bottomColor = interpolateColor(NIGHT.bottom, DAY.bottom, dayFactor);

  // Set the skybox colors using CSS variables
  const box = document.querySelector('.skybox');
  box.style.setProperty('--color-top', rgbString(topColor));
  box.style.setProperty('--color-bottom', rgbString(bottomColor));
}

// Interpolate between two colors
function interpolateColor(c1, c2, t) {
  return c1.map((v, i) => Math.round(lerp(v, c2[i], t)));
}

// Linear interpolation function
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Convert RGB array to CSS string
function rgbString(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// Format the time for the input field
function formatForInput(h, m) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Function to check if it's time to show the message
function checkAndShowMessage(currentHour, currentMinute) {
  const now = new Date();
  const acceptedToday = localStorage.getItem("acceptedMessageDate") === now.toDateString();

  if (
    !acceptedToday && 
    currentHour === MESSAGE_HOUR && 
    currentMinute === MESSAGE_MINUTE
  ) {
    const messagePopup = document.getElementById("message-nonna");
    if (messagePopup) messagePopup.style.display = "block"; // Show the call notification
  }
}

// The main loop that checks for updates
function loop() {
  let currentHour, currentMinute;

  if (useRealTime) {
    // Use the current real time
    const now = new Date();
    currentHour = now.getHours();
    currentMinute = now.getMinutes();
    timeValue = currentHour + currentMinute / 60;

    // Update the time input field to reflect the real-time hour and minute
    manualTimeInput.value = formatForInput(currentHour, currentMinute);
  } else {
    // Use manual time input if set
    const hours = Math.floor(timeValue);
    const minutes = Math.round((timeValue - hours) * 60);
    currentHour = hours;
    currentMinute = minutes;
  }

  // Update the gradient background based on the time value
  updateGradient(timeValue);

  // Check and show the message if the time is right
  checkAndShowMessage(currentHour, currentMinute);

  // Continue the loop for the next frame
  requestAnimationFrame(loop);
}

// Initialize input to current time on page load
(function initInput() {
  const now = new Date();
  manualTimeInput.value = formatForInput(now.getHours(), now.getMinutes());
})();

// Start the loop
loop();

// " : " stuff