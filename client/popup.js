document.addEventListener("DOMContentLoaded", () => {
  const taskDropdown = document.getElementById("task");
  const inputText = document.getElementById("inputText");
  const submitBtn = document.getElementById("submitBtn");
  const outputArea = document.getElementById("outputArea");

  submitBtn.addEventListener("click", async () => {
    const task = taskDropdown.value;
    const text = inputText.value.trim();

    if (!text) {
      outputArea.innerText = "⚠️ Please enter some text.";
      return;
    }

    const prompt = buildPrompt(task, text);

    try {
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        const errorText = await res.text();
        outputArea.innerText = "⚠️ Invalid response from server.";
        console.error("Response is not JSON:", errorText);
        return;
      }

      if (data.result && data.result.trim()!=="") {
        outputArea.textContent = data.result;
      } else {
        outputArea.textContent = "⚠️ No response from AI.";
      }
    } catch (err) {
      console.error("Fetch error:", err);
      outputArea.innerText = "⚠️ Failed to connect to server.";
    }
  });

  function buildPrompt(task, input) {
    switch (task) {
      case "rewrite":
        return `Rewrite the following text professionally:\n\n${input}`;
      case "summarize":
        return `Summarize this text:\n\n${input}`;
      case "explain":
        return `Explain this text in simple terms:\n\n${input}`;
      case "change-tone":
        return `Change the tone of this text to be more friendly:\n\n${input}`;
      default:
        return input;
    }
  }
});
