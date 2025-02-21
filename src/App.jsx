import { useState, useEffect } from "react";
import Form from "./Components/Form";
import Result from "./Components/Result";
import SideBar from "./Components/SideBar";
import NavBar from "./Components/NavBar";

function App() {
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("chats");
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = {
    en: "English",
    pt: "Portuguese",
    es: "Spanish",
    ru: "Russian",
    tr: "Turkish",
    fr: "French"
  };

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      messages: [],
      createdAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      type: "user",
      detectedLanguage: "",
      translations: {},
      summary: ""
    };

    try {
      const detector = await self.ai.languageDetector.create();
      const { detectedLanguage } = (await detector.detect(input.trim()))[0];
      newMessage.detectedLanguage = detectedLanguage;

      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        )
      );
      setInput("");
    } catch (error) {
      console.error("Language detection Failed", error);
    }
  };

  const handleTranslate = async (messageId, targetLang) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id !== activeChatId) return chat;
        
        return {
          ...chat,
          messages: chat.messages.map(msg => {
            if (msg.id !== messageId) return msg;
            return { ...msg, loading: true };
          })
        };
      })
    );

    try {
      const activeChat = chats.find(chat => chat.id === activeChatId);
      const message = activeChat?.messages.find(m => m.id === messageId);
      if (!message || !message.detectedLanguage) return;

      // Check supported translation pairs
      const sourceLanguage = message.detectedLanguage;
      const supportedPairs = ['en', 'es', 'ja']; // Add your supported pairs
      if (!supportedPairs.includes(sourceLanguage)) {
        throw new Error('Unsupported source language for translation');
      }

      const translator = await self.ai.translator.create({
        sourceLanguage,
        targetLanguage: targetLang,
      });

      const translation = await translator.translate(message.text);
      
      setChats(prevChats => 
        prevChats.map(chat => {
          if (chat.id !== activeChatId) return chat;
          
          return {
            ...chat,
            messages: chat.messages.map(msg => {
              if (msg.id !== messageId) return msg;
              return {
                ...msg,
                translations: { ...msg.translations, [targetLang]: translation },
                loading: false
              };
            })
          };
        })
      );
    } catch (error) {
      setChats(prevChats => 
        prevChats.map(chat => {
          if (chat.id !== activeChatId) return chat;
          
          return {
            ...chat,
            messages: chat.messages.map(msg => {
              if (msg.id !== messageId) return msg;
              return {
                ...msg,
                error: error.message || 'Translation failed',
                loading: false
              };
            })
          };
        })
      );
    }
  };

  const handleSummarize = async (messageId) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id !== activeChatId) return chat;
        
        return {
          ...chat,
          messages: chat.messages.map(msg => {
            if (msg.id !== messageId) return msg;
            return { ...msg, loading: true };
          })
        };
      })
    );

    try {
      const activeChat = chats.find(chat => chat.id === activeChatId);
      const message = activeChat?.messages.find(m => m.id === messageId);
      if (!message || message.detectedLanguage !== 'en') return;

      const summarizer = await self.ai.summarizer.create({
        type: 'key-points',
        format: 'markdown',
        length: 'medium'
      });

      const summary = await summarizer.summarize(message.text);
      
      setChats(prevChats => 
        prevChats.map(chat => {
          if (chat.id !== activeChatId) return chat;
          
          return {
            ...chat,
            messages: chat.messages.map(msg => {
              if (msg.id !== messageId) return msg;
              return {
                ...msg,
                summary: summary,
                loading: false
              };
            })
          };
        })
      );
    } catch (error) {
      setChats(prevChats => 
        prevChats.map(chat => {
          if (chat.id !== activeChatId) return chat;
          
          return {
            ...chat,
            messages: chat.messages.map(msg => {
              if (msg.id !== messageId) return msg;
              return {
                ...msg,
                error: error.message || 'Summarization failed',
                loading: false
              };
            })
          };
        })
      );
    }
  };

  const activeChat = chats.find(chat => chat.id === activeChatId);

  return (
    <div className="w-screen min-h-screen flex gap-0 font-poppins">
      <SideBar 
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        createNewChat={createNewChat}
      />
      
      <main className=" w-3/4 ">
        <NavBar />
        <section className="w-full h-full p-4">  
          {activeChat ? (
            <>
              <Result 
                messages={activeChat.messages} 
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
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select or create a chat to start</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;