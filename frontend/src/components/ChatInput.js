import React,{useState} from "react"

export default function ChatInput({askQuestion}){

 const [input,setInput]=useState("")

 const handleSubmit=(e)=>{

  e.preventDefault()

  if(!input.trim()) return

  askQuestion(input)

  setInput("")

 }

 return(

 <form className="chat-form" onSubmit={handleSubmit}>

 <input
  value={input}
  onChange={(e)=>setInput(e.target.value)}
  placeholder="Ask something..."
 />

 <button>Send</button>

 </form>

 )

}
