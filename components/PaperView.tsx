import React, { useState } from 'react';
import { Printer, Download, Loader2, AlertCircle } from 'lucide-react';
import { QuestionPaperData } from '../types';

interface PaperViewProps {
  paperContent: string;
  paperData?: QuestionPaperData | null;
}

const PaperView: React.FC<PaperViewProps> = ({ paperContent, paperData }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownloadWord = async () => {
    if (!paperData) {
      setDownloadError("No paper data available for Word export");
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);

    try {
      const response = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paperData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${paperData.ciaType || 'CIA'}_Question_Paper.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(
        error instanceof Error
          ? error.message
          : 'Failed to download. Make sure the Python server is running (python server.py)'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Render WYSIWYG preview matching CIA_ACTUAL_FORMAT.docx exactly
  const renderFormattedPreview = () => {
    if (!paperData) {
      return (
        <article className="prose max-w-none paper-font text-black whitespace-pre-wrap">
          {paperContent}
        </article>
      );
    }

    const ciaLabel = paperData.ciaType === 'CIA-I' ? 'CIA-1' : 'CIA-2';
    const isQPTypeII = paperData.qpType === 'QP-II';
    const partBMarks = isQPTypeII ? 16 : 12;
    const partBCount = isQPTypeII ? 2 : 4;
    const partBTotal = partBCount * partBMarks;

    return (
      <div className="paper-preview font-serif text-black bg-white" style={{ position: 'relative', paddingTop: '140px' }}>
        {/* ===== FLOATING PAGE-ANCHORED LOGOS (Equal top alignment) ===== */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '0',
          width: '100%',
          height: '130px',
          pointerEvents: 'none'
        }}>
          {/* LEFT: College Logo (BIGGER - 165px) */}
          <img
            src="/Kumarasamy.jpg"
            alt="M.Kumarasamy College"
            style={{
              position: 'absolute',
              left: '0',
              top: '0',  // SAME TOP
              width: '165px',
              height: 'auto',
              zIndex: 10
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />

          {/* RIGHT: KR Group Logo (SMALLER - 80px) */}
          <img
            src="/krl.jpg"
            alt="KR Group"
            style={{
              position: 'absolute',
              right: '0',
              top: '0',  // SAME TOP AS LEFT
              width: '80px',
              height: 'auto',
              zIndex: 10
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div style="position: absolute; right: 0; top: 0; text-align: right;">
                    <div style="font-size: 36px; font-weight: bold; color: #cc0000;">KR</div>
                    <div style="font-size: 14px; color: #cc0000; letter-spacing: 3px;">Group</div>
                  </div>
                `;
              }
            }}
          />
        </div>

        {/* ===== CIA HEADING ===== */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '16px 0'
        }}>
          {ciaLabel}
        </h2>

        {/* ===== REG NO TABLE (CENTERED) ===== */}
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{
                  border: '1px solid black',
                  padding: '3px 6px',
                  fontWeight: 'bold',
                  fontSize: '9px',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  lineHeight: '1.1'
                }}>
                  REG<br />No
                </td>
                {Array.from({ length: 12 }).map((_, i) => (
                  <td
                    key={i}
                    style={{
                      border: '1px solid black',
                      width: '22px',
                      height: '22px'
                    }}
                  ></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ===== INFO TABLE (CENTERED) ===== */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '12px',
          fontSize: '11px'
        }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', padding: '3px 6px', fontWeight: 'bold', textAlign: 'center', width: '25%' }}>DEPARTMENT</td>
              <td style={{ border: '1px solid black', padding: '3px 6px', textAlign: 'center', width: '25%' }}>{paperData.department || 'CSE'}</td>
              <td style={{ border: '1px solid black', padding: '3px 6px', fontWeight: 'bold', textAlign: 'center', width: '25%' }}>SEMESTER</td>
              <td style={{ border: '1px solid black', padding: '3px 6px', textAlign: 'center', width: '25%' }}>{paperData.semester || 'IV'}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '3px 6px', fontWeight: 'bold', textAlign: 'center' }}>SECTION</td>
              <td style={{ border: '1px solid black', padding: '3px 6px', textAlign: 'center' }}>{paperData.section || 'A'}</td>
              <td style={{ border: '1px solid black', padding: '3px 6px', fontWeight: 'bold', textAlign: 'center' }}>DATE & SESSION</td>
              <td style={{ border: '1px solid black', padding: '3px 6px', textAlign: 'center' }}>{paperData.dateSession || '2025-02-27 (FN)'}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '3px 6px', fontWeight: 'bold', textAlign: 'center' }}>DURATION</td>
              <td style={{ border: '1px solid black', padding: '3px 6px', textAlign: 'center' }}>120 Minutes</td>
              <td style={{ border: '1px solid black', padding: '3px 6px', fontWeight: 'bold', textAlign: 'center' }}>MAX MARKS</td>
              <td style={{ border: '1px solid black', padding: '3px 6px', textAlign: 'center' }}>60</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '3px 6px', fontWeight: 'bold', textAlign: 'center' }}>COURSE CODE & NAME</td>
              <td colSpan={3} style={{ border: '1px solid black', padding: '3px 6px', textAlign: 'center' }}>
                {paperData.courseCode}-{paperData.courseName}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ===== PART A ===== */}
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px' }}>
            PART - A (6 X 2 MARKS = 12 MARKS)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center', width: '7%' }}>Q.NO</th>
                <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center' }}>Questions</th>
                <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center', width: '6%' }}>CO</th>
                <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center', width: '7%' }}>BTL</th>
                <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center', width: '9%' }}>MARKS</th>
              </tr>
            </thead>
            <tbody>
              {paperData.partAQuestions?.map((q, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{q.qno}</td>
                  <td style={{ border: '1px solid black', padding: '3px', textAlign: 'left' }}>{q.question}</td>
                  <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{q.co}</td>
                  <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{q.btl}</td>
                  <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{q.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== PART B ===== */}
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px' }}>
            PART - B ({partBCount} X {partBMarks} MARKS = {partBTotal} MARKS)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center', width: '7%' }}>Q.NO</th>
                <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center' }}>Questions</th>
                <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center', width: '6%' }}>CO</th>
                <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center', width: '7%' }}>BTL</th>
                <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center', width: '9%' }}>MARKS</th>
              </tr>
            </thead>
            <tbody>
              {paperData.partBQuestions?.map((q, idx) => {
                const isOrRow = q.qno === '(OR)' || q.question === '(OR)';
                return (
                  <tr key={idx}>
                    <td style={{
                      border: '1px solid black',
                      padding: '3px',
                      textAlign: 'center',
                      fontWeight: isOrRow ? 'bold' : 'normal'
                    }}>{q.qno}</td>
                    <td style={{
                      border: '1px solid black',
                      padding: '3px',
                      textAlign: isOrRow ? 'center' : 'left',
                      fontWeight: isOrRow ? 'bold' : 'normal'
                    }}>{q.question}</td>
                    <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{q.co}</td>
                    <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{q.btl}</td>
                    <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{q.marks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ===== PART C (QP-II only) ===== */}
        {isQPTypeII && paperData.partCQuestions && paperData.partCQuestions.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px' }}>
              PART - C (1 X 16 MARKS = 16 MARKS)
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center', width: '7%' }}>Q.NO</th>
                  <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center' }}>Questions</th>
                  <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center', width: '6%' }}>CO</th>
                  <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center', width: '7%' }}>BTL</th>
                  <th style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold', textAlign: 'center', width: '9%' }}>MARKS</th>
                </tr>
              </thead>
              <tbody>
                {paperData.partCQuestions.map((q, idx) => {
                  const isOrRow = q.qno === '(OR)' || q.question === '(OR)';
                  return (
                    <tr key={idx}>
                      <td style={{
                        border: '1px solid black',
                        padding: '3px',
                        textAlign: 'center',
                        fontWeight: isOrRow ? 'bold' : 'normal'
                      }}>{q.qno}</td>
                      <td style={{
                        border: '1px solid black',
                        padding: '3px',
                        textAlign: isOrRow ? 'center' : 'left',
                        fontWeight: isOrRow ? 'bold' : 'normal'
                      }}>{q.question}</td>
                      <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{q.co}</td>
                      <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{q.btl}</td>
                      <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{q.marks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end gap-3 mb-4">
        {downloadError && (
          <div className="flex-1 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200 flex items-center gap-2">
            <AlertCircle size={16} />
            <div>
              <span>{downloadError}</span>
              <p className="text-xs text-red-500 mt-1">
                Run: <code className="bg-red-100 px-1 rounded">python server.py</code>
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleDownloadWord}
          disabled={isDownloading || !paperData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed print:hidden"
        >
          {isDownloading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download size={18} />
              Download Word
            </>
          )}
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors print:hidden"
        >
          <Printer size={18} />
          Print Paper
        </button>
      </div>

      <div className="flex-1 bg-white p-6 shadow-md rounded-lg overflow-auto border border-gray-200 max-w-4xl mx-auto w-full print:shadow-none print:border-none print:p-0 print:w-full print:max-w-none">
        {renderFormattedPreview()}
      </div>

      <style>{`
        .paper-preview {
          font-family: 'Times New Roman', Times, serif;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .paper-preview, .paper-preview * {
            visibility: visible;
          }
          .paper-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaperView;
