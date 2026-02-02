import React from 'react';
import { FileText, BookOpen, LayoutTemplate, UploadCloud, GraduationCap } from 'lucide-react';
import { FacultySelection, CIAType, QPType } from '../types';

interface InputSectionProps {
  cdap: string;
  syllabus: string;
  template: string;
  facultySelection: FacultySelection;
  onCdapChange: (val: string) => void;
  onSyllabusChange: (val: string) => void;
  onTemplateChange: (val: string) => void;
  onFacultySelectionChange: (selection: Partial<FacultySelection>) => void;
  onLoadSample: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  cdap,
  syllabus,
  template,
  facultySelection,
  onCdapChange,
  onSyllabusChange,
  onTemplateChange,
  onFacultySelectionChange,
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

      {/* Faculty Selection Panel */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-indigo-700">
          <GraduationCap size={22} />
          <h3 className="font-semibold text-lg">Faculty Selection</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Course Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
            <input
              type="text"
              placeholder="e.g., CS302"
              value={facultySelection.courseCode}
              onChange={(e) => onFacultySelectionChange({ courseCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
            />
          </div>

          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
            <input
              type="text"
              placeholder="e.g., Data Structures"
              value={facultySelection.courseTitle}
              onChange={(e) => onFacultySelectionChange({ courseTitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
            />
          </div>

          {/* CIA Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CIA Type</label>
            <div className="flex gap-2">
              {(['CIA-I', 'CIA-II'] as CIAType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => onFacultySelectionChange({ ciaType: type })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${facultySelection.ciaType === type
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* QP Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">QP Type</label>
            <div className="flex gap-2">
              {(['QP-I', 'QP-II'] as QPType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => onFacultySelectionChange({ qpType: type })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${facultySelection.qpType === type
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pattern Info */}
        <div className="mt-4 pt-4 border-t border-indigo-200">
          <div className="flex gap-6 text-xs text-gray-600">
            <div className="flex-1 bg-white p-3 rounded-lg border border-gray-200">
              <span className="font-semibold text-indigo-700">
                {facultySelection.ciaType === 'CIA-I' ? 'CIA-I' : 'CIA-II'}:
              </span>
              <span className="ml-1">
                {facultySelection.ciaType === 'CIA-I'
                  ? 'Units I, II → CO1, CO2'
                  : 'Units III, IV → CO3, CO4'}
              </span>
            </div>
            <div className="flex-1 bg-white p-3 rounded-lg border border-gray-200">
              <span className="font-semibold text-purple-700">
                {facultySelection.qpType === 'QP-I' ? 'QP-I' : 'QP-II'}:
              </span>
              <span className="ml-1">
                {facultySelection.qpType === 'QP-I'
                  ? 'Part A (6×2=12) + Part B (4×12=48) = 60'
                  : 'Part A (6×2=12) + Part B (2×16=32) + Part C (1×16=16) = 60'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CDAP Input */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col h-80">
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
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col h-80">
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
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col h-80">
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
