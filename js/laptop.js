window.addEventListener('DOMContentLoaded', () => {
  const laptop = document.getElementById('laptop');
  const desktop = document.getElementById('laptop-screen');

  laptop.addEventListener('click', (e) => {
    e.stopPropagation();
    desktop.classList.remove('hidden');
    laptop.classList.add('hidden');
  });

  document.addEventListener('click', function (e) {
    if (
      !desktop.classList.contains('hidden') && 
      e.target !== laptop &&
      e.target !== desktop
    ) {
      desktop.classList.add('hidden');
      laptop.classList.remove('hidden');
    }
  });
});
