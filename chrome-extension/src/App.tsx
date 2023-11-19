import React, { useEffect } from "react";
import "./App.css";
import { getAuthToken, getGoogleDocId } from "./utils";
import { getGoogleDoc, updateGoogleDoc } from "./google.api";

export const App = () => {
  const [currentUrl, setCurrentUrl] = React.useState("");
  let [documentContent, setDocumentContent] = React.useState<any | null>(null);
  let [test, setTest] = React.useState<any | null>(null);

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

  const updateDocData = async () => {
    const documentID = await getGoogleDocId();

    const auth = await getAuthToken();

    var updateObject = {
      requests: [
        {
          insertText: {
            text: "Sameer Bayani\n",
            location: {
              index: 1,
            },
          },
        },
        {
          replaceAllText: {
            replaceText:
              "\nWas answered by Katrina’s post. We define ease of use by the amount of time it takes to set up the puzzle, the amount of time it takes to solve the puzzle, and the amount of time it takes to reset the puzzle.\n",

            containsText: {
              text: "Was answered by Katrina’s post",
              matchCase: true,
            },
          },
        },
      ],
    };

    const res = await updateGoogleDoc(documentID, auth, updateObject);
    setTest(res);
    console.log(`Updated the document: ${res.data.title}`);
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url ?? "";
      setCurrentUrl(url);
    });

    getDoccumentData();
    updateDocData();
  }, []);

  return (
    <div>
      <h1>Google Docs Extension</h1>
      <pre>
        <code>{JSON.stringify(documentContent, null, 2)}</code>
        <h1>!!!!!!!!!!!!!!!!!BODY!!!!!!!!!!!!!!!!!</h1>
        <code>{JSON.stringify(test, null, 2)}</code>
      </pre>
    </div>
  );
};

//
