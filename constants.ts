// Subject Sample Data Interface
export interface SubjectSample {
   courseCode: string;
   courseTitle: string;
   cdap: string;
   syllabus: string;
   template: string;
}

// ========================
// OBJECT-ORIENTED PROGRAMMING (OOPS)
// ========================
export const OOPS_SAMPLE: SubjectSample = {
   courseCode: 'CS201',
   courseTitle: 'Object-Oriented Programming',
   cdap: `Course: CS201 - Object-Oriented Programming
Course Outcomes (COs):
CO1: Understand the principles of object-oriented programming and class design. (BTL 2, 3)
CO2: Apply inheritance, polymorphism, and encapsulation concepts. (BTL 3, 4)
CO3: Analyze design patterns and their implementations. (BTL 4)
CO4: Evaluate exception handling and file I/O mechanisms. (BTL 5)

Marks Distribution: Equal weightage for all COs.
`,
   syllabus: `UNIT I: INTRODUCTION TO OOP
Object-Oriented Programming paradigm – Classes and Objects – Constructors and Destructors – Static members – Friend functions – Inline functions.
Example Questions:
- Draw the UML class diagram for a Bank Account system with classes Account, SavingsAccount, and CurrentAccount.
- Illustrate the memory allocation diagram showing how objects are stored in heap and stack.

UNIT II: INHERITANCE AND POLYMORPHISM
Types of Inheritance – Single, Multiple, Multilevel, Hierarchical, Hybrid – Virtual base classes – Polymorphism – Function overloading – Operator overloading – Virtual functions – Abstract classes.
Example Questions:
- Draw the inheritance hierarchy diagram for a Vehicle management system showing Car, Bike, and Truck derived from Vehicle.
- Create a UML sequence diagram showing dynamic method dispatch in runtime polymorphism.

UNIT III: TEMPLATES AND EXCEPTION HANDLING
Function templates – Class templates – Template specialization – Exception handling mechanism – try, catch, throw – User-defined exceptions – Standard exceptions.
Example Questions:
- Illustrate with a flowchart how exception propagation works through the call stack.
- Draw a diagram showing the template instantiation process for a generic Stack class.

UNIT IV: FILE HANDLING AND STL
File streams – Sequential file processing – Random access files – STL containers – Vectors, Lists, Maps – Iterators – Algorithms.
Example Questions:
- Draw a diagram showing the relationship between ifstream, ofstream, and fstream classes.
- Illustrate the internal structure of a vector showing capacity vs size with diagram.
`,
   template: `UNIVERSITY EXAMINATION
Course Code: CS201
Course Title: Object-Oriented Programming
Time: 3 Hours
Max. Marks: 100

PART A (10 x 2 = 20 Marks)
Answer ALL Questions
(Questions 1-2 from Unit I, 3-4 from Unit II, 5-6 from Unit III, 7-8 from Unit IV)
Note: Include questions requiring small diagrams like class representation, memory layout.

PART B (5 x 16 = 80 Marks)
Answer ALL Questions with Internal Choice (Either OR pattern)
11. (a) Draw complete UML class diagram for [scenario] OR (b) Implement and illustrate [concept]
12. (a) Design inheritance hierarchy with diagram OR (b) Solve polymorphism problem
13. (a) Illustrate exception handling flow OR (b) Template implementation with diagram
14. (a) File handling problem with flowchart OR (b) STL container diagram and implementation
`
};

