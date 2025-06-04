let currentViewedDate = new Date();

function formatDateKey(date) {
  return `journal-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function updateJournalView() {
  const journalText = document.getElementById('journal-text');
  const dateKey = formatDateKey(currentViewedDate);
  const saved = localStorage.getItem(dateKey);
  const displayDate = currentViewedDate.toLocaleDateString();

  document.getElementById('current-date').textContent = displayDate;
  journalText.value = saved || "";

  // Only allow editing for today
  const isToday = formatDateKey(currentViewedDate) === formatDateKey(new Date());
  journalText.readOnly = !isToday;
  journalText.style.backgroundColor = isToday ? 'white' : '#ddd';
}

// Open journal modal
document.getElementById('journal').addEventListener('click', function () {
  currentViewedDate = new Date(); // reset to today when opening
  document.getElementById('journal-modal').classList.remove('hidden');
  updateJournalView();
});

// Auto-save today's entry on input
document.getElementById('journal-text').addEventListener('input', function () {
  const dateKey = formatDateKey(currentViewedDate);
  const isToday = formatDateKey(currentViewedDate) === formatDateKey(new Date());

  if (isToday) {
    localStorage.setItem(dateKey, this.value);
  }
});

// Close when clicking outside modal
document.addEventListener('click', function (e) {
  const modal = document.getElementById('journal-modal');
  const container = document.querySelector('.journal-container');
  const journalIcon = document.getElementById('journal');

  if (!modal.classList.contains('hidden') &&
    !container.contains(e.target) &&
    e.target !== journalIcon) {
    modal.classList.add('hidden');
  }
});

// Navigate only to days that have saved entries
document.addEventListener('keydown', function (e) {
  const modal = document.getElementById('journal-modal');
  if (modal.classList.contains('hidden')) return;

  let newDate = new Date(currentViewedDate);

  if (e.key === 'ArrowLeft') {
    do {
      newDate.setDate(newDate.getDate() - 1);
    } while (
      formatDateKey(newDate) !== formatDateKey(currentViewedDate) &&
      !localStorage.getItem(formatDateKey(newDate)) &&
      newDate > new Date(2000, 0, 1) // reasonable lower bound
    );
  }

  if (e.key === 'ArrowRight') {
    do {
      newDate.setDate(newDate.getDate() + 1);
    } while (
      formatDateKey(newDate) !== formatDateKey(currentViewedDate) &&
      !localStorage.getItem(formatDateKey(newDate)) &&
      newDate < new Date() // can't go into future
    );
  }

  // Only update if a different valid entry is found
  if (formatDateKey(newDate) !== formatDateKey(currentViewedDate) &&
    localStorage.getItem(formatDateKey(newDate))) {
    currentViewedDate = newDate;
    updateJournalView();
  }
});

function findNearestEntry(direction) {
  const startDate = new Date(currentViewedDate);
  let checkDate = new Date(startDate);
  const limit = direction === 'prev' ? new Date(2020, 0, 1) : new Date();
  const increment = direction === 'prev' ? -1 : 1;

  // Step through days one at a time
  while ((direction === 'prev' && checkDate >= limit) ||
    (direction === 'next' && checkDate <= limit)) {

    checkDate.setDate(checkDate.getDate() + increment);
    const key = formatDateKey(checkDate);

    // If we found an entry, use that date
    if (localStorage.getItem(key)) {
      currentViewedDate = new Date(checkDate);
      updateJournalView();
      return true;
    }
  }

  return false; // No entry found
}

// Then use it in your event handlers
document.getElementById('prev-entry').addEventListener('click', function () {
  findNearestEntry('prev');
});

document.getElementById('next-entry').addEventListener('click', function () {
  findNearestEntry('next');
});
