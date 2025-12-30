"use client";

import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection, type Accept } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

import { uploadFileAction } from '@/app/actions/upload-actions';

interface UploadZoneProps {
  projectId: bigint;
  onUploadComplete: () => void;
}

// Define the file types you want to accept
const accept: Accept = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/vnd.dwg': ['.dwg'],
};

export function UploadZone({ projectId, onUploadComplete }: UploadZoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null);
    if (fileRejections.length > 0) {
      const rejectionError = fileRejections[0].errors[0].message;
      setError(`File rejected: ${rejectionError}`);
      setFiles([]);
    } else {
      setFiles(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1, // Allow one file at a time to simplify versioning logic
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setError(null);

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', String(projectId));

    try {
      const result = await uploadFileAction(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      // Success
      setFiles([]);
      onUploadComplete(); // This will trigger a re-fetch of the file list
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-gray-600">Drop the file here ...</p>
          ) : (
            <p className="text-gray-600">Drag & drop a file here, or click to select</p>
          )}
          <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG, or DWG (Max 1 file)</p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Selected file:</h4>
          <div className="flex items-center justify-between p-2 mt-2 bg-gray-100 rounded-md">
            <div className="flex items-center gap-2">
              <FileIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-800">{files[0].name}</span>
            </div>
            <button
              onClick={() => setFiles([])}
              className="p-1 text-gray-500 hover:text-red-600"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      )}
    </div>
  );
}
