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

      const result = await createSiteLog(null, formData)

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
      <div className="p-4 glass-surface border-dashed rounded-3xl overflow-hidden neu-shadow">
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
          className="w-full flex flex-col items-center justify-center gap-4 p-12 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Camera className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <span className="block font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Capture Update</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase mt-1">Tap to open camera</span>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full glass-surface rounded-3xl overflow-hidden shadow-2xl neu-shadow border border-white/10">
      <div className="relative bg-black/20" style={{ width: '100%', paddingTop: '100%' }}>
        <div className="absolute top-0 left-0 w-full h-full">
          <Stage
            width={stageRef.current?.offsetWidth || 400}
            height={stageRef.current?.offsetHeight || 400}
            onClick={handleStageClick}
            ref={stageRef}
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
                  stroke="#3b82f6"
                  strokeWidth={4}
                  shadowBlur={10}
                  shadowColor="#3b82f6"
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
      
      <div className="p-6 bg-white dark:bg-zinc-900/50 backdrop-blur-md">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add site notes or observations..."
          className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-medium"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <button onClick={resetState} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all">
            <X className="h-4 w-4" /> Discard
          </button>
          <button
            onClick={handleSave}
            disabled={isUploading}
            className="shimmer-button flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-all shadow-lg shadow-blue-500/20"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Publish to Hub
          </button>
        </div>
      </div>
    </div>
  )
}
