const MESSAGE_HOUR = 10;
const MESSAGE_MINUTE = 35;

function checkAndShowMessage(currentHour, currentMinute) {
  const now = new Date();
  const acceptedToday = localStorage.getItem("acceptedMessageDate") === now.toDateString();

  if (
    !acceptedToday &&
    currentHour === MESSAGE_HOUR &&
    currentMinute === MESSAGE_MINUTE
  ) {
    document.getElementById("message-nonna").style.display = "block";
    document.getElementById("accept").style.display = "block";
    document.getElementById("decline").style.display = "block";
  }
}

function acceptMessage() {
  const now = new Date();
  localStorage.setItem("acceptedMessageDate", now.toDateString());

  document.getElementById("message-nonna").style.display = "none";
  document.getElementById("accept").style.display = "none";
  document.getElementById("decline").style.display = "none";

  document.getElementById("message-content").style.display = "block";
}

function rejectMessage() {
  document.getElementById("message-nonna").style.display = "none";
  document.getElementById("accept").style.display = "none";
  document.getElementById("decline").style.display = "none";
}

window.checkAndShowMessage = checkAndShowMessage;
window.acceptMessage = acceptMessage;
window.rejectMessage = rejectMessage;
