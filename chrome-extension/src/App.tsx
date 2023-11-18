import React, { useEffect } from "react";
import "./App.css";
import { getAuthToken, getGoogleDocId } from "./utils";
import { getGoogleDoc } from "./google.api";

export const App = () => {
  const [currentUrl, setCurrentUrl] = React.useState("");
  let [documentContent, setDocumentContent] = React.useState<any | null>(null);
  const getDoccumentData = async () => {
    const documentID = await getGoogleDocId();

    const auth = await getAuthToken();

    const res = await getGoogleDoc(documentID, auth);

    const content = res.body.content
      .flatMap((section: any) =>
        section.paragraph
          ? section.paragraph.elements.map((el: any) => el.textRun.content)
          : []
      )
      .join("");

    setDocumentContent(content);
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
        <h1>!!!!!!!!!!!!!!!!!BODY!!!!!!!!!!!!!!!!!</h1>
      </pre>
    </div>
  );
};

//
