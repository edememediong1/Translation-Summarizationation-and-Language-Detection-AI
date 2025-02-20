import { useState } from "react"
import Form from "./Components/Form"
import Result from "./Components/Result"
import SideBar from "./Components/SideBar"
import NavBar from "./Components/NavBar"

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
      detectedLanguage: "",
      confidence: 0,
      translations: {},
      summary: ""
    }

    
    // console.log(messages)
    // setInput("")

    // Call API

    try{
      const detector = await self.ai.languageDetector.create()
      const {detectedLanguage, confidence} = (await detector.detect(input.trim()))[0]
      // console.log(detectedLanguage)
      newMessage.detectedLanguage = detectedLanguage
      
      // console.log(newMessage)
      

      // console.log(languageTagToHumanReadable(detectedLanguage, 'en'))
      setMessages((prev) => [...prev, newMessage])

      setMessages((prev) => prev.map((msg) => 
        (msg.id === newMessage.id ? {...msg, detectedLanguage} : msg)))

      

      console.log(messages)
    } catch (error){
      console.error("Language detection Failed", error)
    }
  } 

  const handleTranslate = async (messageId, targetLang) => {
    const message = messages.find((m) => m.id === messageId)
    if (!message){
      return
    }

    const sourceLanguage = message.detectedLanguage
    if (!['en', 'ja', 'es'].includes(sourceLanguage)) {
      const translation = 'Currently, only English ↔ Spanish and English ↔ Japanese are supported.';
      return;
    }
    console.log(sourceLanguage)
    console.log(targetLang)
    try{
      //Translate message

      const translator = await self.ai.translator.create({
        sourceLanguage,
        targetLanguage: targetLang,
      });

      const translation = await translator.translate(input.trim())
      console.log(translation)
      setMessages((prev) => 
        prev.map((msg) =>
          msg.id === messageId
          ? {
            ...msg,
            translations: {
              ...msg.translations,
              [targetLang]: translation
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
      // Summarize message
      const options = {
        sharedContext: 'This is a scientific article',
        type: 'key-points',
        format: 'markdown',
        length: 'medium',
      };

      const summarizer = await self.ai.summarizer.create(options);

      const summary = await summarizer.summarize(messages.text, {
        context: 'This article is intended for a tech-savvy audience.',
      })

      console.log(summary)

      setMessages((prev) => prev.map((msg) => (msg.id === 
        messageId ? {...msg, summary: summary} : msg )))
    } catch (error) {
      console.error("Summarization failed", error)
    }
  }

  return (
    <div className="w-screen min-h-screen flex gap-0 font-poppins">

      <SideBar />
      <main className=" w-3/4 ">
        <NavBar />
        <section className="w-full h-full p-4">  
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
        </section>
        
      </main>
    </div>
  )
}

export default App