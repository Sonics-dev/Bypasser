import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string, image: File | null) => void;
  disabled: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if ((!text.trim() && !image) || disabled) return;
    onSend(text, image);
    setText('');
    removeImage();
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <div className="relative flex flex-col bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-2xl transition-all focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-600">
        
        {/* Image Preview Area */}
        {imagePreview && (
          <div className="p-3 border-b border-zinc-800 flex gap-2">
            <div className="relative group inline-block">
              <img 
                src={imagePreview} 
                alt="Upload preview" 
                className="h-16 w-16 object-cover rounded-md border border-zinc-700"
              />
              <button 
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-zinc-800 text-zinc-300 rounded-full p-0.5 shadow-md hover:bg-red-900 hover:text-red-200 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end p-3 gap-2">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
            title="Upload Image"
          >
            <ImageIcon size={20} />
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            disabled={disabled}
            className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 text-base py-2 focus:outline-none resize-none max-h-[150px] no-scrollbar"
            rows={1}
          />

          <button 
            onClick={handleSend}
            disabled={(!text.trim() && !image) || disabled}
            className={`
              p-2 rounded-xl transition-all duration-200
              ${(!text.trim() && !image) || disabled 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-500 hover:scale-105 active:scale-95'}
            `}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      <div className="text-center mt-2">
         <p className="text-[10px] text-zinc-600">Powered by Gemini 3 Flash</p>
      </div>
    </div>
  );
};