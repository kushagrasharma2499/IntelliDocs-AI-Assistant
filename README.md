# IntelliDocs – AI Assistant (RAG System)

IntelliDocs is an AI-powered document assistant that allows users to upload documents and interact with them using natural language. The system uses a **Retrieval-Augmented Generation (RAG)** architecture to retrieve relevant information from documents and generate accurate AI responses.

---

## 🚀 Features

* 📄 Upload and process documents (PDF, TXT, etc.)
* 🔍 Semantic search using embeddings
* 🤖 AI-powered question answering
* ⚡ Fast retrieval with vector database
* 🌐 User-friendly frontend interface
* 🔗 Backend API for document processing and query handling

---

## 🏗️ Project Architecture

The project follows a **RAG (Retrieval-Augmented Generation)** architecture:

1. **Document Ingestion**

   * Upload documents
   * Extract text
   * Split into chunks

2. **Embedding Generation**

   * Convert text chunks into vector embeddings

3. **Vector Storage**

   * Store embeddings in a vector database

4. **Query Processing**

   * User asks a question
   * Relevant chunks retrieved

5. **AI Response Generation**

   * Retrieved data passed to LLM
   * LLM generates contextual response

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML / CSS

### Backend

* Node.js
* Express.js

### AI / RAG

* LLM APIs
* Embeddings
* Vector Database

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/kushagrasharma2499/IntelliDocs-AI-Assistant.git
```

### 2️⃣ Navigate to the project

```bash
cd IntelliDocs-AI-Assistant
```

---

## ▶️ Run the Backend

```bash
cd backend
npm install
npm start
```

Backend will start on:

```
http://localhost:3001
```

---

## ▶️ Run the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will start on:

```
http://localhost:3000
```

---

## 📌 Usage

1. Upload a document through the frontend
2. The system processes and stores document embeddings
3. Ask questions related to the document
4. AI retrieves relevant context and generates an answer
