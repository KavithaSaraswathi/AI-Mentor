import { UserProfile, Topic, Problem, DailyProgressEntry, ResourceItem, ProjectItem, ExploreLaterItem, AptitudeTopic, GoalItem } from '../types';

export const initialProfile: UserProfile = {
  id: 'user_1',
  name: 'Student Developer',
  email: 'student@aimentor.edu',
  learningStyle: 'Prefer practical examples & building projects step-by-step',
  goals: [
    'Become strong in Java & DSA',
    'Master Generative AI & Agentic AI',
    'Crack Top College Placement Technical Interviews',
    'Build an ATS-optimized Resume'
  ],
  currentRoleTarget: 'AI/ML Engineer',
  streakDays: 0,
  lastActiveDate: new Date().toISOString().split('T')[0]
};

export const initialJavaTopics: Topic[] = [
  // Java Basics
  { id: 'jb-1', category: 'java', subSection: 'Java Basics', name: 'Variables & Data Types', status: 'Not Started', progress: 0, notes: 'Primitive types vs Reference types', order: 1 },
  { id: 'jb-2', category: 'java', subSection: 'Java Basics', name: 'Operators & Expressions', status: 'Not Started', progress: 0, notes: 'Arithmetic, logical, bitwise operators', order: 2 },
  { id: 'jb-3', category: 'java', subSection: 'Java Basics', name: 'Conditions & Loops', status: 'Not Started', progress: 0, notes: 'if-else, switch, for, while, do-while', order: 3 },
  { id: 'jb-4', category: 'java', subSection: 'Java Basics', name: 'Arrays & Strings', status: 'Not Started', progress: 0, notes: '1D/2D arrays, String immutability, StringBuilder', order: 4 },
  { id: 'jb-5', category: 'java', subSection: 'Java Basics', name: 'Methods & Input/Output', status: 'Not Started', progress: 0, notes: 'Scanner class, BufferedReader, method signatures', order: 5 },

  // OOP
  { id: 'oop-1', category: 'java', subSection: 'OOP', name: 'Classes & Objects', status: 'Not Started', progress: 0, notes: 'Blueprint vs Instance', order: 6 },
  { id: 'oop-2', category: 'java', subSection: 'OOP', name: 'Constructors', status: 'Not Started', progress: 0, notes: 'Default, parameterized, constructor overloading', order: 7 },
  { id: 'oop-3', category: 'java', subSection: 'OOP', name: 'Encapsulation', status: 'Not Started', progress: 0, notes: 'Private fields, getters/setters', order: 8 },
  { id: 'oop-4', category: 'java', subSection: 'OOP', name: 'Inheritance', status: 'Not Started', progress: 0, notes: 'super keyword, single/multilevel inheritance', order: 9 },
  { id: 'oop-5', category: 'java', subSection: 'OOP', name: 'Polymorphism', status: 'Not Started', progress: 0, notes: 'Compile-time (overloading) vs Runtime (overriding)', order: 10 },
  { id: 'oop-6', category: 'java', subSection: 'OOP', name: 'Abstraction & Interfaces', status: 'Not Started', progress: 0, notes: 'Abstract class vs Interface, default & static methods', order: 11 },
  { id: 'oop-7', category: 'java', subSection: 'OOP', name: 'Access Modifiers & Static/Final', status: 'Not Started', progress: 0, notes: 'public, private, protected, default, static block, final variables', order: 12 },

  // Advanced Java
  { id: 'aj-1', category: 'java', subSection: 'Advanced Java', name: 'Exception Handling', status: 'Not Started', progress: 0, notes: 'try-catch-finally, checked vs unchecked exceptions, custom exceptions', order: 13 },
  { id: 'aj-2', category: 'java', subSection: 'Advanced Java', name: 'Collections Framework', status: 'Not Started', progress: 0, notes: 'List, Set, Map, Queue interfaces and implementations', order: 14 },
  { id: 'aj-3', category: 'java', subSection: 'Advanced Java', name: 'Generics', status: 'Not Started', progress: 0, notes: 'Wildcards <? super T>, generic classes and methods', order: 15 },
  { id: 'aj-4', category: 'java', subSection: 'Advanced Java', name: 'Multithreading & Concurrency', status: 'Not Started', progress: 0, notes: 'Thread lifecycle, Runnable, synchronized, ExecutorService', order: 16 },
  { id: 'aj-5', category: 'java', subSection: 'Advanced Java', name: 'Lambda Expressions & Streams API', status: 'Not Started', progress: 0, notes: 'Functional interfaces, map, filter, collect, reduce', order: 17 },
  { id: 'aj-6', category: 'java', subSection: 'Advanced Java', name: 'Important Java Interview Questions', status: 'Not Started', progress: 0, notes: 'HashMap internal working, String Constant Pool, garbage collection', order: 18 }
];

