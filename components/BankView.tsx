import React, { useMemo, useState } from 'react';
import { Question } from '../types';
import { Filter, Download } from 'lucide-react';

interface BankViewProps {
  questions: Question[];
}

const BankView: React.FC<BankViewProps> = ({ questions }) => {
  const [filterUnit, setFilterUnit] = useState<string>('All');
  const [filterMarks, setFilterMarks] = useState<string>('All');

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const unitMatch = filterUnit === 'All' || q.unit.toString() === filterUnit;
      const marksMatch = filterMarks === 'All' || q.marks.toString() === filterMarks;
      return unitMatch && marksMatch;
    });
  }, [questions, filterUnit, filterMarks]);

  // Fix: Ensure sort arguments are treated as numbers to avoid TS errors
  const units = Array.from(new Set(questions.map(q => q.unit))).sort((a, b) => Number(a) - Number(b));

  const downloadCSV = () => {
    // Simple CSV export
    const headers = ['ID', 'Unit', 'Marks', 'CO', 'BTL', 'Type', 'Difficulty', 'Question'];
    const rows = filteredQuestions.map(q => [
      q.id, q.unit, q.marks, q.co, q.btl, q.type, q.difficulty, `"${q.text.replace(/"/g, '""')}"`
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
            <option value="16">16 Marks</option>
          </select>

          <span className="text-sm text-gray-500">
            Showing {filteredQuestions.length} of {questions.length} questions
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
              <th className="px-4 py-3 w-24">Type</th>
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
                <td className="px-4 py-3 text-gray-800 font-medium">{q.text}</td>
                <td className="px-4 py-3 text-gray-500">{q.type}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs border ${
                    q.difficulty === 'Easy' ? 'border-green-200 text-green-700 bg-green-50' :
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