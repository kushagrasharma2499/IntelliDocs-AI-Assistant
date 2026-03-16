import { useState } from "react"
import Sidebar from "./components/Sidebar"
import ChatWindow from "./components/ChatWindow"
import ChatInput from "./components/ChatInput"
import axios from "axios"
import "./App.css"

function App(){

 const [uploadedFiles,setUploadedFiles] = useState([])
 const [chatHistory,setChatHistory] = useState({})
 const [activeDoc,setActiveDoc] = useState(null)
 const [messages,setMessages] = useState([])

 const addMessage=(text,sender="bot")=>{

  const newMsg={text,sender}

  setMessages(prev=>{

   const updated=[...prev,newMsg]

   setChatHistory(h=>({
    ...h,
    [activeDoc]:updated
   }))

   return updated
  })

 }

 const uploadFiles=async(files)=>{

  for(const file of files){

   const formData=new FormData()
   formData.append("file",file)

   const res=await axios.post(
    "http://localhost:3000/upload",
    formData
   )

   setUploadedFiles(prev=>[
    ...prev,
    {name:res.data.fileName,id:res.data.documentId}
   ])

  }

 }

 const askQuestion=async(question)=>{

  addMessage(question,"user")

  const res=await axios.post(
   "http://localhost:3000/ask",
   {question}
  )

  addMessage(res.data.answer,"bot")

 }

 const selectDocument=(id)=>{

  setActiveDoc(id)
  setMessages(chatHistory[id] || [])

 }

 const deleteDocument=async(id)=>{

  await axios.delete(`http://localhost:3000/document/${id}`)

  setUploadedFiles(prev=>prev.filter(f=>f.id!==id))

 }

 return(

 <div className="app-container">

  <Sidebar
   uploadedFiles={uploadedFiles}
   uploadFiles={uploadFiles}
   selectDocument={selectDocument}
   deleteDocument={deleteDocument}
  />

  <div className="chat-area">

   <ChatWindow messages={messages}/>

   <ChatInput askQuestion={askQuestion}/>

  </div>

 </div>

 )

}

export default App


