


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


document.getElementById('reply').addEventListener("click", async (e) => {
  e.preventDefault();
  var req = document.getElementById('msg_send').value;
  if (req == undefined || req == "") {
    return;
  } else {
    var res = "";
    const response = await fetch('http://localhost:5000',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${req}`,
        })
      })
      .then(data => data.json())
      .then(data => {
        res = data.bot.trim();
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