// ========================
// DATABASE MANAGEMENT SYSTEMS (DBMS)
// ========================
export const DBMS_SAMPLE: SubjectSample = {
   courseCode: 'CS301',
   courseTitle: 'Database Management Systems',
   cdap: `Course: CS301 - Database Management Systems
Course Outcomes (COs):
CO1: Understand database concepts, ER modeling, and relational algebra. (BTL 2, 3)
CO2: Apply SQL queries and normalization techniques. (BTL 3, 4)
CO3: Analyze transaction processing and concurrency control. (BTL 4)
CO4: Evaluate indexing, hashing, and query optimization techniques. (BTL 5)

Marks Distribution: Equal weightage for all COs.
`,
   syllabus: `UNIT I: DATABASE DESIGN
Entity-Relationship Model – ER diagrams – Enhanced ER features – Relational Model – Relational Algebra – Tuple and Domain Relational Calculus.
Example Problems:
- Design an ER diagram for a University Database with entities: Student, Course, Faculty, Department. Show all relationships with cardinalities.
- Draw the relational schema diagram derived from the ER model with primary and foreign keys marked.
- Problem: Convert the given ER diagram to 3NF relations.

UNIT II: SQL AND NORMALIZATION
SQL – DDL, DML, DCL commands – Joins – Subqueries – Views – Triggers – Stored Procedures – Functional Dependencies – Normal Forms (1NF, 2NF, 3NF, BCNF).
Example Problems:
- Given a relation R(A,B,C,D,E) with FDs: A→B, B→C, C→D, D→E. Find all candidate keys and decompose into 3NF.
- Draw dependency diagrams showing partial and transitive dependencies.
- Problem: Write a trigger with execution flow diagram for maintaining audit logs.

UNIT III: TRANSACTION MANAGEMENT
Transaction concepts – ACID properties – Serializability – Conflict and View serializability – Precedence graphs – Concurrency control – Two-phase locking – Deadlock handling.
Example Problems:
- Draw the precedence graph for the given schedule and determine if it is conflict serializable.
- Illustrate the two-phase locking protocol with timeline diagram for T1 and T2 transactions.
- Problem: Given schedule S, construct the serialization graph and find equivalent serial schedule.

UNIT IV: INDEXING AND QUERY PROCESSING
Indexing – B+ trees – Hashing – Static and Dynamic hashing – Query processing – Query optimization – Relational algebra tree optimization.
Example Problems:
- Draw the B+ tree of order 4 after inserting: 5, 15, 25, 35, 45, 55, 65, 75.
- Illustrate the query execution plan tree for a complex SQL query with joins.
- Problem: Show the step-by-step construction of extendible hashing directory.
`,
   template: `UNIVERSITY EXAMINATION
Course Code: CS301
Course Title: Database Management Systems
Time: 3 Hours
Max. Marks: 100

PART A (10 x 2 = 20 Marks)
Answer ALL Questions
Include ER diagram fragments, relational algebra expressions, B+ tree node representations.

PART B (5 x 16 = 80 Marks)
Answer ALL Questions with Internal Choice (Either OR pattern)
11. (a) Design complete ER diagram for [scenario] OR (b) Convert ER to relational schema with diagram
12. (a) Normalization problem with dependency diagrams OR (b) Complex SQL with execution plan
13. (a) Draw precedence graph and analyze schedule OR (b) Two-phase locking timeline diagram
14. (a) Construct B+ tree with insertions/deletions OR (b) Query optimization tree transformation
`
};

