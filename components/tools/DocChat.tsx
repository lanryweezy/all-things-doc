import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { fileToBase64 } from '../../services/imageService';
import { processPdf, createChatSession } from '../../services/geminiService';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import { Chat, GenerateContentResponse } from "@google/genai";

interface DocChatProps {
  onBack: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const DocChat: React.FC<DocChatProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toolInfo = TOOLS[ToolID.CHAT_WITH_DOC];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsUploading(true);
    try {
      let docText = "";
      if (uploadedFile.type === 'application/pdf') {
        const base64 = await fileToBase64(uploadedFile);
        docText = await processPdf(base64, 'WORD', 'text');
      } else {
        docText = await uploadedFile.text();
      }

      const systemInstruction = `You are a helpful assistant. The user has uploaded a document with the following content:\n\n${docText}\n\nAnswer questions based on this document. Keep answers concise and relevant to the document content.`;
      const chat = createChatSession(systemInstruction);
      setChatSession(chat);
      setMessages([{ role: 'model', text: `I've analyzed ${uploadedFile.name}. What would you like to know about it?` }]);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze document.");
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsSending(true);

    try {
      const response: GenerateContentResponse = await chatSession.sendMessage({ message: userMsg });
      const modelMsg = response.text || "I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'model', text: modelMsg }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error." }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-4 flex-shrink-0">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-doc-slate transition-colors mb-2"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Tools
        </button>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-2xl font-bold text-doc-slate">{toolInfo.title}</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-grow flex flex-col overflow-hidden">
        {!chatSession ? (
          <div className="p-8 flex flex-col justify-center h-full">
            <FileUpload 
              accept=".pdf,.txt,.md,.json,.js,.ts,.py"
              selectedFile={file}
              onFileSelect={handleFileUpload}
              label="Upload PDF or Text Document to Chat"
              processingProgress={isUploading ? 50 : undefined}
            />
            {isUploading && <p className="text-center text-slate-500 mt-4">Analyzing document content...</p>}
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-doc-red text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                   <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 bg-white border-t border-slate-200">
               <div className="flex items-center space-x-2">
                 <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question about the document..."
                  className="flex-grow p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-doc-red focus:border-transparent outline-none"
                  disabled={isSending}
                 />
                 <Button 
                   onClick={handleSend}
                   disabled={!input.trim() || isSending}
                   className="!p-3 !rounded-xl"
                   icon={<Send size={20} />}
                 >
                 </Button>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};