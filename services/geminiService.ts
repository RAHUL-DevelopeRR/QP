import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // In a real app, this would be validated better.
    // Assuming process.env.API_KEY is available or handled via the hook in App.tsx
    const apiKey = process.env.API_KEY || '';
    this.ai = new GoogleGenAI({ apiKey });
  }

  // Helper to re-initialize if key changes
  updateKey(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateQuestionBank(cdap: string, syllabus: string, template: string): Promise<Question[]> {
    const prompt = `
      ${SYSTEM_PROMPT}

      INPUTS:
      
      [CDAP]
      ${cdap}

      [SYLLABUS]
      ${syllabus}

      [TEMPLATE]
      ${template}

      TASK:
      Generate a comprehensive Question Bank covering all units.
      Return strictly a JSON array of objects.
      Generate at least 5 questions for Part A (2 marks) and 4 questions for Part B (16 marks) PER UNIT.
    `;

    // Define the schema using the enum from @google/genai
    const questionSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        text: { type: Type.STRING },
        marks: { type: Type.NUMBER },
        unit: { type: Type.NUMBER },
        topic: { type: Type.STRING },
        subtopic: { type: Type.STRING },
        co: { type: Type.STRING },
        btl: { type: Type.STRING },
        difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
        type: { type: Type.STRING, enum: ['Theory', 'Problem', 'Diagram', 'Numerical'] },
      },
      required: ['id', 'text', 'marks', 'unit', 'topic', 'subtopic', 'co', 'btl', 'difficulty', 'type'],
    };

    const responseSchema: Schema = {
        type: Type.ARRAY,
        items: questionSchema
    };

    try {
      const result = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.4,
        }
      });

      const text = result.text;
      if (!text) return [];
      
      return JSON.parse(text) as Question[];
    } catch (error) {
      console.error("Gemini Bank Generation Error:", error);
      throw error;
    }
  }

  async generateQuestionPaper(bank: Question[], template: string, syllabus: string): Promise<string> {
    const bankJson = JSON.stringify(bank);
    const prompt = `
      ${SYSTEM_PROMPT}

      TASK:
      Generate a final formatted Question Paper based on the Question Bank provided below.
      
      [TEMPLATE RULES]
      ${template}

      [QUESTION BANK]
      ${bankJson}

      [INSTRUCTIONS]
      1. Select specific questions from the bank to create a balanced paper.
      2. Follow the "PART A" and "PART B" structure exactly as defined in the template.
      3. Ensure unit coverage is balanced as per the template instructions.
      4. Output the result in clean Markdown format. 
      5. Include a header with "Department of Computer Science", "Semester End Examination", etc.
      6. Do not include JSON or metadata in the final output, just the paper text.
    `;

    try {
      const result = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.5,
        }
      });

      return result.text || "Failed to generate paper.";
    } catch (error) {
      console.error("Gemini Paper Generation Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