// ========================
// OPERATING SYSTEMS (OS)
// ========================
export const OS_SAMPLE: SubjectSample = {
   courseCode: 'CS303',
   courseTitle: 'Operating Systems',
   cdap: `Course: CS303 - Operating Systems
Course Outcomes (COs):
CO1: Understand process management and CPU scheduling algorithms. (BTL 2, 3)
CO2: Apply synchronization and deadlock handling techniques. (BTL 3, 4)
CO3: Analyze memory management and virtual memory concepts. (BTL 4)
CO4: Evaluate file system implementation and disk scheduling. (BTL 5)

Marks Distribution: Equal weightage for all COs.
`,
   syllabus: `UNIT I: PROCESS MANAGEMENT
Process concepts – Process states and transitions – PCB – Context switching – CPU scheduling algorithms – FCFS, SJF, SRTF, Priority, Round Robin – Gantt charts – Performance metrics.
Example Problems:
- Given processes P1(0,8), P2(1,4), P3(2,9), P4(3,5) with arrival and burst times, draw Gantt chart for SRTF scheduling and calculate average waiting time.
- Draw the process state transition diagram with all possible transitions labeled.
- Problem: Compare Round Robin (quantum=2) and SJF for given process set with Gantt charts.

UNIT II: SYNCHRONIZATION AND DEADLOCK
Process synchronization – Critical section problem – Peterson's solution – Semaphores – Monitors – Classical synchronization problems – Deadlock characterization – RAG – Banker's algorithm.
Example Problems:
- Draw the Resource Allocation Graph for: P1 holds R1, requests R2; P2 holds R2, requests R3; P3 holds R3, requests R1. Detect deadlock.
- Illustrate Producer-Consumer problem solution using semaphores with timing diagram.
- Problem: Apply Banker's algorithm: Available=[3,3,2], Max and Allocation matrices given. Find safe sequence.

UNIT III: MEMORY MANAGEMENT
Memory allocation strategies – Paging – Page table structure – Segmentation – Virtual memory – Demand paging – Page replacement algorithms – FIFO, LRU, Optimal – Thrashing.
Example Problems:
- Given page reference string: 7,0,1,2,0,3,0,4,2,3,0,3,2 with 3 frames, show page replacement using LRU with page fault count diagram.
- Draw the two-level page table structure showing address translation with diagram.
- Problem: Calculate effective memory access time given TLB hit ratio, TLB access time, and memory access time.

UNIT IV: FILE SYSTEMS AND DISK SCHEDULING
File concepts – Directory structure – File allocation methods – Contiguous, Linked, Indexed – Disk scheduling – FCFS, SSTF, SCAN, C-SCAN, LOOK.
Example Problems:
- Given disk queue: 98,183,37,122,14,124,65,67 with head at 53, draw the arm movement diagram for C-SCAN.
- Illustrate indexed file allocation with diagram showing index block and data blocks.
- Problem: Compare SSTF and SCAN for given request queue. Calculate total head movement with diagrams.
`,
   template: `UNIVERSITY EXAMINATION
Course Code: CS303
Course Title: Operating Systems
Time: 3 Hours
Max. Marks: 100

PART A (10 x 2 = 20 Marks)
Answer ALL Questions
Include small Gantt chart fragments, state diagrams, page table entries.

PART B (5 x 16 = 80 Marks)
Answer ALL Questions with Internal Choice (Either OR pattern)
11. (a) CPU scheduling problem with Gantt chart OR (b) Process state diagram analysis
12. (a) Deadlock detection with RAG diagram OR (b) Banker's algorithm with matrices
13. (a) Page replacement with frame diagram OR (b) Address translation diagram
14. (a) Disk scheduling with arm movement diagram OR (b) File allocation method comparison
`
};

// ========================
// COMPUTER NETWORKS (CN)
// ========================
export const CN_SAMPLE: SubjectSample = {
   courseCode: 'CS401',
   courseTitle: 'Computer Networks',
   cdap: `Course: CS401 - Computer Networks
Course Outcomes (COs):
CO1: Understand network architectures, OSI and TCP/IP models. (BTL 2, 3)
CO2: Apply data link layer protocols and error detection techniques. (BTL 3, 4)
CO3: Analyze routing algorithms and network layer protocols. (BTL 4)
CO4: Evaluate transport layer and application layer protocols. (BTL 5)

Marks Distribution: Equal weightage for all COs.
`,
   syllabus: `UNIT I: NETWORK FUNDAMENTALS
Network topologies – OSI Reference Model – TCP/IP Model – Physical layer – Transmission media – Multiplexing techniques – Switching methods.
Example Problems:
- Draw the OSI model showing all 7 layers with protocols and data units at each layer.
- Illustrate the difference between circuit switching and packet switching with timing diagrams.
- Problem: Design a network topology diagram for an organization with 5 departments using star-bus hybrid.

UNIT II: DATA LINK LAYER
Framing – Error detection (CRC, Checksum) – Error correction (Hamming code) – Flow control – Stop-and-Wait, Go-Back-N, Selective Repeat – MAC protocols – CSMA/CD, CSMA/CA.
Example Problems:
- For data 1011001, generate Hamming code with even parity. Show the bit positions diagram.
- Draw the timing diagram for Go-Back-N ARQ with window size 4, showing frame loss and retransmission.
- Problem: Calculate CRC for data 11010011101100 with divisor 1011. Show polynomial division.

UNIT III: NETWORK LAYER
IP addressing – Subnetting – CIDR – Supernetting – Routing algorithms – Distance Vector, Link State – RIP, OSPF, BGP – IPv6 addressing.
Example Problems:
- Given IP 192.168.10.0/24, subnet into 6 networks. Draw the subnetting diagram showing ranges.
- Illustrate Dijkstra's shortest path algorithm on given network graph, showing each iteration.
- Problem: Apply Bellman-Ford algorithm to find shortest paths from source. Show distance table updates.

UNIT IV: TRANSPORT AND APPLICATION LAYER
TCP – Connection establishment (3-way handshake) – Flow control – Congestion control – UDP – DNS – HTTP – SMTP – FTP – Socket programming.
Example Problems:
- Draw the TCP 3-way handshake with sequence numbers and acknowledgments shown.
- Illustrate TCP slow start and congestion avoidance with congestion window graph.
- Problem: Trace DNS resolution for www.example.com showing iterative query with diagram.
`,
   template: `UNIVERSITY EXAMINATION
Course Code: CS401
Course Title: Computer Networks
Time: 3 Hours
Max. Marks: 100

PART A (10 x 2 = 20 Marks)
Answer ALL Questions
Include layer diagrams, frame formats, IP address calculations.

PART B (5 x 16 = 80 Marks)
Answer ALL Questions with Internal Choice (Either OR pattern)
11. (a) Network topology design problem OR (b) OSI/TCP model comparison diagram
12. (a) Error detection/correction with diagram OR (b) Sliding window protocol timing diagram
13. (a) Subnetting problem with network diagram OR (b) Routing algorithm with graph
14. (a) TCP connection diagram and analysis OR (b) Application protocol trace diagram
`
};

