export interface Question {
  id: string;
  text: string;
  marks: number;
  unit: number;
  topic: string;
  subtopic: string;
  co: string;
  btl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'Theory' | 'Problem' | 'Diagram' | 'Numerical';
}

export interface QuestionBankData {
  questions: Question[];
}

export interface AppState {
  cdap: string;
  syllabus: string;
  template: string;
  questionBank: Question[] | null;
  questionPaper: string | null;
  isGenerating: boolean;
  activeTab: 'input' | 'bank' | 'paper';
  apiKey: string | null;
}

export type BloomLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
