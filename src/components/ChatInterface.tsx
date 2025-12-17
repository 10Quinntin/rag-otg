'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { flowiseService, ChatMessage } from '@/services/flowiseService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    pageContent: string;
    metadata: { [key: string]: any };
  }>;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: 'Hello Boss! How can I help you with motor rentals today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Build history from previous messages
      const history: Array<{ question: string; answer: string }> = [];
      for (let i = 0; i < messages.length; i += 2) {
        if (messages[i].role === 'user' && messages[i + 1]?.role === 'assistant') {
          history.push({
            question: messages[i].content,
            answer: messages[i + 1].content,
          });
        }
      }

      const response = await flowiseService.sendMessage(userMessage.content, history);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        sources: response.sourceDocuments,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to get response. Please check your Flowise configuration.');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message || 'Failed to get response. Please check your Flowise configuration.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] md:h-[700px] bg-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden">
      {/* Title Bar */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-700">
        <h2 className="text-white text-lg font-semibold">AI Assistant</h2>
        <i className="fas fa-robot text-primary-500"></i>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                <i className="fas fa-robot text-primary-500 text-lg"></i>
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-[#3a3a3a] text-white'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              
              {message.sources && message.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-500">
                  <p className="text-xs font-semibold mb-1">Sources:</p>
                  <div className="space-y-1">
                    {message.sources.slice(0, 3).map((source, idx) => (
                      <div key={idx} className="text-xs opacity-75">
                        <p className="truncate">{source.pageContent.substring(0, 100)}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs opacity-60 mt-2">
                {message.id === 'initial' ? 'Just now' : message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              <i className="fas fa-robot text-primary-500 text-lg"></i>
            </div>
            <div className="bg-[#3a3a3a] rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-3 bg-red-900/30 border-t border-red-700">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about motor rentals, pricing, availability..."
            disabled={isLoading}
            rows={1}
            className="flex-1 px-4 py-3 bg-[#3a3a3a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 resize-none"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-primary-500 text-white rounded-full hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

