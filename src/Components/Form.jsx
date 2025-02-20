import send from "../assets/bx-send.svg"

function Form({input, setInput, handleSend}) {
  return (
    <div className="fixed bottom-6 border-slate-500  border-2 right-[20vh] w-[60%] bg-slate-100 rounded-[40px] h-[12vh] flex items-center justify-center  backdrop-blur-xl">
        <form onSubmit={handleSend} className="flex gap-2 w-full ">
           
            <input
              type="text"
              name="message" 
              id="message" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              rows={3}
              className="w-[90%] resize-none flex justify-center items-center rounded-[40px] px-4 h-[80%] font-poppins outline-0 text-xl"
              />
           

              <button type="submit"> 
                  <img src={send} alt="" className="w-[40px] h-[40px]"/>
              </button>
        </form>
    </div>
  )
}

export default Form