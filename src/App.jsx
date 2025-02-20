import { useState } from "react"
import Form from "./Components/Form"
import Result from "./Components/Result"

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  const languages = {
    en: "English",
    pt: "Portuguese",
    es: "Spanish",
    ru: "Russian",
    tr: "Turkish",
    fr: "French"
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()){
      return
    }

    // Add user message
    const newMessage = {
      id: Date.now(),
      text: input,
      type: "user",
      detectedLang: "",
      translations: {},
      summary: ""
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")

    // Call API

    try{
      const detectedLang = await detectedLanguage(input)
      newMessage.detectedLang = detectedLang

      setMessages((prev) => prev.map((msg) => 
        (msg.id === newMessage.id ? {...msg, detectedLang} : msg)))
    } catch (error){
      console.error("Language detection Failed", error)
    }
  } 

  const handleTranslate = async (messageId, targetLang) => {
    const message = messages.find((m) => m.id === messageId)
    if (!message){
      return
    }

    try{
      //Translate message

      const translation = await handleTranslate(message.text, { to: targetLang })
      setMessages((prev) => 
        prev.map((msg) =>
          msg.id === messageId
          ? {
            ...msg,
            translations: {
              ...msg.translations,
              [targetLang]: translation.text
            }
          } : msg
      ))
    } catch (error) {
      console.error("Translation failed", error)  
    }
  }

  const handleSummarize = async (messageId) => {
    const message = messages.find((m) => m.id === messageId)
    if (!message){
      return
    }

    try{
      const summary = await sumarize(message.text, {
        params: {
          max_length: 150,
          min_length: 30,
          do_sample: false
        }
      })

      setMessages((prev) => prev.map((msg) => (msg.id === 
        messageId ? {...msg, summary: summary.summary_text} : msg )))
    } catch (error) {
      console.error("Summarization failed", error)
    }
  }

  return (
    <div className="">
      <Result 
        messages={messages} 
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        handleTranslate={handleTranslate}
        handleSummarize={handleSummarize}
        languages={languages}
      />
      
      <Form 
        input={input}  
        handleSend={handleSend} 
        setInput={setInput}
      />
    </div>
  )
}

export default App