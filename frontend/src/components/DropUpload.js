import React from "react"
import { useDropzone } from "react-dropzone"

export default function DropUpload({ uploadFiles }) {

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        uploadFiles(acceptedFiles)
      }
    })

  return (

    <div
      {...getRootProps()}
      className={`drop-zone ${isDragActive ? "active" : ""}`}
    >

      <input {...getInputProps()} />

      {isDragActive
        ? "Drop files here..."
        : "Drag & drop files or click to upload"}

    </div>

  )

}


