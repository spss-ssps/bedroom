const DAY = {
    top: [135, 206, 235],      // sky blue
    bottom: [252, 234, 187]    // soft orange
  };

  const NIGHT = {
    top: [25, 25, 112],        // midnight blue
    bottom: [0, 0, 50]         // deep navy
  };

  const box = document.querySelector('.skybox');

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function interpolateColor(c1, c2, t) {
    return c1.map((v, i) => Math.round(lerp(v, c2[i], t)));
  }

  function rgbString(rgb) {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }

  function updateGradient() {
    const now = new Date();
    const hours = now.getHours() + now.getMinutes() / 60;
    const t = (hours % 24) / 24;  // 0 to 1

    // Create a soft sine wave for smooth day-night transition
    const dayFactor = Math.sin(Math.PI * t);

    const topColor = interpolateColor(NIGHT.top, DAY.top, dayFactor);
    const bottomColor = interpolateColor(NIGHT.bottom, DAY.bottom, dayFactor);

    box.style.setProperty('--color-top', rgbString(topColor));
    box.style.setProperty('--color-bottom', rgbString(bottomColor));

    requestAnimationFrame(updateGradient);
  }

  updateGradient();