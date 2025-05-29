chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: "explain-code", title: "🔍 Explain Code (AI)", contexts: ["selection"] });
  chrome.contextMenus.create({ id: "rewrite-text", title: "✍️ Rephrase Professionally", contexts: ["selection"] });
  chrome.contextMenus.create({ id: "dictionary", title: "📚 Define + Example", contexts: ["selection"] });
  chrome.contextMenus.create({ id: "translate", title: "🌐 Translate (AI)", contexts: ["selection"] });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const text = info.selectionText;
  let prompt = "";

  // Get the target language for translation
  const targetLang = await new Promise(resolve =>
    chrome.storage.local.get("targetLanguage", data => resolve(data.targetLanguage || "Spanish"))
  );

  switch (info.menuItemId) {
    case "explain-code":
      prompt = `Explain the following code:\n\n${text}`;
      break;
    case "rewrite-text":
      prompt = `Rewrite the following text professionally:\n\n${text}`;
      break;
    case "dictionary":
      prompt = `Define the word "${text}" and use it in a sentence.`;
      break;
    case "translate":
      prompt = `Translate this text to ${targetLang}:\n\n${text}`;
      break;
  }

  const result = await fetchAIResponse(prompt);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: showAlert,
    args: [result]
  });
});

async function fetchAIResponse(prompt) {
  try {
    const response = await fetch("http://localhost:5000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    return data.result || "No response from AI.";
  } catch (err) {
    return "⚠️ Error contacting AI server: " + err.message;
  }
}

function showAlert(message) {
  alert(message);
}