// ========================
// DESIGN AND ANALYSIS OF ALGORITHMS (DAA)
// ========================
export const DAA_SAMPLE: SubjectSample = {
   courseCode: 'CS304',
   courseTitle: 'Design and Analysis of Algorithms',
   cdap: `Course: CS304 - Design and Analysis of Algorithms
Course Outcomes (COs):
CO1: Understand algorithm complexity analysis and asymptotic notations. (BTL 2, 3)
CO2: Apply divide and conquer, greedy techniques for problem solving. (BTL 3, 4)
CO3: Analyze dynamic programming and backtracking approaches. (BTL 4)
CO4: Evaluate NP-completeness and approximation algorithms. (BTL 5)

Marks Distribution: Equal weightage for all COs.
`,
   syllabus: `UNIT I: ALGORITHM ANALYSIS
Asymptotic notations – Recurrence relations – Master theorem – Amortized analysis – Divide and Conquer – Merge Sort, Quick Sort, Strassen's Matrix Multiplication.
Example Problems:
- Draw the recursion tree for T(n) = 2T(n/2) + n and derive the complexity.
- Illustrate the partition process of QuickSort with step-by-step array diagrams.
- Problem: Trace Merge Sort on array [38,27,43,3,9,82,10] showing merge tree.

UNIT II: GREEDY ALGORITHMS
Greedy technique – Activity Selection – Fractional Knapsack – Huffman coding – Minimum Spanning Tree – Prim's and Kruskal's algorithms – Dijkstra's shortest path.
Example Problems:
- Construct Huffman tree for: A(5), B(9), C(12), D(13), E(16), F(45). Show codes and tree diagram.
- Apply Kruskal's algorithm to given weighted graph. Show step-by-step edge selection with diagram.
- Problem: Trace Prim's algorithm starting from vertex A. Show MST construction with diagrams.

UNIT III: DYNAMIC PROGRAMMING
Dynamic programming paradigm – 0/1 Knapsack – Longest Common Subsequence – Matrix Chain Multiplication – Floyd-Warshall – Bellman-Ford.
Example Problems:
- Solve 0/1 Knapsack: Items[(60,10), (100,20), (120,30)], W=50. Draw the DP table.
- Find LCS of "ABCDGH" and "AEDFHR" showing the DP matrix with arrows.
- Problem: Optimal parenthesization for matrices A(10x30), B(30x5), C(5x60). Show M and S tables.

UNIT IV: BACKTRACKING AND NP-COMPLETENESS
Backtracking – N-Queens – Graph Coloring – Hamiltonian cycle – Branch and Bound – Traveling Salesman – NP-Complete problems – Polynomial reductions.
Example Problems:
- Solve 4-Queens problem showing the state space tree with backtracking steps.
- Apply Branch and Bound for TSP with cost matrix. Draw the search tree with bounds.
- Problem: Color the given graph with 3 colors using backtracking. Show exploration tree.
`,
   template: `UNIVERSITY EXAMINATION
Course Code: CS304
Course Title: Design and Analysis of Algorithms
Time: 3 Hours
Max. Marks: 100

PART A (10 x 2 = 20 Marks)
Answer ALL Questions
Include complexity derivations, small algorithm traces, recurrence relations.

PART B (5 x 16 = 80 Marks)
Answer ALL Questions with Internal Choice (Either OR pattern)
11. (a) Recursion tree and complexity analysis OR (b) Divide and conquer trace with diagram
12. (a) Greedy algorithm with step-by-step diagram OR (b) MST construction problem
13. (a) DP table construction problem OR (b) Optimal substructure with solution diagram
14. (a) Backtracking with state space tree OR (b) Branch and bound with search tree
`
};

