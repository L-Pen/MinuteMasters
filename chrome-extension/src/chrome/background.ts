export type BackgroundMessage = {
  type: string;
  data: any;
};

chrome.runtime.onMessage.addListener(
  (request: BackgroundMessage, sender, sendResponse) => {
    console.log("got message from content script", request);
  }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.active &&
    tab.url?.includes("docs.google.com")
  ) {
    console.log("tab changed", changeInfo);
    chrome.tabs.sendMessage(tabId, { message: "page_loaded" }, (response) => {
      console.log("got back", response);
    });
  }
});
