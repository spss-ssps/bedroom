// Save the user's acceptance and handle UI display logic

function acceptMessage() {
  const now = new Date();
  localStorage.setItem("acceptedMessageDate", now.toDateString());

  // Hide call notification and buttons
  document.getElementById("message-nonna").style.display = "none";
  document.getElementById("accept").style.display = "none";
  document.getElementById("decline").style.display = "none";

  // Show the full message content
  const content = document.getElementById("message-content");
  content.style.display = "block";

  // Allow clicking anywhere to hide the message
  const clickHandler = () => {
    content.style.display = "none";
    document.removeEventListener("click", clickHandler);
  };

  // Slight delay so the first click doesn't instantly hide it
  setTimeout(() => {
    document.addEventListener("click", clickHandler);
  }, 100);
}

function rejectMessage() {
  // Hide all elements without storing a response
  document.getElementById("message-nonna").style.display = "none";
  document.getElementById("accept").style.display = "none";
  document.getElementById("decline").style.display = "none";
}

// Export functions to global scope
window.acceptMessage = acceptMessage;
window.rejectMessage = rejectMessage;