// ========================
// DATA STRUCTURES (Original DS - keeping for compatibility)
// ========================
export const DS_SAMPLE: SubjectSample = {
   courseCode: 'CS302',
   courseTitle: 'Data Structures',
   cdap: `Course: CS302 - Data Structures
Course Outcomes (COs):
CO1: Understand the concepts of linear data structures and their applications. (BTL 2, 3)
CO2: Apply stack and queue operations for problem solving. (BTL 3, 4)
CO3: Analyze tree and graph data structures. (BTL 4)
CO4: Evaluate searching and sorting algorithms. (BTL 5)

Marks Distribution: Equal weightage for all COs.
`,
   syllabus: `UNIT I: LINEAR DATA STRUCTURES
Abstract Data Types (ADTs) – List ADT – array-based implementation – linked list implementation – singly linked lists – doubly-linked lists – applications of lists – Polynomial Manipulation.
Example Problems:
- Draw the memory representation diagram of a doubly linked list with 5 nodes showing prev and next pointers.
- Illustrate polynomial addition using linked lists: (3x^4 + 2x^2 + 1) + (5x^3 + 4x^2 + 2x).
- Problem: Trace insertion and deletion operations on a circular linked list with diagrams.

UNIT II: STACK AND QUEUES
Stack ADT – Operations - Applications - Evaluating arithmetic expressions- Conversion of Infix to postfix expression - Queue ADT – Operations - Circular Queue.
Example Problems:
- Convert A+B*C-D/E to postfix showing stack contents at each step in tabular form.
- Trace the evaluation of postfix expression 23*4+ showing stack diagram at each step.
- Problem: Implement circular queue with front and rear pointers. Show insert/delete with diagrams.

UNIT III: NON LINEAR DATA STRUCTURES
Trees – Traversal – Binary Trees – Expression trees – Applications of trees – Binary search trees – AVL trees.
Example Problems:
- Construct BST by inserting: 50, 30, 70, 20, 40, 60, 80. Show tree after each insertion.
- Insert 15, 20, 24, 10, 13, 7, 30, 36, 25 into an AVL tree showing rotations with diagrams.
- Problem: Construct expression tree for (a+b)*(c-d)/e and show inorder, preorder, postorder traversals.

UNIT IV: GRAPHS
Definitions – Topological sort – Breadth-first traversal - Depth-first traversal – Minimum Spanning Tree – Prim's and Kruskal's algorithms.
Example Problems:
- Perform BFS and DFS on given graph starting from vertex A. Show traversal order with diagrams.
- Find topological sort for given DAG using DFS. Show stack contents and final order.
- Problem: Apply Kruskal's algorithm to find MST. Show edge selection with forest diagrams.
`,
   template: `UNIVERSITY EXAMINATION
Course Code: CS302
Course Title: Data Structures
Time: 3 Hours
Max. Marks: 100

PART A (10 x 2 = 20 Marks)
Answer ALL Questions
Include linked list diagrams, stack traces, tree structures.

PART B (5 x 16 = 80 Marks)
Answer ALL Questions with Internal Choice (Either OR pattern)
11. (a) Linked list operation with memory diagram OR (b) Application problem with list
12. (a) Stack/Queue application with trace OR (b) Expression conversion with stack diagram
13. (a) BST/AVL construction with rotations OR (b) Tree traversal problem
14. (a) Graph traversal with step diagram OR (b) MST algorithm with construction diagram
`
};

// ========================
// COMPILER DESIGN (CD)
// ========================
export const CD_SAMPLE: SubjectSample = {
   courseCode: 'CS501',
   courseTitle: 'Compiler Design',
   cdap: `Course: CS501 - Compiler Design
Course Outcomes (COs):
CO1: Understand lexical analysis and finite automata construction. (BTL 2, 3)
CO2: Apply parsing techniques - top-down and bottom-up parsing. (BTL 3, 4)
CO3: Analyze semantic analysis and intermediate code generation. (BTL 4)
CO4: Evaluate code optimization and code generation techniques. (BTL 5)

Marks Distribution: Equal weightage for all COs.
`,
   syllabus: `UNIT I: LEXICAL ANALYSIS
Phases of compiler – Lexical analysis – Regular expressions – NFA and DFA construction – Subset construction – Minimization of DFA – LEX tool.
Example Problems:
- Construct NFA for (a|b)*abb using Thompson's construction. Show the NFA diagram.
- Convert the NFA to DFA using subset construction. Draw the DFA transition table and diagram.
- Problem: Minimize the given DFA. Show partition refinement steps with state diagrams.

UNIT II: SYNTAX ANALYSIS
CFG – Derivations – Parse trees – Ambiguity – Top-down parsing – LL(1) parser – First and Follow sets – Predictive parsing table – Bottom-up parsing – SLR, CLR, LALR parsers.
Example Problems:
- For grammar S→aABe, A→Abc|b, B→d, construct LL(1) parsing table. Show First/Follow computation.
- Draw parse tree for input "aabcd" using the given grammar.
- Problem: Construct SLR parsing table for given grammar. Show LR(0) item sets with DFA.

UNIT III: SEMANTIC ANALYSIS
Syntax Directed Definitions – S-attributed and L-attributed definitions – Type checking – Symbol table organization.
Example Problems:
- Draw annotated parse tree for expression 3*5+4 showing semantic rules and attribute values.
- Illustrate symbol table with hashing for given program with scope diagram.
- Problem: Generate three-address code for: a = b*-c + b*-c showing DAG optimization.

UNIT IV: CODE OPTIMIZATION AND GENERATION
Intermediate code generation – Three address code – Quadruples, Triples – Basic blocks – Flow graphs – Code optimization techniques – Register allocation – Code generation.
Example Problems:
- Construct flow graph from three-address code. Identify loops and basic blocks.
- Apply common subexpression elimination and copy propagation on given code. Show before/after.
- Problem: Generate target assembly code for given three-address code. Show register allocation.
`,
   template: `UNIVERSITY EXAMINATION
Course Code: CS501
Course Title: Compiler Design
Time: 3 Hours
Max. Marks: 100

PART A (10 x 2 = 20 Marks)
Answer ALL Questions
Include automata fragments, parsing table entries, code transformation examples.

PART B (5 x 16 = 80 Marks)
Answer ALL Questions with Internal Choice (Either OR pattern)
11. (a) NFA to DFA conversion with diagrams OR (b) DFA minimization problem
12. (a) LL(1)/SLR parsing table construction OR (b) Parse tree and derivation
13. (a) Annotated parse tree with attributes OR (b) Three-address code generation with DAG
14. (a) Flow graph and optimization OR (b) Code generation with register allocation
`
};

// ========================
// ARTIFICIAL INTELLIGENCE (AI)
// ========================
export const AI_SAMPLE: SubjectSample = {
   courseCode: 'CS601',
   courseTitle: 'Artificial Intelligence',
   cdap: `Course: CS601 - Artificial Intelligence
Course Outcomes (COs):
CO1: Understand intelligent agents and search strategies. (BTL 2, 3)
CO2: Apply heuristic search and game playing algorithms. (BTL 3, 4)
CO3: Analyze knowledge representation and reasoning techniques. (BTL 4)
CO4: Evaluate machine learning approaches and neural networks. (BTL 5)

Marks Distribution: Equal weightage for all COs.
`,
   syllabus: `UNIT I: PROBLEM SOLVING
Intelligent Agents – Problem formulation – State space search – Uninformed search – BFS, DFS, Uniform Cost, Iterative Deepening – Informed search – Best First, A*.
Example Problems:
- Solve 8-puzzle using A* with Manhattan distance heuristic. Show state space tree with f, g, h values.
- Trace BFS for water jug problem (4L, 3L) to get 2L. Show state diagram with levels.
- Problem: Apply Iterative Deepening DFS to reach goal. Show exploration at each depth limit.

UNIT II: GAME PLAYING
Adversarial search – Minimax algorithm – Alpha-beta pruning – Game trees – Stochastic games.
Example Problems:
- Apply Minimax algorithm to given game tree. Show backed-up values at each node.
- Trace Alpha-Beta pruning on game tree showing pruned branches with α, β values at each node.
- Problem: Given tic-tac-toe position, construct game tree to depth 2 and find best move.

UNIT III: KNOWLEDGE REPRESENTATION
Propositional logic – First-order logic – Inference – Resolution – Unification – Forward and Backward chaining – Semantic networks – Frames.
Example Problems:
- Prove theorem using resolution refutation. Show clauses and resolution tree.
- Draw semantic network for: "Tom is a cat. Cats are mammals. Mammals are animals."
- Problem: Apply Unification to given predicates. Show step-by-step substitution.

UNIT IV: MACHINE LEARNING
Learning concepts – Decision trees – ID3 algorithm – Neural networks – Perceptron – Backpropagation – Clustering – K-means.
Example Problems:
- Construct decision tree using ID3 for given training data. Show information gain calculations.
- Train a perceptron for AND gate. Show weight updates with diagram.
- Problem: Apply K-means clustering (k=2) to given data points. Show cluster assignments at each iteration.
`,
   template: `UNIVERSITY EXAMINATION
Course Code: CS601
Course Title: Artificial Intelligence
Time: 3 Hours
Max. Marks: 100

PART A (10 x 2 = 20 Marks)
Answer ALL Questions
Include state space fragments, game tree nodes, semantic net diagrams.

PART B (5 x 16 = 80 Marks)
Answer ALL Questions with Internal Choice (Either OR pattern)
11. (a) A* search with heuristic calculation OR (b) State space search problem
12. (a) Minimax with game tree OR (b) Alpha-beta pruning trace
13. (a) Resolution proof with diagram OR (b) Knowledge representation diagram
14. (a) Decision tree construction OR (b) Neural network training with diagram
`
};

// Array of all subject samples for random selection
export const ALL_SUBJECT_SAMPLES: SubjectSample[] = [
   OOPS_SAMPLE,
   DBMS_SAMPLE,
   OS_SAMPLE,
   CN_SAMPLE,
   DAA_SAMPLE,
   DS_SAMPLE,
   CD_SAMPLE,
   AI_SAMPLE
];

// Function to get a random subject sample
export const getRandomSubjectSample = (): SubjectSample => {
   const randomIndex = Math.floor(Math.random() * ALL_SUBJECT_SAMPLES.length);
   return ALL_SUBJECT_SAMPLES[randomIndex];
};

// Legacy exports for backward compatibility
export const SAMPLE_CDAP = DS_SAMPLE.cdap;
export const SAMPLE_SYLLABUS = DS_SAMPLE.syllabus;
export const SAMPLE_TEMPLATE = DS_SAMPLE.template;

export const SYSTEM_PROMPT = `You are an Academic Question Bank Generation Engine designed for Indian engineering colleges.

ROLE & RESPONSIBILITY:
1. Parse provided CDAP, Syllabus, and Template.
2. Generate a high-quality question bank with:
   - DIAGRAMMATIC QUESTIONS: Questions requiring students to draw diagrams (flowcharts, UML, ER diagrams, trees, graphs, state diagrams, timing diagrams, memory layouts, etc.)
   - PROBLEM-SOLVING QUESTIONS: Numerical and algorithmic problems requiring step-by-step solutions (calculations, algorithm traces, table constructions, etc.)
3. Ensure Bloom's Taxonomy rules:
   - 2 Marks: BTL 2 (Understand), BTL 3 (Apply), BTL 4 (Analyze).
   - 16 Marks: BTL 3 (Apply), BTL 4 (Analyze), BTL 5 (Evaluate).
4. For Each Long Question (16 marks):
   - Include diagrammatic components where applicable
   - Include step-by-step problem solving with intermediate results
   - Provide clear marking scheme

QUESTION TYPES TO GENERATE:
- Draw/Illustrate/Construct (Diagrammatic)
- Trace/Solve/Calculate (Problem-based)
- Compare with diagrams (Comparative)
- Design and implement with flowchart (Design-based)

Strictly follow the syllabus units and topics.
`;
