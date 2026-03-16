import express from "express"
import cors from "cors"
import multer from "multer"
import path from "path"
import fs from "fs"
import xlsx from "xlsx"
import { v4 as uuidv4 } from "uuid"

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { ChatOllama } from "@langchain/ollama"
import { OllamaEmbeddings } from "@langchain/ollama"

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx"

import { HNSWLib } from "@langchain/community/vectorstores/hnswlib"

const app = express()

app.use(cors())
app.use(express.json())

/* Ensure folders exist */

if (!fs.existsSync("uploads")) {
 fs.mkdirSync("uploads")
}

if (!fs.existsSync("vectorStores")) {
 fs.mkdirSync("vectorStores")
}

/* File Upload */

const upload = multer({
 dest: "uploads/"
})

/* In-memory store */

let vectorStores = {}

/* LLM + Embeddings */

const model = new ChatOllama({
 model: "llama3"
})

const embeddings = new OllamaEmbeddings({
 model: "llama3"
})

/* Load vector stores on server start */

async function loadVectorStores() {

 const folders = fs.readdirSync("vectorStores")

 for (const folder of folders) {

  try {

   const store = await HNSWLib.load(
    `vectorStores/${folder}`,
    embeddings
   )

   vectorStores[folder] = store

   console.log(`Loaded vector store: ${folder}`)

  } catch (err) {

   console.log(`Failed loading store ${folder}`)

  }

 }

}

loadVectorStores()

/* Upload Document */

app.post("/upload", upload.single("file"), async (req, res) => {

 try {

  const documentId = uuidv4()

  const filePath = req.file.path
  const ext = path.extname(req.file.originalname)

  let docs = []

  /* PDF */

  if (ext === ".pdf") {

   const loader = new PDFLoader(filePath)
   docs = await loader.load()

  }

  /* DOCX */

  else if (ext === ".docx") {

   const loader = new DocxLoader(filePath)
   docs = await loader.load()

  }

  /* Excel */

  else if (ext === ".xlsx" || ext === ".xls") {

   const workbook = xlsx.readFile(filePath)

   const sheet =
    workbook.Sheets[workbook.SheetNames[0]]

   const data = xlsx.utils.sheet_to_json(sheet)

   docs = [{
    pageContent: JSON.stringify(data),
    metadata: {
     source: req.file.originalname
    }
   }]

  }

  else {

   return res.status(400).json({
    error: "Unsupported file format"
   })

  }

  /* Split document */

  const splitter =
   new RecursiveCharacterTextSplitter({

    chunkSize: 500,
    chunkOverlap: 50

   })

  const splitDocs =
   await splitter.splitDocuments(docs)

  /* Create vector store */

  const store =
   await HNSWLib.fromDocuments(
    splitDocs,
    embeddings
   )

  const storePath = `vectorStores/${documentId}`

  await store.save(storePath)

  vectorStores[documentId] = store

  res.json({

   documentId,
   fileName: req.file.originalname

  })

 } catch (err) {

  console.error(err)

  res.status(500).json({
   error: "Upload failed"
  })

 }

})

/* Delete Document */

app.delete("/document/:id", async (req, res) => {

 try {

  const id = req.params.id

  delete vectorStores[id]

  const folder = `vectorStores/${id}`

  if (fs.existsSync(folder)) {

   fs.rmSync(folder, { recursive: true })

  }

  res.json({
   message: "Document deleted"
  })

 } catch (err) {

  res.status(500).json({
   error: "Delete failed"
  })

 }

})

/* Ask Question (Multi-document search) */

app.post("/ask", async (req, res) => {

 try {

  const { question } = req.body

  let results = []

  for (const id of Object.keys(vectorStores)) {

   const store = vectorStores[id]

   const docs =
    await store.similaritySearch(question, 2)

   results.push(...docs)

  }

  /* Limit top results */

  results = results.slice(0, 6)

  const context =
   results
    .map(d => d.pageContent)
    .join("\n")

  const prompt = `

You are an AI assistant.

Use the context below to answer the question.

Context:
${context}

Question:
${question}

Answer:

`

  const response =
   await model.invoke(prompt)

  res.json({

   answer: response.content,

   sources: results.map(d => ({
    content: d.pageContent.substring(0,200),
    metadata: d.metadata
   }))

  })

 } catch (err) {

  console.error(err)

  res.status(500).json({
   error: "Failed to answer"
  })

 }

})

/* Streaming AI (ChatGPT-style) */

app.get("/stream", async (req, res) => {

 try {

  const { question } = req.query

  let results = []

  for (const id of Object.keys(vectorStores)) {

   const docs =
    await vectorStores[id]
     .similaritySearch(question,2)

   results.push(...docs)

  }

  const context =
   results.map(d=>d.pageContent).join("\n")

  const prompt = `

Use the context to answer.

Context:
${context}

Question:
${question}

Answer:

`

  res.setHeader("Content-Type","text/event-stream")
  res.setHeader("Cache-Control","no-cache")
  res.setHeader("Connection","keep-alive")

  const stream =
   await model.stream(prompt)

  for await (const chunk of stream) {

   res.write(`data: ${chunk.content}\n\n`)

  }

  res.write("data: [DONE]\n\n")

  res.end()

 } catch (err) {

  console.error(err)

  res.end()

 }

})

/* Health Check */

app.get("/", (req,res)=>{

 res.send("AI Document Chat Backend Running")

})

/* Start Server */

app.listen(3000, () => {

 console.log("🚀 Server running on port 3000")

})