export const initialDsaTopics: Topic[] = [
  { id: 'dsa-1', category: 'dsa', subSection: 'DSA Roadmap', name: 'Arrays', status: 'Not Started', progress: 0, notes: 'Kadane algorithm, Dutch National Flag, Subarrays', order: 1 },
  { id: 'dsa-2', category: 'dsa', subSection: 'DSA Roadmap', name: 'Strings', status: 'Not Started', progress: 0, notes: 'Anagrams, Palindromes, String Manipulation', order: 2 },
  { id: 'dsa-3', category: 'dsa', subSection: 'DSA Roadmap', name: 'Hashing', status: 'Not Started', progress: 0, notes: 'HashMap frequency counter, HashSet lookup', order: 3 },
  { id: 'dsa-4', category: 'dsa', subSection: 'DSA Roadmap', name: 'Two Pointers', status: 'Not Started', progress: 0, notes: 'Opposite direction, same direction pointers', order: 4 },
  { id: 'dsa-5', category: 'dsa', subSection: 'DSA Roadmap', name: 'Sliding Window', status: 'Not Started', progress: 0, notes: 'Fixed size & dynamic size sliding window', order: 5 },
  { id: 'dsa-6', category: 'dsa', subSection: 'DSA Roadmap', name: 'Stack', status: 'Not Started', progress: 0, notes: 'Monotonic stack, Next Greater Element, Valid Parentheses', order: 6 },
  { id: 'dsa-7', category: 'dsa', subSection: 'DSA Roadmap', name: 'Queue', status: 'Not Started', progress: 0, notes: 'Circular Queue, Deque, BFS queue usage', order: 7 },
  { id: 'dsa-8', category: 'dsa', subSection: 'DSA Roadmap', name: 'Linked List', status: 'Not Started', progress: 0, notes: 'Singly & Doubly LL, Reverse LL, Cycle Detection (Floyd)', order: 8 },
  { id: 'dsa-9', category: 'dsa', subSection: 'DSA Roadmap', name: 'Binary Search', status: 'Not Started', progress: 0, notes: 'Search in rotated array, lower/upper bound, Search space reduction', order: 9 },
  { id: 'dsa-10', category: 'dsa', subSection: 'DSA Roadmap', name: 'Trees', status: 'Not Started', progress: 0, notes: 'Preorder, Inorder, Postorder, BFS, DFS traversals', order: 10 },
  { id: 'dsa-11', category: 'dsa', subSection: 'DSA Roadmap', name: 'Binary Search Tree', status: 'Not Started', progress: 0, notes: 'BST validation, Lowest Common Ancestor, Insertion/Deletion', order: 11 },
  { id: 'dsa-12', category: 'dsa', subSection: 'DSA Roadmap', name: 'Heap / Priority Queue', status: 'Not Started', progress: 0, notes: 'Min Heap, Max Heap, Kth Largest Element', order: 12 },
  { id: 'dsa-13', category: 'dsa', subSection: 'DSA Roadmap', name: 'Graphs', status: 'Not Started', progress: 0, notes: 'Adjacency list, BFS, DFS, Dijkstra, Topological Sort', order: 13 },
  { id: 'dsa-14', category: 'dsa', subSection: 'DSA Roadmap', name: 'Backtracking', status: 'Not Started', progress: 0, notes: 'N-Queens, Sudoku Solver, Subsets, Permutations', order: 14 },
  { id: 'dsa-15', category: 'dsa', subSection: 'DSA Roadmap', name: 'Greedy Algorithms', status: 'Not Started', progress: 0, notes: 'Activity Selection, Fractional Knapsack, Jump Game', order: 15 },
  { id: 'dsa-16', category: 'dsa', subSection: 'DSA Roadmap', name: 'Intervals', status: 'Not Started', progress: 0, notes: 'Merge Intervals, Insert Interval, Non-overlapping Intervals', order: 16 },
  { id: 'dsa-17', category: 'dsa', subSection: 'DSA Roadmap', name: 'Dynamic Programming', status: 'Not Started', progress: 0, notes: '1D DP, 2D DP, 0/1 Knapsack, LCS, LIS', order: 17 }
];

