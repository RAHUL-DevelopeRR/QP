import { Question, QuestionPaperData, FacultySelection } from "../types";
import { SYSTEM_PROMPT } from "../constants";

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export class PerplexityService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.API_KEY || '';
  }

  // Helper to re-initialize if key changes
  updateKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async callPerplexity(prompt: string, jsonMode: boolean = false): Promise<string> {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private extractJSON(text: string): string {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return jsonMatch[1].trim();
    }

    // Try to find array or object directly
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return arrayMatch[0];
    }

    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return objectMatch[0];
    }

    return text;
  }

  private getCIAConstraints(facultySelection: FacultySelection): string {
    const { ciaType, qpType } = facultySelection;

    const unitConstraint = ciaType === 'CIA-I'
      ? 'Unit I and Unit II ONLY. DO NOT include questions from Unit III, IV, or V.'
      : 'Unit III and Unit IV ONLY. DO NOT include questions from Unit I, II, or V.';

    const coConstraint = ciaType === 'CIA-I'
      ? 'CO1 and CO2 ONLY. DO NOT use CO3 or CO4.'
      : 'CO3 and CO4 ONLY. DO NOT use CO1 or CO2.';

    let patternConstraint = '';
    if (qpType === 'QP-I') {
      patternConstraint = `
QP Type I Pattern (Total 60 marks):
- Part A: 6 questions × 2 marks = 12 marks (BTL 2-3)
- Part B: 4 question pairs with OR choice × 12 marks = 48 marks (BTL 3-5)`;
    } else {
      patternConstraint = `
QP Type II Pattern (Total 60 marks):
- Part A: 6 questions × 2 marks = 12 marks (BTL 2-3)
- Part B: 2 question pairs with OR choice × 16 marks = 32 marks (BTL 3-5)
- Part C: 1 question pair with OR choice × 16 marks = 16 marks (BTL 4-5, Application/Analysis)`;
    }

    return `
MANDATORY CONSTRAINTS:
1. Questions MUST be from: ${unitConstraint}
2. Course Outcomes MUST be: ${coConstraint}
3. ${patternConstraint}
`;
  }

  async generateQuestionBank(
    cdap: string,
    syllabus: string,
    template: string,
    facultySelection: FacultySelection
  ): Promise<Question[]> {
    const constraints = this.getCIAConstraints(facultySelection);
    const { ciaType } = facultySelection;
    const units = ciaType === 'CIA-I' ? [1, 2] : [3, 4];
    const cos = ciaType === 'CIA-I' ? ['CO1', 'CO2'] : ['CO3', 'CO4'];

    const prompt = `
      INPUTS:
      
      [CDAP]
      ${cdap}

      [SYLLABUS]
      ${syllabus}

      [TEMPLATE]
      ${template}

      ${constraints}

      TASK:
      Generate a comprehensive Question Bank for ${ciaType}.
      Return ONLY a valid JSON array of objects with NO markdown formatting.
      Generate at least 8 questions for Part A (2 marks) and 6 questions for Part B (12 or 16 marks).
      
      STRICT RULES:
      - Only use Units: ${units.join(', ')}
      - Only use COs: ${cos.join(', ')}
      
      Each question object must have these exact fields:
      {
        "id": "string (unique identifier like Q1, Q2, etc.)",
        "text": "string (the question text)",
        "marks": number (2 for Part A, 12 or 16 for Part B/C),
        "unit": number (${units.join(' or ')} ONLY),
        "topic": "string",
        "subtopic": "string",
        "co": "string (${cos.join(' or ')} ONLY)",
        "btl": "string (BTL1, BTL2, etc.)",
        "difficulty": "Easy" | "Medium" | "Hard",
        "type": "Theory" | "Problem" | "Diagram" | "Numerical"
      }

      Return ONLY the JSON array, no explanation or markdown.
    `;

    try {
      const result = await this.callPerplexity(prompt, true);
      const jsonStr = this.extractJSON(result);
      return JSON.parse(jsonStr) as Question[];
    } catch (error) {
      console.error("Perplexity Bank Generation Error:", error);
      throw error;
    }
  }

  async generateQuestionPaper(
    bank: Question[],
    template: string,
    syllabus: string,
    facultySelection: FacultySelection
  ): Promise<string> {
    const bankJson = JSON.stringify(bank);
    const { ciaType, qpType, courseCode, courseTitle } = facultySelection;
    const ciaLabel = ciaType === 'CIA-I' ? 'CIA-1' : 'CIA-2';

    let partBPattern = '';
    if (qpType === 'QP-I') {
      partBPattern = `
      ============================================================
      PART -B (4X12 MARKS = 48 MARKS)
      ============================================================
      
      Q.NO    Question                                                              CO    BTL   MARKS
      ----    --------                                                              --    ---   -----
      7.a     [Question with full details]                                          ${ciaType === 'CIA-I' ? 'CO1' : 'CO3'}   BTL3   12

                                    (OR)

      7.b     [Alternative question]                                                ${ciaType === 'CIA-I' ? 'CO1' : 'CO3'}   BTL3   12

      8.a     [Question text]                                                       ${ciaType === 'CIA-I' ? 'CO1' : 'CO3'}   BTL3   12

                                    (OR)

      8.b     [Alternative question]                                                ${ciaType === 'CIA-I' ? 'CO1' : 'CO3'}   BTL4   12

      9.a     [Question text]                                                       ${ciaType === 'CIA-I' ? 'CO2' : 'CO4'}   BTL3   12

                                    (OR)

      9.b     [Alternative question]                                                ${ciaType === 'CIA-I' ? 'CO2' : 'CO4'}   BTL4   12

      10.a    [Question text]                                                       ${ciaType === 'CIA-I' ? 'CO2' : 'CO4'}   BTL4   12

                                    (OR)

      10.b    [Alternative question]                                                ${ciaType === 'CIA-I' ? 'CO2' : 'CO4'}   BTL3   12`;
    } else {
      partBPattern = `
      ============================================================
      PART -B (2X16 MARKS = 32 MARKS)
      ============================================================
      
      Q.NO    Question                                                              CO    BTL   MARKS
      ----    --------                                                              --    ---   -----
      7.a     [Question with full details]                                          ${ciaType === 'CIA-I' ? 'CO1' : 'CO3'}   BTL3   16

                                    (OR)

      7.b     [Alternative question]                                                ${ciaType === 'CIA-I' ? 'CO1' : 'CO3'}   BTL4   16

      8.a     [Question text]                                                       ${ciaType === 'CIA-I' ? 'CO2' : 'CO4'}   BTL4   16

                                    (OR)

      8.b     [Alternative question]                                                ${ciaType === 'CIA-I' ? 'CO2' : 'CO4'}   BTL3   16

      ============================================================
      PART -C (1X16 MARKS = 16 MARKS)
      ============================================================
      
      Q.NO    Question                                                              CO    BTL   MARKS
      ----    --------                                                              --    ---   -----
      9.a     [Application/Analysis question]                                       ${ciaType === 'CIA-I' ? 'CO1' : 'CO3'}   BTL4   16

                                    (OR)

      9.b     [Alternative application question]                                    ${ciaType === 'CIA-I' ? 'CO2' : 'CO4'}   BTL5   16`;
    }

    const prompt = `
      TASK:
      Generate a final formatted Question Paper based on the Question Bank provided below.
      
      [TEMPLATE RULES]
      ${template}

      [QUESTION BANK]
      ${bankJson}

      [REQUIRED FORMAT - FOLLOW THIS EXACTLY]
      Generate the question paper with COMPLETE HEADER and body in the following exact format:

      ================================================================================
                              M.Kumarasamy College of Engineering
                              NAAC Accredited Autonomous Institution
                              Approved by AICTE & Affiliated to Anna University
                              ISO 9001:2015 Certified Institution
                              Thalavapalayam, Karur - 639 113, TAMILNADU
      ================================================================================
      
                                          ${ciaLabel}
      
      REG No: |___|___|___|___|___|___|___|___|___|___|___|___|

      +------------------+--------------------------------+-------------------+------------------+
      | DEPARTMENT       | [From syllabus/template]       | SEMESTER          | [e.g. IV]        |
      +------------------+--------------------------------+-------------------+------------------+
      | SECTION          | [e.g. A]                       | DATE & SESSION    | [YYYY-MM-DD (FN)]|
      +------------------+--------------------------------+-------------------+------------------+
      | DURATION         | [e.g. 120 Minutes]             | MAX MARKS         | 60               |
      +------------------+--------------------------------+-------------------+------------------+
      | COURSE CODE      | ${courseCode}                                                         |
      | & NAME           | ${courseTitle}                                                        |
      +------------------+--------------------------------+-------------------+------------------+

      ============================================================
      PART -A (6X2 MARKS = 12 MARKS)
      ============================================================
      
      Q.NO    Question                                                              CO    BTL   MARKS
      ----    --------                                                              --    ---   -----
      1.      [Question text here]                                                  ${ciaType === 'CIA-I' ? 'CO1' : 'CO3'}   BTL2    2
      2.      [Question text here]                                                  ${ciaType === 'CIA-I' ? 'CO1' : 'CO3'}   BTL2    2
      3.      [Question text here]                                                  ${ciaType === 'CIA-I' ? 'CO1' : 'CO3'}   BTL2    2
      4.      [Question text here]                                                  ${ciaType === 'CIA-I' ? 'CO2' : 'CO4'}   BTL3    2
      5.      [Question text here]                                                  ${ciaType === 'CIA-I' ? 'CO2' : 'CO4'}   BTL2    2
      6.      [Question text here]                                                  ${ciaType === 'CIA-I' ? 'CO2' : 'CO4'}   BTL2    2

      ${partBPattern}

      [CRITICAL RULES]
      1. Include the complete header with college name and metadata table
      2. PART-A: 6 questions × 2 marks = 12 marks
      3. ${qpType === 'QP-I' ? 'PART-B: 4 question pairs with (OR) × 12 marks = 48 marks' : 'PART-B: 2 question pairs × 16 marks = 32 marks, PART-C: 1 question pair × 16 marks = 16 marks'}
      4. Total: 60 marks
      5. USE ONLY ${ciaType === 'CIA-I' ? 'CO1 and CO2' : 'CO3 and CO4'}
      6. Output ONLY the formatted paper, no JSON
    `;

    try {
      const result = await this.callPerplexity(prompt, false);
      return result;
    } catch (error) {
      console.error("Perplexity Paper Generation Error:", error);
      throw error;
    }
  }

  async generateQuestionPaperData(
    bank: Question[],
    template: string,
    syllabus: string,
    facultySelection: FacultySelection
  ): Promise<QuestionPaperData> {
    const bankJson = JSON.stringify(bank);
    const { ciaType, qpType, courseCode, courseTitle } = facultySelection;
    const cos = ciaType === 'CIA-I' ? ['CO1', 'CO2'] : ['CO3', 'CO4'];

    let structureDescription = '';
    if (qpType === 'QP-I') {
      structureDescription = `
      "partBQuestions": [
        {"qno": "7.(a)", "question": "...", "co": "${cos[0]}", "btl": "BTL3", "marks": "12"},
        {"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""},
        {"qno": "7.(b)", "question": "...", "co": "${cos[0]}", "btl": "BTL3", "marks": "12"},
        {"qno": "8.(a)", "question": "...", "co": "${cos[0]}", "btl": "BTL3", "marks": "12"},
        {"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""},
        {"qno": "8.(b)", "question": "...", "co": "${cos[0]}", "btl": "BTL4", "marks": "12"},
        {"qno": "9.(a)", "question": "...", "co": "${cos[1]}", "btl": "BTL3", "marks": "12"},
        {"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""},
        {"qno": "9.(b)", "question": "...", "co": "${cos[1]}", "btl": "BTL4", "marks": "12"},
        {"qno": "10.(a)", "question": "...", "co": "${cos[1]}", "btl": "BTL3", "marks": "12"},
        {"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""},
        {"qno": "10.(b)", "question": "...", "co": "${cos[1]}", "btl": "BTL3", "marks": "12"}
      ]`;
    } else {
      structureDescription = `
      "partBQuestions": [
        {"qno": "7.(a)", "question": "...", "co": "${cos[0]}", "btl": "BTL3", "marks": "16"},
        {"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""},
        {"qno": "7.(b)", "question": "...", "co": "${cos[0]}", "btl": "BTL4", "marks": "16"},
        {"qno": "8.(a)", "question": "...", "co": "${cos[1]}", "btl": "BTL4", "marks": "16"},
        {"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""},
        {"qno": "8.(b)", "question": "...", "co": "${cos[1]}", "btl": "BTL3", "marks": "16"}
      ],
      "partCQuestions": [
        {"qno": "9.(a)", "question": "...", "co": "${cos[0]}", "btl": "BTL4", "marks": "16"},
        {"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""},
        {"qno": "9.(b)", "question": "...", "co": "${cos[1]}", "btl": "BTL5", "marks": "16"}
      ]`;
    }

    const prompt = `
      TASK:
      Generate structured question paper data as JSON for Word document generation.
      
      [TEMPLATE RULES]
      ${template}

      [SYLLABUS]
      ${syllabus}

      [QUESTION BANK]
      ${bankJson}

      [INSTRUCTIONS]
      1. Use course code: ${courseCode}, course name: ${courseTitle}
      2. CIA Type: ${ciaType}, QP Type: ${qpType}
      3. ONLY use COs: ${cos.join(', ')}
      4. Select 6 questions for Part A (2 marks each) from the question bank
      5. ${qpType === 'QP-I'
        ? 'Select 8 questions for Part B (4 pairs with OR alternatives, 12 marks each)'
        : 'Select 4 questions for Part B (2 pairs with OR alternatives, 16 marks each) and 2 questions for Part C (1 pair with OR, 16 marks each)'}
      6. Return ONLY valid JSON with NO markdown formatting
      7. IMPORTANT: For OR rows, use {"qno": "(OR)", "question": "(OR)", "co": "", "btl": "", "marks": ""}
      8. Question numbers MUST use format: 7.(a), 7.(b), 8.(a), 8.(b), etc.

      Return a JSON object with this EXACT structure:
      {
        "department": "CSE",
        "section": "A",
        "semester": "IV",
        "dateSession": "2025-02-27 (FN)",
        "courseCode": "${courseCode}",
        "courseName": "${courseTitle}",
        "ciaType": "${ciaType}",
        "qpType": "${qpType}",
        "partAQuestions": [
          {"qno": "1.", "question": "...", "co": "${cos[0]}", "btl": "BTL2", "marks": "2"},
          {"qno": "2.", "question": "...", "co": "${cos[0]}", "btl": "BTL2", "marks": "2"},
          {"qno": "3.", "question": "...", "co": "${cos[0]}", "btl": "BTL2", "marks": "2"},
          {"qno": "4.", "question": "...", "co": "${cos[1]}", "btl": "BTL2", "marks": "2"},
          {"qno": "5.", "question": "...", "co": "${cos[1]}", "btl": "BTL2", "marks": "2"},
          {"qno": "6.", "question": "...", "co": "${cos[1]}", "btl": "BTL2", "marks": "2"}
        ],
        ${structureDescription}
      }

      Return ONLY the JSON object, no explanation or markdown.
    `;

    try {
      const result = await this.callPerplexity(prompt, true);
      const jsonStr = this.extractJSON(result);
      return JSON.parse(jsonStr) as QuestionPaperData;
    } catch (error) {
      console.error("Perplexity Paper Data Generation Error:", error);
      throw error;
    }
  }
}

// Export as geminiService for backward compatibility with App.tsx
export const geminiService = new PerplexityService();
