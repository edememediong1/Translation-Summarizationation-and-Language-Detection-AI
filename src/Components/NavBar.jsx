import message from "../assets/message.svg"

function NavBar() {
  return (
    <nav className="bg-slate-100 h-[13vh] w-full flex items-center justify-between shadow-md fixed font-poppins">
        <div className="p-4">
            <h1 className="font-medium text-[24px] text-slate-800 flex gap-1"><img src={message} alt=""/>Nano Chat</h1>
            <p className="font-medium text-slate-600">Chat, Translate & Summarize</p>
        </div>
    </nav>
  )
}

export default NavBar