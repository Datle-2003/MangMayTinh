function displayMessage(requireMessage, responseMessage) {
  let data_req = document.createElement('div');
  let data_res = document.createElement('div');
  let container1 = document.createElement('div');
  let container2 = document.createElement('div');
  container1.setAttribute("class", "msgCon1");
  container2.setAttribute("class", "msgCon2");
  data_req.innerHTML = requireMessage
  data_res.innerHTML = responseMessage;
  data_req.setAttribute("class", "right");
  data_res.setAttribute("class", "left");
  let message = document.getElementById('msg');
  message.appendChild(container1);
  message.appendChild(container2);
  container1.appendChild(data_req);
  container2.appendChild(data_res);
  document.getElementById('msg_send').value = "";
}


function init() {
  let res_elm = document.createElement("div");
  res_elm.innerHTML = "Hello, how can I help you?";
  res_elm.setAttribute("class", "left");
  document.getElementById('msg').appendChild(res_elm);
}



async function getResponse(req) {
  if (req == undefined || req == "") {
    return;
  } else {
    const response = await fetch('http://localhost:5000/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${req}`,
        })
      })

    const data = await response.json();
    return data.bot.trim();
  }
}

document.getElementById('reply').addEventListener("click", async (e) => {
  e.preventDefault();
  var req = document.getElementById('msg_send').value;
  const res = await getResponse(req);
  displayMessage(req, res);
  function scroll() {
    var scrollMsg = document.getElementById('msg')
    scrollMsg.scrollTop = scrollMsg.scrollHeight;
  }
  scroll();
}
);

let startButton = document.getElementById("start-button");

const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "vi-VN";

let text = ""

startButton.addEventListener('click', function () {
  recognition.start();
  startButton.innerHTML = '<i class="fa fa-microphone" style="font-size:24px;color:red"></i>';
  startButton.disabled = true;

  setTimeout(async () => {
    recognition.stop();
    startButton.disabled = false;
    startButton.innerHTML = '<i class="fa fa-microphone" style="font-size:24px"></i>';

    recognition.onresult = function (event) {
      const result = event.results[event.results.length - 1];
      text = result[0].transcript.trim();
      console.log(text);
    }
    const response = await getResponse(text);

    displayMessage(text, response);
    text_to_speech(response);
  }, 5000)
});


let text_to_speech = function (text) {
  let speechSynthesis = window.speechSynthesis;
  let utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "vi-VN";
  let voices = speechSynthesis.getVoices();
  let vietnameseVoices = voices.filter(function (voice) {
    return voice.lang === 'vi-VN';
  });
  if (vietnameseVoices.length > 0) {
    utterance.voice = vietnameseVoices[0];
  }
  utterance.rate = 1.0;
  speechSynthesis.speak(utterance);
}

