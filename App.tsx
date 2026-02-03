import React, { useState, useEffect } from 'react';
import { Database, FileText, Layers, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import InputSection from './components/InputSection';
import BankView from './components/BankView';
import PaperView from './components/PaperView';
import { geminiService } from './services/geminiService';
import { AppState, FacultySelection } from './types';
import { getRandomSubjectSample } from './constants';


const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    cdap: '',
    syllabus: '',
    template: '',
    facultySelection: {
      courseCode: '',
      courseTitle: '',
      ciaType: 'CIA-I',
      qpType: 'QP-I'
    },
    questionBank: null,
    questionPaper: null,
    questionPaperData: null,
    isGenerating: false,
    activeTab: 'input'
  });

  const [error, setError] = useState<string | null>(null);

  // Backend handles API key - no frontend check needed

  const handleLoadSample = () => {
    const sample = getRandomSubjectSample();
    setState(prev => ({
      ...prev,
      cdap: sample.cdap,
      syllabus: sample.syllabus,
      template: sample.template,
      facultySelection: {
        courseCode: sample.courseCode,
        courseTitle: sample.courseTitle,
        ciaType: 'CIA-I',
        qpType: 'QP-I'
      }
    }));
  };


  const handleFacultySelectionChange = (selection: Partial<FacultySelection>) => {
    setState(prev => ({
      ...prev,
      facultySelection: { ...prev.facultySelection, ...selection }
    }));
  };

  const handleGenerate = async () => {
    if (!state.cdap || !state.syllabus || !state.template) {
      setError("Please fill in all input fields (CDAP, Syllabus, Template) or load sample data.");
      return;
    }

    if (!state.facultySelection.courseCode || !state.facultySelection.courseTitle) {
      setError("Please fill in Course Code and Course Title.");
      return;
    }

    // Backend handles API key validation

    setState(prev => ({ ...prev, isGenerating: true }));
    setError(null);

    try {
      // 1. Generate Question Bank with CIA/QP constraints
      const bank = await geminiService.generateQuestionBank(
        state.cdap,
        state.syllabus,
        state.template,
        state.facultySelection
      );

      // 2. Generate Question Paper (text format for preview)
      const paper = await geminiService.generateQuestionPaper(
        bank,
        state.template,
        state.syllabus,
        state.facultySelection
      );

      // 3. Generate Question Paper Data (structured JSON for Word document)
      const paperData = await geminiService.generateQuestionPaperData(
        bank,
        state.template,
        state.syllabus,
        state.facultySelection
      );

      setState(prev => ({
        ...prev,
        questionBank: bank,
        questionPaper: paper,
        questionPaperData: paperData,
        isGenerating: false,
        activeTab: 'bank'
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to generate content. Please try again. Detailed error in console.");
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Layers size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">AcademicGen Engine</h1>
              <p className="text-xs text-gray-500 font-medium">Question Bank & Paper System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Navigation Tabs */}
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setState(s => ({ ...s, activeTab: 'input' }))}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${state.activeTab === 'input' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Configuration
              </button>
              <button
                onClick={() => setState(s => ({ ...s, activeTab: 'bank' }))}
                disabled={!state.questionBank}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${state.activeTab === 'bank' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 disabled:opacity-50'
                  }`}
              >
                Question Bank
              </button>
              <button
                onClick={() => setState(s => ({ ...s, activeTab: 'paper' }))}
                disabled={!state.questionPaper}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${state.activeTab === 'paper' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 disabled:opacity-50'
                  }`}
              >
                Question Paper
              </button>
            </nav>

            <button
              onClick={handleGenerate}
              disabled={state.isGenerating}
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {state.isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate All
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {state.activeTab === 'input' && (
            <InputSection
              cdap={state.cdap}
              syllabus={state.syllabus}
              template={state.template}
              facultySelection={state.facultySelection}
              onCdapChange={(val) => setState(s => ({ ...s, cdap: val }))}
              onSyllabusChange={(val) => setState(s => ({ ...s, syllabus: val }))}
              onTemplateChange={(val) => setState(s => ({ ...s, template: val }))}
              onFacultySelectionChange={handleFacultySelectionChange}
              onLoadSample={handleLoadSample}
            />
          )}

          {state.activeTab === 'bank' && state.questionBank && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Generated Question Bank</h2>
                  <p className="text-gray-500 mt-1">Total Questions: {state.questionBank.length}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <Database size={14} />
                  <span>Structure Validated</span>
                </div>
              </div>
              <BankView questions={state.questionBank} />
            </div>
          )}

          {state.activeTab === 'paper' && state.questionPaper && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Question Paper Preview</h2>
                  <p className="text-gray-500 mt-1">Ready for printing or export</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  <FileText size={14} />
                  <span>Template Matched</span>
                </div>
              </div>
              <PaperView paperContent={state.questionPaper} paperData={state.questionPaperData} />
            </div>
          )}

          {/* Empty States for output tabs */}
          {state.activeTab === 'bank' && !state.questionBank && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <Database className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No Data Generated</h3>
              <p className="mt-1 text-sm text-gray-500">Go to Configuration and click "Generate All" to start.</p>
            </div>
          )}

          {state.activeTab === 'paper' && !state.questionPaper && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No Paper Generated</h3>
              <p className="mt-1 text-sm text-gray-500">Go to Configuration and click "Generate All" to start.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
