// Time to trigger the message
const MESSAGE_HOUR = 23;
const MESSAGE_MINUTE = 7;


// Check if the message should be shown
function checkAndShowMessage(currentHour, currentMinute) {
  const now = new Date();
  const acceptedToday = localStorage.getItem("acceptedMessageDate") === now.toDateString();

  if (
    !acceptedToday &&
    currentHour === MESSAGE_HOUR &&
    currentMinute === MESSAGE_MINUTE
  ) {
    const popup = document.getElementById("message-popup");
    if (popup) popup.style.display = "block";
  }
}

// Handle user accepting the message
function acceptMessage() {
  const now = new Date();
  localStorage.setItem("acceptedMessageDate", now.toDateString());

  const popup = document.getElementById("message-popup");
  const content = document.getElementById("message-content");

  if (popup) popup.style.display = "none";
  if (content) content.style.display = "block";
}

// Expose the check function globally
window.checkAndShowMessage = checkAndShowMessage;
window.acceptMessage = acceptMessage;
