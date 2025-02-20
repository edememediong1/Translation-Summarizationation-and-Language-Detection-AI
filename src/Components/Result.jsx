import React from 'react'

function Result({messages, setSelectedLanguage, handleTranslate , selectedLanguage, languages, handleSummarize}) {
  
  const languageTagToHumanReadable = (languageTag, targetLanguage) => {
    const displayNames = new Intl.DisplayNames([targetLanguage], {
      type: 'language',
    });
    return displayNames.of(languageTag);
  };
  return (
    <div className=" overflow-y-auto space-y-4 mb-4  mt-[13vh] p-4 w-full" >
      {messages.map((message) => (
        <div key={message.id} className="space-y-2 ">
          <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className="bg-slate-100 rounded-2xl px-4 py-3 max-w-[80%] rounded-tr-none">
              {message.text}
            </div>
          </div>

          <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none max-w-[40%] text-[16px] space-y-3">
            <div className=" flex items-center">
                <span className='font-bold'>Detected: &nbsp;</span> {message.detectedLanguage}
            </div>
          

            <div className="flex gap-2 font-bold">
              {(message.text.length > 150 && message.detectedLanguage === "en" && !message.summary) ? (
                <button
                  type="submit"
                  className="flex items-center gap-1 bg-slate-200"
                  onClick={() => handleSummarize(message.id)}
                >
                  Summarize
                </button>
              ): `Character Count: ${message.text.length}`}
            </div>

            <label htmlFor="languageSelect" className='font-bold'> Translate to: </label>
            <select 
              name="languageSelect" 
              id="languageSelect"
              className="bg-slate-200 outline-0 p-2 rounded-lg"
              onChange={(e) => {
                setSelectedLanguage(e.target.value)
                handleTranslate(message.id, e.target.value)
              }}
            >
              {Object.entries(languages).map(([code, lang]) => (
                <option key={code} value={code}>
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
              <div className="rounded-lg">
                  <div className='mb-2 font-bold'>
                      Translation ({languages[selectedLanguage]}):
                  </div>
                  {message.translations[selectedLanguage]}
              </div>

            )}
          </div>

        </div>
      ))}

    </div>
  )
}

export default Result