export const initialAiMlTopics: Topic[] = [
  // 1. Python Foundation
  { id: 'aiml-1', category: 'aiml', subSection: 'Python Foundation', name: 'Python Basics & Control Flow', status: 'Not Started', progress: 0, notes: 'Data structures, list comprehensions, lambda functions', order: 1 },
  { id: 'aiml-2', category: 'aiml', subSection: 'Python Foundation', name: 'NumPy Vectorized Operations', status: 'Not Started', progress: 0, notes: 'Arrays, broadcasting, slicing, linear algebra ops', order: 2 },
  { id: 'aiml-3', category: 'aiml', subSection: 'Python Foundation', name: 'Pandas Data Analysis', status: 'Not Started', progress: 0, notes: 'DataFrames, groupby, filtering, handling missing values', order: 3 },
  { id: 'aiml-4', category: 'aiml', subSection: 'Python Foundation', name: 'Matplotlib & Seaborn Visualization', status: 'Not Started', progress: 0, notes: 'Distribution plots, scatter charts, heatmaps', order: 4 },
  { id: 'aiml-5', category: 'aiml', subSection: 'Python Foundation', name: 'Basic Statistics for Data Science', status: 'Not Started', progress: 0, notes: 'Mean, median, std dev, variance, probability distributions', order: 5 },

  // 2. Machine Learning
  { id: 'aiml-6', category: 'aiml', subSection: 'Machine Learning', name: 'Supervised Learning Algorithms', status: 'Not Started', progress: 0, notes: 'Linear & Logistic Regression, Decision Trees, Random Forests', order: 6 },
  { id: 'aiml-7', category: 'aiml', subSection: 'Machine Learning', name: 'Unsupervised Learning', status: 'Not Started', progress: 0, notes: 'K-Means clustering, PCA dimensionality reduction', order: 7 },
  { id: 'aiml-8', category: 'aiml', subSection: 'Machine Learning', name: 'Data Preprocessing & Feature Engineering', status: 'Not Started', progress: 0, notes: 'One-hot encoding, scaling, imputation', order: 8 },
  { id: 'aiml-9', category: 'aiml', subSection: 'Machine Learning', name: 'Model Evaluation & Hyperparameter Tuning', status: 'Not Started', progress: 0, notes: 'ROC-AUC, Precision, Recall, Cross-validation, GridSearchCV', order: 9 },
  { id: 'aiml-10', category: 'aiml', subSection: 'Machine Learning', name: 'Scikit-Learn Workflows', status: 'Not Started', progress: 0, notes: 'Pipeline API, ColumnTransformer', order: 10 },

  // 3. Deep Learning
  { id: 'aiml-11', category: 'aiml', subSection: 'Deep Learning', name: 'Neural Networks & Activation Functions', status: 'Not Started', progress: 0, notes: 'Perceptrons, ReLU, Sigmoid, Softmax', order: 11 },
  { id: 'aiml-12', category: 'aiml', subSection: 'Deep Learning', name: 'Backpropagation & Optimizers', status: 'Not Started', progress: 0, notes: 'Gradient descent, Adam, SGD, Loss functions', order: 12 },
  { id: 'aiml-13', category: 'aiml', subSection: 'Deep Learning', name: 'Convolutional Neural Networks (CNN)', status: 'Not Started', progress: 0, notes: 'Image classification, feature maps, pooling', order: 13 },
  { id: 'aiml-14', category: 'aiml', subSection: 'Deep Learning', name: 'RNN, LSTM & Sequence Models', status: 'Not Started', progress: 0, notes: 'Time series, sequence prediction, vanishing gradient', order: 14 },
  { id: 'aiml-15', category: 'aiml', subSection: 'Deep Learning', name: 'Transformers & Self-Attention', status: 'Not Started', progress: 0, notes: 'Encoder-Decoder architecture, multi-head attention', order: 15 },
  { id: 'aiml-16', category: 'aiml', subSection: 'Deep Learning', name: 'PyTorch & TensorFlow Basics', status: 'Not Started', progress: 0, notes: 'Tensors, Autograd, nn.Module', order: 16 },

  // 4. Generative AI
  { id: 'aiml-17', category: 'aiml', subSection: 'Generative AI', name: 'LLM Fundamentals & Architecture', status: 'Not Started', progress: 0, notes: 'Tokens, Context Window, Temperature, Top-P', order: 17 },
  { id: 'aiml-18', category: 'aiml', subSection: 'Generative AI', name: 'Prompt Engineering Techniques', status: 'Not Started', progress: 0, notes: 'Zero-shot, Few-shot, Chain-of-Thought, ReAct', order: 18 },
  { id: 'aiml-19', category: 'aiml', subSection: 'Generative AI', name: 'LLM APIs (OpenAI, Gemini, Anthropic)', status: 'Not Started', progress: 0, notes: 'API integration, streaming responses, JSON mode', order: 19 },
  { id: 'aiml-20', category: 'aiml', subSection: 'Generative AI', name: 'Text Embeddings & Semantic Search', status: 'Not Started', progress: 0, notes: 'Cosine similarity, embedding spaces', order: 20 },
  { id: 'aiml-21', category: 'aiml', subSection: 'Generative AI', name: 'Vector Databases (Chroma, Pinecone)', status: 'Not Started', progress: 0, notes: 'Indexing, similarity search, hybrid search', order: 21 },
  { id: 'aiml-22', category: 'aiml', subSection: 'Generative AI', name: 'Retrieval Augmented Generation (RAG)', status: 'Not Started', progress: 0, notes: 'Chunking strategies, document parsing, context injection', order: 22 },

  // 5. Agentic AI
  { id: 'aiml-23', category: 'aiml', subSection: 'Agentic AI', name: 'LLM Tool & Function Calling', status: 'Not Started', progress: 0, notes: 'Schema definition, function execution, result injection', order: 23 },
  { id: 'aiml-24', category: 'aiml', subSection: 'Agentic AI', name: 'Agent Memory & Context State', status: 'Not Started', progress: 0, notes: 'Short-term vs long-term memory, conversation buffer', order: 24 },
  { id: 'aiml-25', category: 'aiml', subSection: 'Agentic AI', name: 'Agent Planning & ReAct Loops', status: 'Not Started', progress: 0, notes: 'Thought-Action-Observation loops, task breakdown', order: 25 },
  { id: 'aiml-26', category: 'aiml', subSection: 'Agentic AI', name: 'Multi-Agent Orchestration Systems', status: 'Not Started', progress: 0, notes: 'Subagent delegator, supervisor pattern, peer messaging', order: 26 },

  // 6. AI Automation
  { id: 'aiml-27', category: 'aiml', subSection: 'AI Automation', name: 'APIs, Webhooks & Event Triggers', status: 'Not Started', progress: 0, notes: 'REST endpoints, payload formatting, async hooks', order: 27 },
  { id: 'aiml-28', category: 'aiml', subSection: 'AI Automation', name: 'Scheduled Workflows & Automation', status: 'Not Started', progress: 0, notes: 'Cron jobs, background tasks, notification triggers', order: 28 },
  { id: 'aiml-29', category: 'aiml', subSection: 'AI Automation', name: 'Connecting Agents to External Services', status: 'Not Started', progress: 0, notes: 'GitHub API, Slack webhooks, email automation', order: 29 },

  // 7. Advanced Agentic AI
  { id: 'aiml-30', category: 'aiml', subSection: 'Advanced Agentic AI', name: 'RAG Agents & Dynamic Routing', status: 'Not Started', progress: 0, notes: 'Dynamic routing, self-correction RAG, agentic retrieval', order: 30 },
  { id: 'aiml-31', category: 'aiml', subSection: 'Advanced Agentic AI', name: 'Production Multi-Agent Systems & Guardrails', status: 'Not Started', progress: 0, notes: 'Safety rails, latency optimization, fallback strategies', order: 31 }
];

