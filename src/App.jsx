import React, { useState } from "react";
import { HfInference } from "@huggingface/inference";

import crazyParot from "./assets/crazy-parot.png";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    try {
      setLoading(true);
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
          src_lang: "auto", // Use 'auto' if your model supports auto-detection, otherwise set a default language like 'en_XX'
          tgt_lang: languageCodeMap[selectedTargetLanguage],
        },
      });

      if (response && response.translation_text) {
        setTranslatedText(response.translation_text);
        console.log(response);
      } else {
        setTranslatedText("Translation error. Please try again.");
      }
    } catch (err) {
      console.error("Translation error:", err);
      setTranslatedText("Translation error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setInputText("");
    setSelectedTargetLanguage("");
    setTranslatedText("");
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${crazyParot})` }}>
      <div className="header-container">
        <h1>
          PollyGlot <br />
          OpenAI Translator
        </h1>
        <p>TRANSLATOR</p>
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
                {!translatedText
                  ? "Choose a target language 👇"
                  : "Your translation 👇"}
              </h3>
            </div>
            {!translatedText ? (
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="target-language"
                    value="French"
                    checked={selectedTargetLanguage === "French"}
                    onChange={() => setSelectedTargetLanguage("French")}
                  />
                  French 🇫🇷
                </label>
                <label>
                  <input
                    type="radio"
                    name="target-language"
                    value="Spanish"
                    checked={selectedTargetLanguage === "Spanish"}
                    onChange={() => setSelectedTargetLanguage("Spanish")}
                  />
                  Spanish 🇪🇸
                </label>
                <label>
                  <input
                    type="radio"
                    name="target-language"
                    value="Japanese"
                    checked={selectedTargetLanguage === "Japanese"}
                    onChange={() => setSelectedTargetLanguage("Japanese")}
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
