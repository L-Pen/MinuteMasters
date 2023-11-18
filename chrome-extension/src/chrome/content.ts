type MessageResponse = (response?: any) => void;

const sendMessageToBackground = (
  type: string,
  data: any,
  callback?: MessageResponse
) => {
  chrome.runtime.sendMessage({ type, data }, callback);
};

const messagesFromReactAppListener = (
  message: any,
  sender: chrome.runtime.MessageSender,
  response: MessageResponse
) => {
  console.log("message from react app", message);
};
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

const sendToBackground = (message: any, callback?: MessageResponse) => {
  chrome.runtime.sendMessage(message, callback);
};

export {}