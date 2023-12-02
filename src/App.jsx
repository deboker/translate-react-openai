import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import crazyParot from "./assets/crazy-parot.png";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

    const messages = [
      {
        role: "system",
        content: `You are a translator from detected language from inputText language to language:${selectedLanguage} and when is ${!selectedLanguage} language write Please choose language!`,
      },
      {
        role: "user",
        content: `${inputText}`,
      },
    ];

    try {
      const openai = new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true,
      });
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
        temperature: 1,
        presence_penalty: 0,
        frequency_penalty: 0,
      });
      setTranslatedText(response.choices[0].message.content);
    } catch (err) {
      setTranslatedText("Translation error. Please try again.");
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
                    value="French"
                    checked={selectedLanguage === "French"}
                    onChange={() => setSelectedLanguage("French")}
                  />
                  French 🇫🇷
                </label>
                <label>
                  <input
                    type="radio"
                    name="language"
                    value="Spanish"
                    checked={selectedLanguage === "Spanish"}
                    onChange={() => setSelectedLanguage("Spanish")}
                  />
                  Spanish 🇪🇸
                </label>
                <label>
                  <input
                    type="radio"
                    name="language"
                    value="Japanese"
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
            {translatedText ? "Start Over" : "Translate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
