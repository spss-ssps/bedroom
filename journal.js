function saveJournal() {
    const content = document.getElementById('journal-text').value;
    localStorage.setItem('journalEntry', content);
  }
  

document.getElementById('journal').addEventListener('click', function () {
    const journalText = document.getElementById('journal-text');
    const saved = localStorage.getItem('journalEntry');
    const today = new Date().toLocaleDateString();
  
    document.getElementById('current-date').textContent = `${today}`;
  
    journalText.value = saved || "";
    document.getElementById('journal-modal').classList.remove('hidden');
  });

    //closebutton 
  document.getElementById('close-journal').addEventListener('click', function () {
    document.getElementById('journal-modal').classList.add('hidden');
  });
  