import React from 'react';
import { Printer } from 'lucide-react';

interface PaperViewProps {
  paperContent: string;
}

const PaperView: React.FC<PaperViewProps> = ({ paperContent }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors print:hidden"
        >
          <Printer size={18} />
          Print Paper
        </button>
      </div>

      <div className="flex-1 bg-white p-12 shadow-md rounded-lg overflow-auto border border-gray-200 max-w-4xl mx-auto w-full print:shadow-none print:border-none print:p-0 print:w-full">
        <article className="prose max-w-none paper-font text-black whitespace-pre-wrap">
          {paperContent}
        </article>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .paper-font, .paper-font * {
            visibility: visible;
          }
          .paper-font {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaperView;
