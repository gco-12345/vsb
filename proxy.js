//fron chatgpt might change later
// 💾 LOAD EXISTING BOOKMARKS OR START FRESH
let myBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
drawMyBookmarks(); // 🚀 KICK THINGS OFF

// 🚀 SUPER REDIRECT FUNCTION
function redrict() {
  let linkInput = document.getElementById('url').value;
  let finalURL;

  if (checkIfURL(linkInput)) {
    finalURL = linkInput.startsWith('http') ? linkInput : 'https://' + linkInput;
  } else {
    finalURL = 'https://www.google.com/search?q=' + encodeURIComponent(linkInput);
  }

  // LOADING IFRAME THINGY ✨
  let splashFrame = document.createElement('iframe');
  splashFrame.src = 'loading.html';
  splashFrame.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  `;
  document.body.appendChild(splashFrame);

  let newTab = window.open('loading.html');
  setTimeout(() => {
    let tabCheck = newTab || "Blocked";
    if (tabCheck === "Blocked" || !newTab || newTab.closed || typeof newTab.closed === "undefined") {
      window.location.href = finalURL;
    } else {
      newTab.location.href = finalURL;
      setTimeout(() => document.body.removeChild(splashFrame), 500);
    }
  }, 1000);
}

// ✅ CHECKS IF IT'S A URL
function checkIfURL(str) {
  const regex = /^(https?:\/\/)?([\w\d-]+\.)+[\w]{2,}(\/.*)?$/;
  return regex.test(str);
}

// 😎 CUSTOM TEXT BOX PROMPT
async function popupAsk(message, defaultText) {
  document.getElementById("prompt-message").innerText = message;
  document.getElementById("prompt-input").value = defaultText || "";
  document.getElementById("overlay").style.display = "flex";

  return new Promise(resolve => {
    submitPrompt = function () {
      let response = document.getElementById("prompt-input").value;
      document.getElementById("overlay").style.display = "none";
      resolve(response);
      submitPrompt = null;
    }
  });
}
