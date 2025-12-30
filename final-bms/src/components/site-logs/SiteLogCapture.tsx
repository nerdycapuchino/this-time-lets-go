'use client'

import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Circle, Image as KonvaImage } from 'react-konva'
import { Camera, Send, X, Edit, Loader2 } from 'lucide-react'
import { createSiteLog } from '@/app/actions/siteLogs'
import useImage from 'use-image'

interface SiteLogCaptureProps {
  projectId: string
  onUploadComplete: () => void
}

interface Mark {
  id: number
  x: number
  y: number
  radius: number
}

export function SiteLogCapture({ projectId, onUploadComplete }: SiteLogCaptureProps) {
  const [image, setImage] = useState<string | null>(null)
  const [marks, setMarks] = useState<Mark[]>([])
  const [notes, setNotes] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  
  const stageRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [konvaImage] = useImage(image || '')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setMarks([]) // Reset marks for new image
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleStageClick = (e: any) => {
    if (!image) return
    const stage = e.target.getStage()
    const pos = stage.getPointerPosition()
    const newMark: Mark = {
      id: Date.now(),
      x: pos.x,
      y: pos.y,
      radius: 20,
    }
    setMarks([...marks, newMark])
  }

  const handleSave = async () => {
    if (!image || !stageRef.current) return
    setIsUploading(true)

    try {
      // Get the data URL of the stage (image + markup)
      const dataUrl = stageRef.current.toDataURL({
        mimeType: 'image/jpeg',
        quality: 0.8,
      })

      const formData = new FormData()
      formData.append('projectId', projectId)
      formData.append('notes', notes)
      formData.append('markupData', JSON.stringify(marks))
      formData.append('file', dataUrl) // Sending as a data URL

      const result = await createSiteLog(formData)

      if (result.error) {
        alert(`Error: ${result.error}`)
      } else {
        alert('Site log saved successfully!')
        resetState()
        onUploadComplete()
      }
    } catch (error) {
      console.error('Failed to save site log:', error)
      alert('An unexpected error occurred.')
    } finally {
      setIsUploading(false)
    }
  }

  const resetState = () => {
    setImage(null)
    setMarks([])
    setNotes('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!image) {
    return (
      <div className="p-4 border border-dashed rounded-lg">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 p-8 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Camera className="h-10 w-10 text-slate-500" />
          <span className="font-semibold text-slate-700">Add Site Log</span>
          <span className="text-sm text-slate-500">Tap to open camera</span>
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <div className="relative" style={{ width: '100%', paddingTop: '100%' }}>
        <div className="absolute top-0 left-0 w-full h-full">
          <Stage
            width={stageRef.current?.offsetWidth || 400}
            height={stageRef.current?.offsetHeight || 400}
            onClick={handleStageClick}
            ref={stageRef}
            className="bg-gray-200"
          >
            <Layer>
              <KonvaImage
                image={konvaImage}
                width={stageRef.current?.offsetWidth || 400}
                height={stageRef.current?.offsetHeight || 400}
              />
              {marks.map((mark) => (
                <Circle
                  key={mark.id}
                  x={mark.x}
                  y={mark.y}
                  radius={mark.radius}
                  stroke="red"
                  strokeWidth={4}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-b-lg border-t-0 border">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this log..."
          className="w-full p-2 border rounded-md mb-3"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <button onClick={resetState} className="flex items-center gap-2 text-sm text-red-600 font-medium p-2 rounded-md hover:bg-red-50">
            <X className="h-4 w-4" /> Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUploading}
            className="flex items-center gap-2 text-sm text-white font-semibold p-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Save Log
          </button>
        </div>
      </div>
    </div>
  )
}
