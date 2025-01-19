document.getElementById("clear-urls").addEventListener("click", () => {

  console.log("clear urls")

  chrome.storage.local.set({ artists: [] }, () => {
    alert("Visited URLs cleared!");
  });
});
