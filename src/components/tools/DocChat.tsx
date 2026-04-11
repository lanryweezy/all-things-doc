import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { fileToBase64 } from '../../services/imageService';
import { createChatSession } from '../../services/geminiService';
import { extractTextFromPdf } from '../../services/pdfService';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import { Chat, GenerateContentResponse } from '@google/genai';

interface DocChatProps {
  onBack: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const DocChat: React.FC<DocChatProps> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toolInfo = TOOLS[ToolID.CHAT_WITH_DOC];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleFileUpload = async (uploadedFile: File) => {
    const newFiles = [...files, uploadedFile];
    setFiles(newFiles);
    setIsUploading(true);
    try {
      let combinedText = '';
      for (const f of newFiles) {
        let docText = '';
        const ext = f.name.split('.').pop()?.toLowerCase();
        if (f.type === 'application/pdf' || ext === 'pdf') {
          docText = await extractTextFromPdf(f);
        } else if (ext === 'docx' || ext === 'doc') {
          const { wordToText } = await import('../../services/pdfService');
          docText = await wordToText(f);
        } else if (ext === 'xlsx' || ext === 'xls') {
          const { excelToCsv } = await import('../../services/pdfService');
          docText = await excelToCsv(f);
        } else {
          docText = await f.text();
        }
        combinedText += `\n--- Document: ${f.name} ---\n${docText}\n`;
      }

      const systemInstruction = `You are a helpful assistant. The user has uploaded ${newFiles.length} document(s) with the following content:\n\n${combinedText}\n\nAnswer questions based on these documents. Keep answers concise and relevant.`;
      const chat = createChatSession(systemInstruction);
      setChatSession(chat);

      if (messages.length === 0) {
        setMessages([
          {
            role: 'model',
            text: `I've analyzed ${newFiles.length} document(s). What would you like to know about them?`,
          },
        ]);
      } else {
        setMessages(prev => [...prev, {
          role: 'model',
          text: `Added ${uploadedFile.name} to the conversation context.`,
        }]);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to analyze document.');
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
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error.' }]);
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
        {files.length === 0 ? (
          <div className="p-8 flex flex-col justify-center h-full">
            <FileUpload
              accept=".pdf,.txt,.md,.json,.js,.ts,.py,.docx,.xlsx"
              onFileSelect={handleFileUpload}
              label="Upload PDF or Text Document to Chat"
              processingProgress={isUploading ? 50 : undefined}
            />
            {isUploading && (
              <p className="text-center text-slate-500 mt-4">Analyzing document content...</p>
            )}
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-doc-red text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
               <div className="flex -space-x-2 overflow-hidden">
                 {files.map((f, i) => (
                   <div key={i} title={f.name} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-doc-red flex items-center justify-center text-[10px] text-white font-bold">
                     DOC
                   </div>
                 ))}
               </div>
               <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.onchange = (e: any) => handleFileUpload(e.target.files[0]);
                  input.click();
                }}
                className="text-xs font-bold text-doc-red hover:underline"
               >
                 + Add another
               </button>
            </div>
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question about the document..."
                  className="flex-grow p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-doc-red focus:border-transparent outline-none"
                  disabled={isSending}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isSending}
                  className="!p-3 !rounded-xl"
                  icon={<Send size={20} />}
                ></Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