export const initialProblems: Problem[] = [];

export const initialDailyLogs: DailyProgressEntry[] = [];

export const initialResources: ResourceItem[] = [
  {
    id: 'res-1',
    name: 'NeetCode 150 - DSA Practice Roadmap',
    category: 'LeetCode',
    url: 'https://neetcode.io/roadmap',
    description: 'Curated list of 150 essential DSA problems grouped by pattern and topic.',
    priority: 'High',
    notes: 'Primary reference for college placement coding rounds.'
  },
  {
    id: 'res-2',
    name: 'Java Documentation & Collections API',
    category: 'Java',
    url: 'https://docs.oracle.com/en/java/',
    description: 'Official Java SE documentation for Collections, Streams, and Concurrency.',
    priority: 'Medium',
    notes: 'Use for deep technical interview prep.'
  },
  {
    id: 'res-3',
    name: 'DeepLearning.AI - Prompt Engineering for Developers',
    category: 'GenAI',
    url: 'https://www.deeplearning.ai/short-courses/',
    description: 'Short courses on Prompt Engineering, RAG, and LangChain basics.',
    priority: 'High',
    notes: 'Great hands-on notebooks.'
  },
  {
    id: 'res-4',
    name: 'IndiaBIX Aptitude & Reasoning',
    category: 'Aptitude',
    url: 'https://www.indiabix.com/',
    description: 'Practice questions for Percentages, Profit & Loss, Logical Reasoning, and Verbal.',
    priority: 'Medium',
    notes: 'Daily 20 mins practice target.'
  }
];

