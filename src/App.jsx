import React, { useState, useEffect } from "react";
import { HfInference } from "@huggingface/inference";

import crazyParot from "./assets/crazy-parot.png";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    try {
      const hf = new HfInference(import.meta.env.VITE_HF_TOKEN);

      const languageCodeMap = {
        French: "fr_XX",
        Spanish: "es_XX",
        Japanese: "ja_XX",
        // Add more languages as needed
      };

      const response = await hf.translation({
        model: "facebook/mbart-large-50-many-to-many-mmt",
        inputs: inputText,
        parameters: {
          src_lang: "en_XX",
          tgt_lang: languageCodeMap[selectedLanguage],
        },
      });

      if (response && response.translation_text) {
        setTranslatedText(response.translation_text);
      } else {
        setTranslatedText("Translation error. Please try again.");
      }
      console.log(response);
    } catch (err) {
      console.error("Translation error:", err);
      setTranslatedText("Translation error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setInputText("");
    setSelectedLanguage("");
    setTranslatedText("");
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${crazyParot})` }}>
      <div className="header-container">
        <h1>PollyGlot</h1>
        <p>Perfect Translation Every Time</p>
      </div>
      <div className="main-container">
        <div className="rectangle">
          <h2>Text to translate 👇</h2>
          <input
            className="text-input"
            type="text"
            placeholder="Type something..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <div className="translate-container">
            <div className="input-box">
              <h3>
                {translatedText
                  ? "Your translation 👇"
                  : "Choose a language 👇"}
              </h3>
            </div>
            {!translatedText ? (
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="language"
                    value="fr_XX"
                    checked={selectedLanguage === "French"}
                    onChange={() => setSelectedLanguage("French")}
                  />
                  French 🇫🇷
                </label>
                <label>
                  <input
                    type="radio"
                    name="language"
                    value="es_XX"
                    checked={selectedLanguage === "Spanish"}
                    onChange={() => setSelectedLanguage("Spanish")}
                  />
                  Spanish 🇪🇸
                </label>
                <label>
                  <input
                    type="radio"
                    name="language"
                    value="ja_XX"
                    checked={selectedLanguage === "Japanese"}
                    onChange={() => setSelectedLanguage("Japanese")}
                  />
                  Japanese 🇯🇵
                </label>
              </div>
            ) : (
              <div className="translated-text">
                <p>{translatedText}</p>
              </div>
            )}
          </div>
          <button
            className="submit-button"
            onClick={translatedText ? handleStartOver : handleTranslate}
          >
            {loading
              ? "Translating..."
              : translatedText
              ? "Start Over"
              : "Translate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
