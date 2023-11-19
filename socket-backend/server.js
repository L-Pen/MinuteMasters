const speech = require("@google-cloud/speech");
const WebSocket = require("ws");
const encoding = "LINEAR16";
const sampleRateHertz = 44100;
const languageCode = "en-US"; //en-US

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: true,
};

const socket = new WebSocket.Server({ port: 8081 });
const speechClient = new speech.SpeechClient({
  keyFilename: "minute-masters-8264c576f84c.json",
});
socket.on("connection", (ws) => {
  let recognizeStream = null;
  console.log(
    "** a user connected - " + JSON.stringify(Object.keys(socket)) + " **\n"
  );
  ws.on("message", (mess) => {
    const message = JSON.parse(mess.toString());

    if (message.message == "startRecording") {
      startRecognitionStream();
    } else {
      //   console.log(message.audioData);
      if (recognizeStream) {
        // console.log(message);
        const arr = new Int16Array(message.audioData);
        recognizeStream.write(arr);
      }
    }
  });

  function startRecognitionStream() {
    console.log("* StartRecognitionStream\n");
    try {
      recognizeStream = speechClient
        .streamingRecognize(request)
        .on("error", (error) => {
          console.error(error);
        })
        .on("data", (data) => {
          console.log("data", JSON.stringify(data));
        })
        .on("end", () => console.log("end"))
        .on("close", () => console.log("close"))
        .on("drain", () => console.log("drain"))
        .on("finish", () => console.log("finish"))
        .on("pipe", () => console.log("pipe"))
        .on("readable", () => console.log("readable"))
        .on("resume", () => console.log("resume"))
        .on("unpipe", () => console.log("unpipe"));
    } catch (err) {
      console.error("Error streaming google api " + err);
    }
  }

  //   function stopRecognitionStream() {
  //     if (recognizeStream) {
  //       console.log("* StopRecognitionStream \n");
  //       recognizeStream.end();
  //     }
  //     recognizeStream = null;
  //   }
});

// server.listen(8081, () => {
//   console.log("WebSocket server listening on port 8081.");
// });

// =========================== GOOGLE CLOUD SETTINGS ================================ //

// The encoding of the audio file, e.g. 'LINEAR16'
// The sample rate of the audio file in hertz, e.g. 16000
// The BCP-47 language code to use, e.g. 'en-US'
