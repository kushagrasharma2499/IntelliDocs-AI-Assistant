import React from "react"
import DropUpload from "./DropUpload"

export default function Sidebar({
  uploadedFiles,
  uploadFiles,
  selectDocument,
  deleteDocument,
  activeDoc
}) {

  return (

    <aside className="sidebar">

      <h2>📄 IntelliDocs AI</h2>

      <DropUpload uploadFiles={uploadFiles} />

      <ul className="doc-list">

        {uploadedFiles.map((file) => (

          <li
            key={file.id}
            className={`doc-item ${
              activeDoc === file.id ? "active" : ""
            }`}
            onClick={() => selectDocument(file.id)}
          >

            {/* Delete Button in Front */}
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation()
                deleteDocument(file.id)
              }}
            >
              🗑
            </button>

            {/* File Name */}
            <span className="doc-name">
              {file.name}
            </span>

          </li>

        ))}

      </ul>

    </aside>

  )

}

