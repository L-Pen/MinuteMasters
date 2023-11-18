import React, { useEffect } from "react";
import "./App.css";
import { getAuthToken } from "./utils";
import { getGoogleDoc } from "./google.api";

export const App = () => {
  const [currentUrl, setCurrentUrl] = React.useState("");
  const [documentContent, setDocumentContent] = React.useState(null);
  const getDoccumentData = async () => {
    const DocumentID = "13kXnbqHNf3HjlVEcyKrE6px_u-8vzVTghdP2WL1s424";

    const auth = await getAuthToken();

    const res = await getGoogleDoc(DocumentID,auth)
    setDocumentContent(res);
    console.log(`The title of the document is: ${res.data.title}`);
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url ?? "";
      setCurrentUrl(url);
    });

    getDoccumentData();
  }, []);

  return (
    <div>
      <h1>Google Docs Extension</h1>
      <pre>
        <code>{JSON.stringify(documentContent, null, 2)}</code>
      </pre>
    </div>
  );
};

//
