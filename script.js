// Khai báo API key và URL của ChatGPT
const WHISPER_API = "https://api.openai.com/v1/audio/transcriptions";
const API_URL = "https://api.openai.com/v1/completions";


const dotenv = require("dotenv").config()
const axios = require("axios");
const fs = require("fs")
const path = require("path")
const FormData = require("form-data")


document.getElementById('reply').addEventListener("click", async (e) => {
  e.preventDefault();
  var req = document.getElementById('msg_send').value;
  if (req == undefined || req == "") {
    return;
  } else {
    var res = "";
    await fetch(API_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          prompt: `${req}`,
          max_tokens: 256,
          temperature: 0,
          model: "text-davinci-003",
        })
      })
      .then(response => response.json())
      .then(data => {
        res = data.choices[0].text;
      })
      .catch(error => {
        console.error(error);
      })

    displayMessage(req, res);
    function scroll() {
      var scrollMsg = document.getElementById('msg')
      scrollMsg.scrollTop = scrollMsg.scrollHeight;
    }
    scroll();
  }
});


let startButton = document.getElementById("start-button");
let stopButton = document.getElementById("end-button");

function speechToText(filePath) {
  const formData = new FormData();
  formData.append("model", "whisper-1");
  formData.append("file", fs.createReadStream(filePath));

  axios
    .post(WHISPER_API, formData, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    });
}

async function getResponse(req_send) {
  let res_msg = "";
  await fetch(API_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: `${req_send}`,
        max_tokens: 256,
        temperature: 0,
        model: "text-davinci-003",
      })
    })
    .then(response => response.json())
    .then(data => {
      res_msg = data.choices[0].text;
    })
    .catch(error => {
      console.error(error);
    })
  return res_msg;
}

function textToSpeech(res_msg) {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '9d4ccf4640msh81eea247cf018b1p1dff53jsn8f7b5776e4ba',
      'X-RapidAPI-Host': 'large-text-to-speech.p.rapidapi.com'
    },
    body: `{"text":"${res_msg}"}`
  };

  fetch('https://large-text-to-speech.p.rapidapi.com/tts', options)
    .then(response => response.blob())
    .then(blob => {
      // Create an audio element and set its source to the response data
      const audio = new Audio();
      audio.src = URL.createObjectURL(blob);

      // Play the audio
      audio.play();
    })
    .catch(err => console.error(err));
}

stopButton.disabled = false;

// Get access to the user's microphone
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function (stream) {
    // Create a MediaRecorder object to record the audio
    let chunks = [];
    let mediaRecorder = new MediaRecorder(stream);

    // When the recording is stopped, save the recorded audio as an MP3 file
    mediaRecorder.addEventListener("stop", async function () {
      let blob = new Blob(chunks, { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);
      const filePath = path.join(__dirname, "test.mp3")
      let req_send = await speechToText(filePath);
      let res_msg = await getResponse(req_send);
      textToSpeech(res_msg);
    });

    // Start recording when the user clicks a button
    startButton.addEventListener("click", function () {
      startButton.disabled = true;
      stopButton.disabled = false;
      mediaRecorder.start();
    });

    // Stop recording when the user clicks another button
    stopButton.addEventListener("click", function () {
      stopButton.disabled = true;
      startButton.disabled = false;
      mediaRecorder.stop();
    });

    // Collect the recorded audio data as it is captured
    mediaRecorder.addEventListener("dataavailable", function (event) {
      chunks.push(event.data);
    });
  })
  .catch(function (error) {
    console.log("Error:", error);
  });
















