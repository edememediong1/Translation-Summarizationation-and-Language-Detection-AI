import React from 'react'

function Result({messages, setSelectedLanguage, handleTranslate , selectedLanguage, languages}) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
      {messages.map((message) => (
        <div key={message.id} className="space-y-2">
          <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
              {message.text}
            </div>
          </div>

          {message.detectedLang && (
            <div className="text-sm flex items-center">
                Detected: {message.detectedLang}
            </div>
          )}

          <div className="flex gap-2">
            {message.text.length > 150 && message.detectedLang === "en" && !message.summary && (
              <button
                className="flex items-center gap-1"
              >
                Summarize
              </button>
            )}
          </div>

          <label htmlFor="languageSelect"> Translate to:</label>
          <select 
            name="languageSelect" 
            id="languageSelect"
            onChange={(value) => {
              setSelectedLanguage(value)
              handleTranslate(message.id, value)
            }}
          >
            {Object.entries(languages).map(([code, lang]) => (
              <option key={code} value={lang}>
                {lang}
              </option>
              ))}

          </select>
            
          {message.summary && (
            <div className="bg-amber-100 p-3 rounded-lg">
                <div className="font-medium">
                    Summary: {message.summary}
                </div>
            </div>
          )}

          {message.translations[selectedLanguage] && (
            <div className="bg-muted p-3 rounded-lg">
                <div className='font-medium mb-1'>
                    Translation ({languages[selectedLanguage]}):
                </div>
                {message.translations[selectedLanguage]}
            </div>

          )}

        </div>
      ))}

    </div>
  )
}

export default Result