// parts from chatgpt might change later
function redirect() {
  const input = document.getElementById("url").value.trim();
  let finalUrl;

  if (isRealURL(input)) {
    finalUrl = input.startsWith("http") ? input : "https://" + input;
  } else {
    finalUrl = "https://www.google.com/search?q=" + encodeURIComponent(input);
  }

  // Add loading splash iframe
  const loadingFrame = document.createElement("iframe");
  loadingFrame.src = "loading.html";
  loadingFrame.style.position = "fixed";
  loadingFrame.style.top = 0;
  loadingFrame.style.left = 0;
  loadingFrame.style.width = "100%";
  loadingFrame.style.height = "100%";
  loadingFrame.style.border = "none";
  loadingFrame.style.zIndex = 9999;
  document.body.appendChild(loadingFrame);

  // Try to open in new tab
  const newTab = window.open("loading.html");

  setTimeout(() => {
    if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
      window.location.href = finalUrl;
    } else {
      newTab.location.href = finalUrl;
      setTimeout(() => {
        if (document.body.contains(loadingFrame)) {
          document.body.removeChild(loadingFrame);
        }
      }, 500);
    }
  }, 1000);
}

function isRealURL(str) {
  const pattern = /^(https?:\/\/)?([\w\d\-]+\.)+[\w]{2,}(\/.*)?$/i;
  return pattern.test(str);
}

// Bookmark a URL
function bookmark() {
  const input = document.getElementById("url").value.trim();
  let bookmarkedUrl;

  if (isRealURL(input)) {
    bookmarkedUrl = input.startsWith("http") ? input : "https://" + input;

    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

    if (!bookmarks.includes(bookmarkedUrl)) {
      bookmarks.push(bookmarkedUrl);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      alert("Bookmarked: " + bookmarkedUrl);
    } else {
      alert("Already bookmarked.");
    }

    showBookmarks();
  } else {
    alert("Please enter a valid URL to bookmark.");
  }
}

// Display bookmarks
function showBookmarks() {
  const container = document.getElementById("bookmarksContainer");
  container.innerHTML = "";

  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

  if (bookmarks.length === 0) {
    container.innerHTML = "<p>No bookmarks yet.</p>";
    return;
  }

  bookmarks.forEach(url => {
    const link = document.createElement("a");
    link.href = url;
    link.textContent = url;
    link.target = "_blank";
    link.className = "bookmark-link";
    container.appendChild(link);
    container.appendChild(document.createElement("br"));
  });
}

// Load bookmarks on page load
window.onload = () => {
  showBookmarks();
};
