const init = () => {
  let defaultMessage = document.createElement("div");
  defaultMessage.innerHTML = "Hello, how can I help you?";
  defaultMessage.setAttribute("class", "left");
  document.getElementById("messages").appendChild(defaultMessage);
};

const messageInput = document.querySelector(".message-input");
const messages = document.querySelector(".messages");
const sendButton = document.querySelector(".send-button");
const recordButton = document.getElementById("record");



const displaySendMessage = (message) => {
  let messageElement = document.createElement("div");
  messageElement.innerHTML = message;
  messageElement.setAttribute("class", "right");
  document.getElementById("messages").appendChild(messageElement);
  messageInput.value = "";
  messageInput.focus();

};

const displayResponseMessage = (message) => {
  let messageElement = document.createElement("div");
  messageElement.innerHTML = message;
  messageElement.setAttribute("class", "left");
  document.getElementById("messages").appendChild(messageElement);
  messageInput.value = "";
  messageInput.focus();
};

async function getResponse(requireMessage) {
  if (requireMessage == undefined || requireMessage == "") {
    return;
  } else {
    const response = await fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `${requireMessage}`,
      }),
    });
    const data = await response.json();
    console.log(data);
    return data.bot.content.trim();
  }
}

document.getElementById("send").addEventListener("click", async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    displaySendMessage(message);
    let intervalId = null;
    let dotCount = 0;
    const loadingText = document.createElement("span");
    loadingText.textContent = "";
    // waiting message
    sendButton.disabled = true;
    const responseElement = document.createElement("div");
    responseElement.setAttribute("class", "left");
    responseElement.textContent = "";
    messages.appendChild(responseElement);
    responseElement.appendChild(loadingText);

    intervalId = setInterval(() => {
      if (dotCount >= 3) {
        dotCount = 0;
        loadingText.textContent = "";
      } else {
        dotCount++;
        loadingText.textContent += ".";
      }
    }, 500);

    try {
      const response = await getResponse(message);
      responseElement.removeChild(loadingText);
      responseElement.textContent = response;
      function scroll() {
        var scrollMsg = document.getElementById("messages");
        scrollMsg.scrollTop = scrollMsg.scrollHeight;
      }
      scroll();
    } catch (error) {
      console.log(error);
      responseElement.removeChild(loadingText);
      responseElement.textContent = "Error getting response from server.";
    }
    messageInput.value = "";
    sendButton.disabled = false;
  }
});

const SpeechRecognition =
  window.speechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "vi-VN";

let text = "";

recordButton.addEventListener("click", function () {
  recognition.start();
  recordButton.innerHTML =
    '<i class="fa fa-microphone" style="font-size:24px;color:red"></i>';
  recordButton.disabled = true;

  setTimeout(async () => {
    recognition.stop();
    recordButton.disabled = false;
    recordButton.innerHTML =
      '<i class="fa fa-microphone" style="font-size:24px"></i>';

    recognition.onresult = function (event) {
      const result = event.results[event.results.length - 1];
      text = result[0].transcript.trim();
      displaySendMessage(text);
      console.log(text);
    };

    const response = await getResponse(text);
    if (response !== undefined) {
      displayResponseMessage(response);
      text_to_speech(response);
    }
  }, 8000);
});

function text_to_speech(Text) {
  responsiveVoice.setDefaultVoice("Vietnamese Male");
  responsiveVoice.speak(Text);
}
