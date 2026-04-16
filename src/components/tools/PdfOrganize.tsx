import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Download, RefreshCw, LayoutGrid, GripVertical, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import * as pdfService from '../../services/pdfService';
import { downloadBinary } from '../../utils/downloadUtils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface PdfOrganizeProps {
  onBack: () => void;
}

export const PdfOrganize: React.FC<PdfOrganizeProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<{ id: string; originalIndex: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [resultData, setResultData] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.PDF_ORGANIZE];

  useEffect(() => {
    if (file) {
      const loadPdf = async () => {
        const { PDFDocument } = await import('pdf-lib');
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const count = pdfDoc.getPageCount();
        setPageCount(count);
        setPages(Array.from({ length: count }, (_, i) => ({ id: `page-${i}`, originalIndex: i })));
      };
      loadPdf();
    } else {
      setPages([]);
      setPageCount(0);
    }
  }, [file]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(pages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPages(items);
  };

  const removePage = (id: string) => {
    setPages(pages.filter(p => p.id !== id));
  };

  const handleProcess = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);
    try {
      const indices = pages.map(p => p.originalIndex);
      const data = await pdfService.reorderPdfPages(file, indices);
      setResultData(data);
      setIsComplete(true);
    } catch (err) {
      showToast('Error organizing PDF', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-doc-slate mb-3">PDF Organized!</h2>
        <p className="text-slate-600 mb-8">Your new PDF with {pages.length} pages is ready.</p>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => { setFile(null); setIsComplete(false); }} variant="outline">Start Over</Button>
          <Button onClick={() => downloadBinary(resultData!, 'organized.pdf', 'application/pdf')} className="bg-emerald-600" icon={<Download size={18} />}>
            Download PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SeoHelmet tool={toolInfo as any} />
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
        </div>
      </div>

      {!file ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <FileUpload accept="application/pdf" onFileSelect={setFile} label="Upload PDF to Organize Pages" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-700">Drag to reorder, click X to delete</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-500">{pages.length} Pages remaining</span>
                <Button onClick={handleProcess} isLoading={isProcessing} className="bg-cyan-600" icon={<RefreshCw size={18} />}>
                  Save Changes
                </Button>
              </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="pages" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                  >
                    {pages.map((page, index) => (
                      <Draggable key={page.id} draggableId={page.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="relative group bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all select-none"
                          >
                            <div {...provided.dragHandleProps} className="absolute top-2 left-2 p-1 text-slate-300 hover:text-slate-500 cursor-grab">
                              <GripVertical size={14} />
                            </div>
                            <button
                              onClick={() => removePage(page.id)}
                              className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </button>
                            <div className="aspect-[3/4] bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 mb-2">
                              <span className="text-2xl font-bold text-slate-300">{page.originalIndex + 1}</span>
                            </div>
                            <div className="text-center text-xs font-bold text-slate-400">PAGE {index + 1}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      )}
    </div>
  );
};
