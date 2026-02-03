// CIA Type: CIA-I (Units I, II with CO1, CO2) or CIA-II (Units III, IV with CO3, CO4)
export type CIAType = 'CIA-I' | 'CIA-II';

// QP Type: QP-I (2 parts) or QP-II (3 parts)
export type QPType = 'QP-I' | 'QP-II';

// Faculty selection parameters for question paper generation
export interface FacultySelection {
  courseCode: string;
  courseTitle: string;
  ciaType: CIAType;
  qpType: QPType;
}

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

// Structured question item for Word document generation
export interface QuestionItem {
  qno: string;
  question: string;
  co: string;
  btl: string;
  marks: string;
}

// Structured question paper data for Word document generation
export interface QuestionPaperData {
  department: string;
  section: string;
  semester: string;
  dateSession: string;
  courseCode: string;
  courseName: string;
  ciaType: CIAType;
  qpType: QPType;
  partAQuestions: QuestionItem[];
  partBQuestions: QuestionItem[];
  partCQuestions?: QuestionItem[]; // Only for QP Type II
}

export interface AppState {
  cdap: string;
  syllabus: string;
  template: string;
  facultySelection: FacultySelection;
  questionBank: Question[] | null;
  questionPaper: string | null;
  questionPaperData: QuestionPaperData | null;
  isGenerating: boolean;
  activeTab: 'input' | 'bank' | 'paper';
}


export type BloomLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