export const initialProjects: ProjectItem[] = [];

export const initialExploreLater: ExploreLaterItem[] = [];

export const initialAptitudeTopics: AptitudeTopic[] = [
  { id: 'apt-1', name: 'Percentages', category: 'Quantitative', questionsAttempted: 0, questionsSolved: 0, accuracy: 0, timeTakenMinutes: 0, weakSubtopics: [], lastPracticed: '' },
  { id: 'apt-2', name: 'Profit & Loss', category: 'Quantitative', questionsAttempted: 0, questionsSolved: 0, accuracy: 0, timeTakenMinutes: 0, weakSubtopics: [], lastPracticed: '' },
  { id: 'apt-3', name: 'Ratio & Proportion', category: 'Quantitative', questionsAttempted: 0, questionsSolved: 0, accuracy: 0, timeTakenMinutes: 0, weakSubtopics: [], lastPracticed: '' },
  { id: 'apt-4', name: 'Averages', category: 'Quantitative', questionsAttempted: 0, questionsSolved: 0, accuracy: 0, timeTakenMinutes: 0, weakSubtopics: [], lastPracticed: '' },
  { id: 'apt-5', name: 'Time & Work', category: 'Quantitative', questionsAttempted: 0, questionsSolved: 0, accuracy: 0, timeTakenMinutes: 0, weakSubtopics: [], lastPracticed: '' },
  { id: 'apt-6', name: 'Time, Speed & Distance', category: 'Quantitative', questionsAttempted: 0, questionsSolved: 0, accuracy: 0, timeTakenMinutes: 0, weakSubtopics: [], lastPracticed: '' },
  { id: 'apt-7', name: 'Probability', category: 'Quantitative', questionsAttempted: 0, questionsSolved: 0, accuracy: 0, timeTakenMinutes: 0, weakSubtopics: [], lastPracticed: '' },
  { id: 'apt-8', name: 'Permutations & Combinations', category: 'Quantitative', questionsAttempted: 0, questionsSolved: 0, accuracy: 0, timeTakenMinutes: 0, weakSubtopics: [], lastPracticed: '' },
  { id: 'apt-9', name: 'Number Systems', category: 'Quantitative', questionsAttempted: 0, questionsSolved: 0, accuracy: 0, timeTakenMinutes: 0, weakSubtopics: [], lastPracticed: '' },
  { id: 'apt-10', name: 'Data Interpretation', category: 'Data Interpretation', questionsAttempted: 0, questionsSolved: 0, accuracy: 0, timeTakenMinutes: 0, weakSubtopics: [], lastPracticed: '' },
  { id: 'apt-11', name: 'Logical Reasoning', category: 'Logical', questionsAttempted: 0, questionsSolved: 0, accuracy: 0, timeTakenMinutes: 0, weakSubtopics: [], lastPracticed: '' },
  { id: 'apt-12', name: 'Verbal Ability', category: 'Verbal', questionsAttempted: 0, questionsSolved: 0, accuracy: 0, timeTakenMinutes: 0, weakSubtopics: [], lastPracticed: '' }
];

