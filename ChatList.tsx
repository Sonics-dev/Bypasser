import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { Sparkles } from 'lucide-react';

interface ChatListProps {
  messages: Message[];
}

export const ChatList: React.FC<ChatListProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messages[messages.length - 1]?.text]); // Scroll on new message or text update

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 opacity-60">
        <Sparkles size={48} className="mb-4 text-emerald-600/50" />
        <h2 className="text-xl font-light mb-2">Welcome to Gemini Zen</h2>
        <p className="text-sm">Start a conversation or upload an image.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 py-6">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
};