import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Role } from '../types';
import { User, Bot, Loader2 } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}
          shadow-lg
        `}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Bubble */}
        <div className={`
          flex flex-col gap-2
          ${isUser ? 'items-end' : 'items-start'}
        `}>
          <div className={`
            px-5 py-3 rounded-2xl shadow-md text-sm leading-relaxed overflow-hidden
            ${isUser 
              ? 'bg-zinc-800 text-zinc-100 rounded-tr-sm' 
              : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-sm'}
          `}>
            {message.imageUrl && (
              <div className="mb-3 rounded-lg overflow-hidden border border-zinc-700">
                <img 
                  src={message.imageUrl} 
                  alt="User uploaded" 
                  className="max-w-full max-h-64 object-cover"
                />
              </div>
            )}
            
            <div className="markdown-content">
              {message.isStreaming && message.text.length === 0 ? (
                <div className="flex items-center gap-2 text-zinc-400 italic">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Thinking...</span>
                </div>
              ) : (
                <ReactMarkdown
                  components={{
                    // Style basic elements to match Tailwind aesthetics
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    a: ({node, ...props}) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                    code: ({node, inline, className, children, ...props}: any) => {
                      return inline ? (
                        <code className="bg-zinc-700 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                          {children}
                        </code>
                      ) : (
                        <div className="bg-zinc-950 p-3 rounded-md my-2 border border-zinc-800 overflow-x-auto">
                          <code className="text-xs font-mono" {...props}>
                            {children}
                          </code>
                        </div>
                      );
                    },
                    blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-zinc-600 pl-3 italic text-zinc-400 my-2" {...props} />,
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </div>
            
            {message.isStreaming && message.text.length > 0 && (
               <span className="inline-block w-1.5 h-3 ml-1 align-middle bg-zinc-500 animate-pulse"></span>
            )}
          </div>
          
          <span className="text-[10px] text-zinc-500 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};