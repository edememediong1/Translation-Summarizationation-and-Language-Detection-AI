

function Form({input, setInput}) {
  return (
    <div>
        <form >
           
            <textarea 
              name="message" 
              id="message" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className=""
              rows={3}
              >
              </textarea>

              <button type="submit"> 
                  Send
              </button>
        </form>
    </div>
  )
}

export default Form