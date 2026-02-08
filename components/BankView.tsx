import React, { useMemo, useState } from 'react';
import { Question } from '../types';
import { Filter, Download, Image, FileText } from 'lucide-react';

interface BankViewProps {
  questions: Question[];
}

const BankView: React.FC<BankViewProps> = ({ questions }) => {
  const [filterUnit, setFilterUnit] = useState<string>('All');
  const [filterMarks, setFilterMarks] = useState<string>('All');
  const [filterDiagram, setFilterDiagram] = useState<string>('All');

  // Safety check: ensure questions is always an array
  const safeQuestions = Array.isArray(questions) ? questions : [];

  const filteredQuestions = useMemo(() => {
    return safeQuestions.filter(q => {
      const unitMatch = filterUnit === 'All' || q.unit.toString() === filterUnit;
      const marksMatch = filterMarks === 'All' || q.marks.toString() === filterMarks;
      const diagramMatch = filterDiagram === 'All' ||
        (filterDiagram === 'Diagram' && q.hasDiagram) ||
        (filterDiagram === 'No Diagram' && !q.hasDiagram);
      return unitMatch && marksMatch && diagramMatch;
    });
  }, [safeQuestions, filterUnit, filterMarks, filterDiagram]);

  // Count diagram questions
  const diagramCount = useMemo(() => {
    return safeQuestions.filter(q => q.hasDiagram).length;
  }, [safeQuestions]);

  // Fix: Ensure sort arguments are treated as numbers to avoid TS errors
  const units = Array.from(new Set(safeQuestions.map(q => q.unit))).sort((a, b) => Number(a) - Number(b));

  const downloadCSV = () => {
    // Enhanced CSV export with diagram fields
    const headers = ['ID', 'Unit', 'Marks', 'CO', 'BTL', 'Type', 'Difficulty', 'Has Diagram', 'Diagram Type', 'Question'];
    const rows = filteredQuestions.map(q => [
      q.id, q.unit, q.marks, q.co, q.btl, q.type, q.difficulty,
      q.hasDiagram ? 'Yes' : 'No',
      q.diagramType || 'N/A',
      `"${q.text.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'question_bank.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="flex gap-4 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 text-blue-700">
          <FileText size={18} />
          <span className="font-medium">{safeQuestions.length} Questions</span>
        </div>
        <div className="flex items-center gap-2 text-purple-700">
          <Image size={18} />
          <span className="font-medium">{diagramCount} Diagram-Based ({safeQuestions.length > 0 ? Math.round(diagramCount / safeQuestions.length * 100) : 0}%)</span>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter size={18} />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <select
            value={filterUnit}
            onChange={(e) => setFilterUnit(e.target.value)}
            className="text-sm border-gray-300 rounded-md border px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Units</option>
            {units.map(u => <option key={u} value={u.toString()}>Unit {u}</option>)}
          </select>

          <select
            value={filterMarks}
            onChange={(e) => setFilterMarks(e.target.value)}
            className="text-sm border-gray-300 rounded-md border px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Marks</option>
            <option value="2">2 Marks</option>
            <option value="12">12 Marks</option>
            <option value="16">16 Marks</option>
          </select>

          <select
            value={filterDiagram}
            onChange={(e) => setFilterDiagram(e.target.value)}
            className="text-sm border-gray-300 rounded-md border px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="All">All Types</option>
            <option value="Diagram">📐 Diagram Only</option>
            <option value="No Diagram">📝 Text Only</option>
          </select>

          <span className="text-sm text-gray-500">
            Showing {filteredQuestions.length} of {safeQuestions.length} questions
          </span>
        </div>

        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-16">Unit</th>
              <th className="px-4 py-3 w-16">Marks</th>
              <th className="px-4 py-3 w-20">CO</th>
              <th className="px-4 py-3 w-20">BTL</th>
              <th className="px-4 py-3">Question Text</th>
              <th className="px-4 py-3 w-28">Type</th>
              <th className="px-4 py-3 w-24">Difficulty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredQuestions.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center font-medium text-gray-600">{q.unit}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${q.marks === 2 ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {q.marks}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{q.co}</td>
                <td className="px-4 py-3 text-gray-600">{q.btl}</td>
                <td className="px-4 py-3 text-gray-800">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{q.text}</span>
                    {q.hasDiagram && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                          <Image size={12} />
                          {q.diagramType || 'Diagram'}
                        </span>
                        {q.diagramDescription && q.diagramDescription !== 'N/A' && (
                          <span className="text-xs text-gray-500 italic">
                            {q.diagramDescription}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500">{q.type}</span>
                    {q.hasDiagram && (
                      <span className="text-xs text-orange-600 font-medium">📐 Diagram</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs border ${q.difficulty === 'Easy' ? 'border-green-200 text-green-700 bg-green-50' :
                    q.difficulty === 'Medium' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                      'border-red-200 text-red-700 bg-red-50'
                    }`}>
                    {q.difficulty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankView;