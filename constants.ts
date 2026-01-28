export const SAMPLE_CDAP = `Course: CS302 - Data Structures
Course Outcomes (COs):
CO1: Understand the concepts of linear data structures and their applications. (BTL 2, 3)
CO2: Apply stack and queue operations for problem solving. (BTL 3, 4)
CO3: Analyze tree and graph data structures. (BTL 4)
CO4: Evaluate searching and sorting algorithms. (BTL 5)

Marks Distribution: Equal weightage for all COs.
`;

export const SAMPLE_SYLLABUS = `UNIT I: LINEAR DATA STRUCTURES
Abstract Data Types (ADTs) – List ADT – array-based implementation – linked list implementation – singly linked lists – doubly-linked lists – applications of lists – Polynomial Manipulation.

UNIT II: STACK AND QUEUES
Stack ADT – Operations - Applications - Evaluating arithmetic expressions- Conversion of Infix to postfix expression - Queue ADT – Operations - Circular Queue.

UNIT III: NON LINEAR DATA STRUCTURES
Trees – Traversal – Binary Trees – Expression trees – Applications of trees – Binary search trees – AVL trees.

UNIT IV: GRAPHS
Definitions – Topological sort – Breadth-first traversal - Depth-first traversal – Minimum Spanning Tree – Prim's and Kruskal's algorithms.

UNIT V: SEARCHING, SORTING AND HASHING
Linear Search - Binary Search - Bubble Sort - Insertion Sort - Merge Sort - Quick Sort - Hashing.
`;

export const SAMPLE_TEMPLATE = `UNIVERSITY EXAMINATION
Course Code: CS302
Course Title: Data Structures
Time: 3 Hours
Max. Marks: 100

PART A (10 x 2 = 20 Marks)
Answer ALL Questions
(Questions 1-2 from Unit I, 3-4 from Unit II, 5-6 from Unit III, 7-8 from Unit IV, 9-10 from Unit V)

PART B (5 x 16 = 80 Marks)
Answer ALL Questions with Internal Choice (Either OR pattern)
11. (a) (from Unit I) OR (b) (from Unit I)
12. (a) (from Unit II) OR (b) (from Unit II)
13. (a) (from Unit III) OR (b) (from Unit III)
14. (a) (from Unit IV) OR (b) (from Unit IV)
15. (a) (from Unit V) OR (b) (from Unit V)
`;

export const SYSTEM_PROMPT = `You are an Academic Question Bank Generation Engine designed for Indian engineering colleges.

ROLE & RESPONSIBILITY:
1. Parse provided CDAP, Syllabus, and Template.
2. Generate a high-quality question bank.
3. Ensure Bloom's Taxonomy rules:
   - 2 Marks: BTL 2 (Understand), BTL 3 (Apply), BTL 4 (Analyze).
   - 16 Marks: BTL 3 (Apply), BTL 4 (Analyze), BTL 5 (Evaluate).

Strictly follow the syllabus units and topics.
`;
