import React from 'react';
import { FileText, BookOpen, LayoutTemplate, UploadCloud } from 'lucide-react';

interface InputSectionProps {
  cdap: string;
  syllabus: string;
  template: string;
  onCdapChange: (val: string) => void;
  onSyllabusChange: (val: string) => void;
  onTemplateChange: (val: string) => void;
  onLoadSample: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  cdap,
  syllabus,
  template,
  onCdapChange,
  onSyllabusChange,
  onTemplateChange,
  onLoadSample
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Configuration & Inputs</h2>
        <button
          onClick={onLoadSample}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          <UploadCloud size={16} />
          Load Sample Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CDAP Input */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col h-96">
          <div className="flex items-center gap-2 mb-3 text-blue-700">
            <FileText size={20} />
            <h3 className="font-semibold">CDAP Rules</h3>
          </div>
          <textarea
            className="flex-1 w-full p-3 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-gray-50"
            placeholder="Paste Course Design & Assessment Plan (Excel content)..."
            value={cdap}
            onChange={(e) => onCdapChange(e.target.value)}
          />
        </div>

        {/* Syllabus Input */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col h-96">
          <div className="flex items-center gap-2 mb-3 text-emerald-700">
            <BookOpen size={20} />
            <h3 className="font-semibold">Syllabus</h3>
          </div>
          <textarea
            className="flex-1 w-full p-3 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none bg-gray-50"
            placeholder="Paste Syllabus PDF content here..."
            value={syllabus}
            onChange={(e) => onSyllabusChange(e.target.value)}
          />
        </div>

        {/* Template Input */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col h-96">
          <div className="flex items-center gap-2 mb-3 text-purple-700">
            <LayoutTemplate size={20} />
            <h3 className="font-semibold">Paper Template</h3>
          </div>
          <textarea
            className="flex-1 w-full p-3 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none bg-gray-50"
            placeholder="Paste Question Paper Template rules..."
            value={template}
            onChange={(e) => onTemplateChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default InputSection;
