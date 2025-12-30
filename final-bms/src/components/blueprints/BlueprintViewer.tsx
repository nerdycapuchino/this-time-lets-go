"use client";

import { X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { getMarkupComments, addMarkupComment } from "@/app/actions/blueprints";

type Revision = {
  id: number;
  publicUrl: string;
};

type BlueprintViewerProps = {
  revision: Revision;
  onClose: () => void;
};

type Comment = {
  x: number;
  y: number;
  text: string;
};

type Markup = {
  id: number;
  markup_data: Comment;
};

export default function BlueprintViewer({ revision, onClose }: BlueprintViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [markups, setMarkups] = useState<Markup[]>([]);
  const [activeComment, setActiveComment] = useState<Omit<Comment, "text"> | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      const existingMarkups = await getMarkupComments(revision.id);
      setMarkups(existingMarkups);
    };
    fetchComments();
  }, [revision.id]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setActiveComment({ x, y });
  };
  
  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeComment) return;
    const text = (event.currentTarget.elements.namedItem("commentText") as HTMLInputElement).value;
    const newComment = { ...activeComment, text };

    const result = await addMarkupComment(revision.id, newComment);
    if (result.data) {
      setMarkups([...markups, result.data]);
    }
    
    setActiveComment(null);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && image && ctx) {
      canvas.width = image.clientWidth;
      canvas.height = image.clientHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      markups.forEach((markup, index) => {
        const comment = markup.markup_data;
        ctx.beginPath();
        ctx.arc(comment.x, comment.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.font = "12px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((index + 1).toString(), comment.x, comment.y);
      });
    }
  }, [markups, revision.publicUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white p-4 rounded-lg max-w-6xl w-full max-h-full overflow-auto flex space-x-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 z-20"
        >
          <X size={20} />
        </button>
        <div className="relative w-3/4">
          <img ref={imageRef} src={revision.publicUrl} alt="Blueprint" className="w-full h-auto" onLoad={() => {
              setMarkups(prev => [...prev]);
          }}/>
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0"
            onClick={handleCanvasClick}
          />
          {activeComment && (
             <form 
                onSubmit={handleCommentSubmit}
                className="absolute bg-white p-3 rounded-lg shadow-xl"
                style={{ left: activeComment.x + 15, top: activeComment.y - 15 }}
             >
                <input 
                    type="text"
                    name="commentText"
                    placeholder="Add a comment..."
                    className="border-b focus:outline-none"
                    autoFocus
                />
                <button type="submit" className="text-sm text-blue-600 ml-2">Save</button>
             </form>
          )}
        </div>
        <div className="w-1/4">
            <h3 className="text-lg font-bold">Comments</h3>
            <ul className="mt-2 space-y-2">
                {markups.map((markup, index) => (
                    <li key={markup.id} className="flex items-start text-sm">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm mr-3">{index + 1}</div>
                        <p>{markup.markup_data.text}</p>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
}
