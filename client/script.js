const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

let stopTyping = false;
let recognition = null;

// =======================
// SEND MESSAGE
// =======================
async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, "user");
  input.value = "";

  const loader = showLoading();

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();

    clearInterval(loader.interval);
    loader.div.innerText = "";

    stopTyping = false;
    typeText(loader.div, data.reply);

  } catch (error) {
    clearInterval(loader.interval);
    loader.div.innerText = "Error connecting to server";
    console.error(error);
  }

  scrollToBottom();
}

// =======================
// APPEND MESSAGE
// =======================
function appendMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerHTML = text.replace(/\n/g, "<br>");
  chatBox.appendChild(div);
  return div;
}

// =======================
// TYPING EFFECT (WITH STOP)
// =======================
function typeText(element, text) {
  let i = 0;
  element.innerHTML = "";

  function typing() {
    if (stopTyping) return;

    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, 15);
    }
  }

  typing();
}

// =======================
// STOP RESPONSE
// =======================
function stopResponse() {
  stopTyping = true;
}

// =======================
// LOADING ANIMATION
// =======================
function showLoading() {
  const div = document.createElement("div");
  div.className = "message bot";

  let dots = 0;
  const interval = setInterval(() => {
    div.innerText = "Thinking" + ".".repeat(dots % 4);
    dots++;
  }, 400);

  chatBox.appendChild(div);

  return { div, interval };
}

// =======================
// AUTO SCROLL
// =======================
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// =======================
// ENTER KEY SUPPORT
// =======================
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// =======================
// QUICK SUGGESTIONS
// =======================
function quickAsk(text) {
  input.value = text;
  sendMessage();
}

// =======================
// 🎤 VOICE INPUT
// =======================
function startListening() {
  try {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const micBtn = document.getElementById("mic-btn");
    const indicator = document.getElementById("recording-indicator");

    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.start();

    // 🔴 Show recording UI
    micBtn.classList.add("mic-active");
    indicator.style.display = "block";

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      input.value = transcript; // Live text update
    };

    recognition.onend = () => {
      // Stop UI when recording ends
      micBtn.classList.remove("mic-active");
      indicator.style.display = "none";
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
      micBtn.classList.remove("mic-active");
      indicator.style.display = "none";
    };

  } catch (err) {
    console.error(err);
    alert("Error starting voice recognition");
  }
}