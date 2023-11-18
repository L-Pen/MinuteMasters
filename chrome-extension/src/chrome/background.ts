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
  if (changeInfo.status === "complete") {
    if (tab.url?.includes("https://docs.google.com")) {
      console.log("loaded google doc");
      //   chrome.tabs.sendMessage(tabId, { type: "getReportCodes" }, (resp) => {
      //     console.log("got response from content script", resp);
      //     chrome.storage.local.set({ nexoniaReportCodes: resp });
      //   });
    }
  }
});
