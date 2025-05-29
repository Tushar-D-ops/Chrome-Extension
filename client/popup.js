document.getElementById("setLang").addEventListener("click", () => {
  const selectedLang = document.getElementById("lang").value;
  chrome.storage.local.set({ targetLanguage: selectedLang }, () => {
    document.getElementById("status").innerText = `Target language set to ${selectedLang}`;
  });
});
