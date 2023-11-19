import React, { useEffect } from "react";
import "./App.css";
import AudioToText from "./AudioToText";

export const App = () => {
  const [currentUrl, setCurrentUrl] = React.useState("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url ?? "";
      setCurrentUrl(url);
    });
  }, []);

  return (
    <>
      <div style={{ display: "flex", gap: "10px" }}>{currentUrl}</div>
      <AudioToText />
    </>
  );
};