export const initialCsFundamentals: Topic[] = [
  { id: 'cs-1', category: 'cs_fundamentals', subSection: 'CS Fundamentals', name: 'Object-Oriented Programming (OOP)', status: 'Not Started', progress: 0, notes: '4 Pillars, Solid principles, Design Patterns basics', order: 1 },
  { id: 'cs-2', category: 'cs_fundamentals', subSection: 'CS Fundamentals', name: 'Database Management Systems (DBMS)', status: 'Not Started', progress: 0, notes: 'ACID properties, Normalization (1NF to 3NF), ER Diagrams', order: 2 },
  { id: 'cs-3', category: 'cs_fundamentals', subSection: 'CS Fundamentals', name: 'SQL & Query Optimization', status: 'Not Started', progress: 0, notes: 'Joins, Subqueries, Indexing, Group By, Having', order: 3 },
  { id: 'cs-4', category: 'cs_fundamentals', subSection: 'CS Fundamentals', name: 'Operating Systems (OS)', status: 'Not Started', progress: 0, notes: 'Process vs Thread, Deadlocks, Paging, Virtual Memory, CPU Scheduling', order: 4 },
  { id: 'cs-5', category: 'cs_fundamentals', subSection: 'CS Fundamentals', name: 'Computer Networks (CN)', status: 'Not Started', progress: 0, notes: 'OSI Model, TCP/IP, HTTP/HTTPS, DNS, Handshake', order: 5 },
  { id: 'cs-6', category: 'cs_fundamentals', subSection: 'CS Fundamentals', name: 'Computer Architecture & Organization', status: 'Not Started', progress: 0, notes: 'Cache memory, ALU, Instruction pipeline', order: 6 },
  { id: 'cs-7', category: 'cs_fundamentals', subSection: 'CS Fundamentals', name: 'Software Engineering & Agile', status: 'Not Started', progress: 0, notes: 'SDLC models, Git branching, CI/CD basic concepts', order: 7 }
];

export const initialGoals: GoalItem[] = [
  { id: 'g-1', title: 'Complete Variables & Control Flow in Python', category: 'AI / ML', deadline: '2026-08-30', status: 'Active' },
  { id: 'g-2', title: 'Master Java Variables & OOP Basics', category: 'Java + DSA', deadline: '2026-08-28', status: 'Active' },
  { id: 'g-3', title: 'Solve First 5 Arrays Problems on LeetCode', category: 'Java + DSA', deadline: '2026-09-01', status: 'Active' },
  { id: 'g-4', title: 'Review and Polish Resume for Target Role', category: 'Resume', deadline: '2026-09-05', status: 'Active' }
];
