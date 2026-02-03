import { Question, QuestionPaperData, FacultySelection } from "../types";

/**
 * PerplexityService - Frontend service that calls Flask backend
 * NO API KEYS stored or used in frontend (secure architecture)
 */
export class PerplexityService {
  /**
   * Generate question bank by calling Flask backend
   * Backend securely handles Perplexity API call
   */
  async generateQuestionBank(
    cdap: string,
    syllabus: string,
    template: string,
    facultySelection: FacultySelection
  ): Promise<Question[]> {
    const response = await fetch('/api/generate-bank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cdap, syllabus, template, facultySelection })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.questions as Question[];
  }

  /**
   * Generate formatted question paper text
   */
  async generateQuestionPaper(
    bank: Question[],
    template: string,
    syllabus: string,
    facultySelection: FacultySelection
  ): Promise<string> {
    const response = await fetch('/api/generate-paper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bank, template, syllabus, facultySelection })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.paper;
  }

  /**
   * Generate structured question paper data for Word document
   */
  async generateQuestionPaperData(
    bank: Question[],
    template: string,
    syllabus: string,
    facultySelection: FacultySelection
  ): Promise<QuestionPaperData> {
    const response = await fetch('/api/generate-paper-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bank, template, syllabus, facultySelection })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.paperData as QuestionPaperData;
  }
}

// Export singleton instance
export const geminiService = new PerplexityService();
