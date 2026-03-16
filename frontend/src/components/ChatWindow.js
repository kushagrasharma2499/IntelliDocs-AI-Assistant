import React,{useEffect,useRef} from "react"

export default function ChatWindow({messages}){

 const endRef=useRef()

 useEffect(()=>{
  endRef.current?.scrollIntoView({behavior:"smooth"})
 },[messages])

 return(

 <div className="chat-window">

 {messages.map((m,i)=>(
  <div key={i} className={`message ${m.sender}`}>
   {m.text}
  </div>
 ))}

 <div ref={endRef}/>

 </div>

 )

}


