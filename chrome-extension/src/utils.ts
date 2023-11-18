export const getGoogleSheetId = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      const sheetId = url?.split("/")[5];
      resolve(sheetId ?? "");
    });
  });
};

export const getAuthToken = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      resolve(token);
    });
  });
};
