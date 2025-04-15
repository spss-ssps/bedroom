const DAY = {
    top: [135, 206, 235],     
    bottom: [252, 234, 187]
  };
  
  const NIGHT = {
    top: [10, 10, 54],       
    bottom: [0, 0, 50]
  };
  
  const box = document.querySelector('.skybox');
  const manualTimeInput = document.getElementById('manualTime');
//   const realTimeBtn = document.getElementById('realTimeBtn');
  

  let useRealTime = true;
  let manualTimeValue = 12;
  
  // Linear interpolation
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  
  // Interpolate color arrays
  function interpolateColor(c1, c2, t) {
    return c1.map((v, i) => Math.round(lerp(v, c2[i], t)));
  }
  
  // Convert RGB array to CSS string
  function rgbString(rgb) {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }
  
  // Format time as "hh:mm"
  function formatForInput(h, m) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  
  // Update gradient colors based on time
  function updateGradient(timeValue) {
    const t = (timeValue % 24) / 24;
    const dayFactor = Math.sin(Math.PI * t); // smooth curve
  
    const topColor = interpolateColor(NIGHT.top, DAY.top, dayFactor);
    const bottomColor = interpolateColor(NIGHT.bottom, DAY.bottom, dayFactor);
  
    box.style.setProperty('--color-top', rgbString(topColor));
    box.style.setProperty('--color-bottom', rgbString(bottomColor));
  }
  
  // Listen to manual time input
  manualTimeInput.addEventListener('input', () => {
    const value = manualTimeInput.value.trim();
  
    // Check if it matches "hh:mm"
    if (/^\d{1,2}:\d{2}$/.test(value)) {
      const [h, m] = value.split(':').map(Number);
      if (h >= 0 && h < 24 && m >= 0 && m < 60) {
        useRealTime = false;
        manualTimeValue = h + m / 60;
      }
    }
  });
  
  // Button: switch back to real time
//   realTimeBtn.addEventListener('click', () => {
//     useRealTime = true;
//   });
  
  // Animation loop
  function loop() {
    let timeValue;
  
    if (useRealTime) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      timeValue = hours + minutes / 60;
  
      // Update input to match real time
      manualTimeInput.value = formatForInput(hours, minutes);
    } else {
      timeValue = manualTimeValue;
    }
  
    updateGradient(timeValue);
    requestAnimationFrame(loop);
  }
  
  // On load: set input to current time
  (function initInput() {
    const now = new Date();
    manualTimeInput.value = formatForInput(now.getHours(), now.getMinutes());
  })();
  
  loop();
  