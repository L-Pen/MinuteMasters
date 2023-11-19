import React, { useEffect } from "react";
import "./App.css";
import { getAuthToken, getGoogleDocId } from "./utils";
import { getGoogleDoc, updateGoogleDoc } from "./google.api";
import DocNote from "./components/DocNote";

export const App = () => {
  const [title, setTitle] = React.useState<string>(
    "Please open a google doc to start taking notes"
  );

  const [notes, setNotes] = React.useState<string[]>([]);

  useEffect(() => {
    getGoogleDocId().then((id) => {
      chrome.storage.local.get(["addedNotes"], function (result) {
        if (result.addedNotes && result.addedNotes[id]) {
          setNotes(result.addedNotes[id]);
        } else {
          setNotes([]);
        }
      });
    });
  });

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
    setTitle(res.title);
  };

  useEffect(() => {
    getDoccumentData();
  }, []);

  const deleteNote = async (note: string) => {
    //remove from current google doc
    const auth = await getAuthToken();
    const documentID = await getGoogleDocId();
    var updateObject = {
      requests: [
        {
          replaceAllText: {
            replaceText: "",
            containsText: {
              text: note,
              matchCase: true,
            },
          },
        },
      ],
    };
    updateGoogleDoc(documentID, auth, updateObject).then((res) => {
      chrome.storage.local.get(["addedNotes"], function (result) {
        if (result.addedNotes && result.addedNotes[documentID]) {
          const newNotes = result.addedNotes[documentID].filter(
            (n: string) => n !== note
          );
          chrome.storage.local.set({
            addedNotes: {
              ...result.addedNotes,
              [documentID]: newNotes,
            },
          });
          setNotes(newNotes);
        }
      });
    });
  };

  return (
    <div style={{ minWidth: "300px" }}>
      <h1 style={{ textAlign: "center" }}>Minute Masters</h1>
      <h3 style={{ fontSize: "0.8rem", textAlign: "center" }}>{title}</h3>

      {notes.map((note) => (
        <DocNote content={note} onDelete={() => deleteNote(note)} />
      ))}
    </div>
  );
};

//
