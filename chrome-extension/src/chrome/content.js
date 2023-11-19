const AudioContext = window.AudioContext || window.webkitAudioContext;
// const recordAudio = async () => {
//   console.log("clicked record");
//   const audioContext = new AudioContext();
//   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//   const input = audioContext.createMediaStreamSource(stream);
// };

const add_record_button = () => {
  document.getElementById("minute-master-record")?.remove();
  var button = document.createElement("div");
  button.innerText = "Record";
  button.role = "menuitem";
  button.id = "minute-master-record";
  button.setAttribute("aria-disabled", "false");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-haspopup", "false");
  button.setAttribute("style", "user-select: none;");
  button.classList.add("menu-button", "goog-control", "goog-inline-block");
  const existingNode = document.getElementById("docs-help-menu");
  if (!existingNode?.parentNode) return;
  existingNode.parentNode.insertBefore(button, existingNode.nextSibling);
  button.onclick = () => {
    connect();
  };
};
const messagesFromReactAppListener = (message, sender, response) => {
  if (message.message === "page_loaded") {
    add_record_button();
  }
};
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
const sampleRate = 16000;
let connection;
let currentRecognition;
let recognitionHistory = [];
let isRecording = false;
let recorder;
let processorRef = null;
let audioContextRef = null;
let audioInputRef = null;

const speechRecognized = (data) => {
  if (data.final) {
    currentRecognition = "...";
    recognitionHistory.unshift(data.text);
  } else {
    currentRecognition = data.text + "...";
  }
  updateUI();
};

const connect = () => {
  if (connection) {
    connection.close();
  }
  connection = new WebSocket("ws://127.0.0.1:8081/");
  connection.onopen = () => {
    console.log("connected", connection);
    startRecording();
  };

  connection.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "audio_text") {
      speechRecognized(data);
      console.log("received audio text", data);
    }
  };

  connection.onclose = () => {
    console.log("disconnected");
  };
};

const disconnect = () => {
  if (!connection) return;
  connection.close();
  processorRef.disconnect();
  audioInputRef.disconnect();
  audioContextRef.close();
  connection = undefined;
  recorder = undefined;
  isRecording = false;
  updateUI();
};

const updateUI = () => {
  const recognitionContainer = document.getElementById("recognition-container");
  recognitionContainer.innerHTML = "";
  recognitionHistory.forEach((tx, idx) => {
    const p = document.createElement("p");
    p.textContent = tx;
    recognitionContainer.appendChild(p);
  });
  const p = document.createElement("p");
  p.textContent = currentRecognition;
  recognitionContainer.appendChild(p);
};

const getMediaStream = async () => {
  return await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: "default",
      sampleRate: sampleRate,
      sampleSize: 16,
      channelCount: 1,
    },
    video: false,
  });
};

const startRecording = async () => {
  if (connection) {
    const stream = await getMediaStream();
    connection.send(JSON.stringify({ message: "startRecording" }));
    // console.log("getting stream");
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaStreamSource(stream);
    const sampleRate = audioContext.sampleRate;
    console.log(sampleRate);
    // Create a script processor node to process audio
    const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);

    scriptNode.onaudioprocess = (event) => {
      // console.log("processing audio");
      const inputData = event.inputBuffer.getChannelData(0);

      //convert floats to ints
      const jsonData = JSON.stringify({
        message: "data",
        audioData: Array.from(inputData),
        sampleRate,
      });
      // console.log(sampleRate, formatted);
      // Send audio data over WebSocket
      if (connection.readyState === WebSocket.OPEN) {
        // console.log("sending audio");
        connection.send(jsonData);
      }
    };

    audioSource.connect(scriptNode);
    scriptNode.connect(audioContext.destination);
  }
};

const stopRecording = () => {
  if (isRecording) {
    processorRef.disconnect();
    audioInputRef.disconnect();
    if (audioContextRef.state !== "closed") {
      audioContextRef.close();
    }
    isRecording = false;
    updateUI();
  }
};

export {};
