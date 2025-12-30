'use client'

import { useCallback, useState } from 'react'
import { useDropzone, type Accept, type DropzoneOptions } from 'react-dropzone'
import { UploadCloud, Loader2 } from 'lucide-react'
import { uploadRevision } from '@/app/actions/revisions'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  projectId: string
}

export function UploadZone({ projectId }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setIsUploading(true)
    try {
      const file = acceptedFiles[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('projectId', projectId)
      formData.append('drawingName', file.name)

      const result = await uploadRevision(formData)

      if (result.error) {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert("An unexpected error occurred during upload.")
    } finally {
      setIsUploading(false)
    }
  }, [projectId])

  // 1. Explicitly define the Accept type to satisfy Dropzone requirements
  const acceptTypes: Accept = {
    'application/pdf': ['.pdf'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'application/acad': ['.dwg'],
    'application/x-autocad': ['.dwg'], // Adding common variation for DWG
  }

  // 2. Define options separately for better type clarity
  const dropzoneOptions = {
    onDrop,
    multiple: false,
    accept: acceptTypes,
    disabled: isUploading
  } as any as DropzoneOptions

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions)

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 touch-manipulation",
        isDragActive 
          ? "border-blue-500 bg-blue-50" 
          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
        isUploading && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* 3. Cast getInputProps to handle the HTML Attribute mismatch correctly */}
      <input {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)} />
      
      <div className="flex flex-col items-center justify-center gap-3">
        {isUploading ? (
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        ) : (
          <UploadCloud className={cn(
            "h-10 w-10 transition-colors",
            isDragActive ? "text-blue-500" : "text-gray-400"
          )} />
        )}
        
        <div className="text-sm text-gray-600">
          {isUploading ? (
            <p className="font-medium">Uploading new version...</p>
          ) : isDragActive ? (
            <p className="font-medium text-blue-600">Drop the file here</p>
          ) : (
            <>
              <p className="font-medium">Tap to upload or drag & drop</p>
              <p className="text-xs text-gray-400 mt-1 uppercase">PDF, PNG, DWG (Max 50MB)</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}