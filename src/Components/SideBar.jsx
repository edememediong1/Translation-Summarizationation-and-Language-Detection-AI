import { useState } from 'react';
import menu from '../assets/menu.svg';

function SideBar({ chats, activeChatId, setActiveChatId, createNewChat }) {
  const [active, setActive] = useState(false);

  const toggleActive = () => {
    setActive(!active);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-slate-200 ${!active ? "w-1/4" : "w-[15vh]"} min-h-full transition-all`}>
      <div className="flex items-center justify-start p-3 m-5 hover:bg-slate-300 hover:w-[70px] hover:rounded-[50%]">
        <img 
          src={menu} 
          alt="Menu" 
          className="w-[45px] h-[45px] cursor-pointer"
          onClick={toggleActive}
        />
      </div>

      <div className="p-4">
        <button
          onClick={createNewChat}
          className="w-full mb-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
        >
          New Chat +
        </button>

        <div className="space-y-2">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-3 cursor-pointer rounded-lg ${
                chat.id === activeChatId 
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'hover:bg-slate-100'
              }`}
            >
              <div className="truncate text-sm font-medium">
                {chat.messages[0]?.text || "New Chat"}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(chat.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideBar;