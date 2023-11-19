import { getGoogleDoc, updateGoogleDoc } from "../google.api";
import { getAuthToken, getGoogleDocId } from "../utils";
let recording = false;

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
    if (recording) {
      recording = false;
      button.innerText = "Record";
      stopRecording();
    } else {
      recording = true;
      button.innerText = "Stop";
      startRecording();
    }
  };
};
const messagesFromReactAppListener = (message, sender, response) => {
  if (message.message === "page_loaded") {
    add_record_button();
  }
};
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = false;
mic.lang = "en-US";

let interval = null;

const getDoccumentData = async () => {
  console.log("Getting document id");
  console.log("getting auth token");
  // const auth = await getAuthToken();
  const token = await new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "get_auth_token" }, (response) => {
      if (response) {
        resolve(response.token);
      } else {
        console.log("no response");
        reject();
      }
    });
  });
  const documentId = window.location.href.split("/")[5];

  const res = await getGoogleDoc(documentId, token);
  console.log(res);
  const content = res.body.content
    .flatMap((section) =>
      section.paragraph
        ? section.paragraph.elements.map((el) => el.textRun?.content)
        : []
    )
    .join("");

  return { content, documentId, token };
};

const processTranscript = async (transcript) => {
  const { content, documentId, token } = await getDoccumentData();

  const body = JSON.stringify({
    dialogue: transcript,
    content: content,
  });
  console.log(body);

  const resp = await new Promise((resolve, reject) => {
    fetch("http://127.0.0.1:5000/post", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        resolve(res.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
  var updateObject = {
    requests: resp.map((upd) => ({
      insertText: {
        text: upd[2],
        location: {
          index: upd[1],
        },
      },
    })),
  };
  console.log(resp, updateObject);
  updateGoogleDoc(documentId, token, updateObject);
};

let timeout = null;
const startRecording = () => {
  console.log("Started recording");
  recording = true;
  mic.start();
  mic.onstart = () => {
    console.log("Mics on");
  };
  mic.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");
    //only run process transcript every 10 seconds at the minimum
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (transcript.length > 100) processTranscript(transcript);
    }, 5000);
  };
  mic.onstop = () => {
    if (recording) mic.start();
  };
};

const stopRecording = () => {
  clearInterval(interval);
  interval = null;
  console.log("Stopped recording");
  mic.stop();
};

export {};
