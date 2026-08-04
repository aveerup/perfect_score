import { 
  VideoLecture, 
  PracticeQuestionSet, 
  VocabularyWord, 
  MockTest, 
  DashboardData, 
  StudyPlan 
} from './types';

export const videos: VideoLecture[] = [
  { id: 'v1', title: 'Mastering Multiple Choice in Listening', skill: 'L', bandRange: '6.5-7.5', duration: '12:45', watched: true, progress: 100 },
  { id: 'v2', title: 'True, False, Not Given: Common Pitfalls', skill: 'R', bandRange: '7.0-8.0', duration: '15:20', watched: false, progress: 45 },
  { id: 'v3', title: 'Writing Task 2: Advanced Sentence Structures', skill: 'W', bandRange: '7.0-9.0', duration: '22:15', watched: false, progress: 0 },
  { id: 'v4', title: 'Speaking Part 2: How to speak for 2 minutes', skill: 'S', bandRange: '6.0-7.0', duration: '10:30', watched: true, progress: 100 },
  { id: 'v5', title: 'Understanding Maps and Diagrams', skill: 'L', bandRange: '5.5-6.5', duration: '08:50', watched: false, progress: 10 },
  { id: 'v6', title: 'Skimming and Scanning Techniques', skill: 'R', bandRange: '6.0-7.5', duration: '14:10', watched: true, progress: 100 },
  { id: 'v7', title: 'Task 1: Describing Complex Trends', skill: 'W', bandRange: '7.0-8.5', duration: '18:40', watched: false, progress: 0 },
  { id: 'v8', title: 'Fluency and Coherence in Speaking', skill: 'S', bandRange: '7.0-8.0', duration: '11:20', watched: false, progress: 30 },
  { id: 'v9', title: 'Listening for Synonyms and Paraphrasing', skill: 'L', bandRange: '7.0-8.0', duration: '13:15', watched: false, progress: 0 },
  { id: 'v10', title: 'Matching Headings with Ease', skill: 'R', bandRange: '6.5-7.5', duration: '16:50', watched: false, progress: 0 },
  { id: 'v11', title: 'Cohesion and Coherence in Essay Writing', skill: 'W', bandRange: '6.5-8.0', duration: '19:30', watched: false, progress: 0 },
  { id: 'v12', title: 'Idiomatic Expressions for Band 8+', skill: 'S', bandRange: '8.0-9.0', duration: '09:45', watched: false, progress: 0 },
];

export const practiceQuestions: PracticeQuestionSet[] = [
  { id: 'p1', title: 'Academic Reading: The History of Printing', skill: 'R', subType: 'True/False/Not Given', difficulty: 'Medium', bandRange: '6.5-7.5', attempted: true, score: '11/13' },
  { id: 'p2', title: 'Listening Section 1: Customer Inquiry', skill: 'L', subType: 'Form Completion', difficulty: 'Easy', bandRange: '5.5-6.5', attempted: true, score: '10/10' },
  { id: 'p4', title: 'Speaking Part 3: Future of Education', skill: 'S', subType: 'Discussion Questions', difficulty: 'Medium', bandRange: '6.0-7.5', attempted: true, score: '7.0' },
  { id: 'p5', title: 'Academic Reading: Renewable Energy', skill: 'R', subType: 'Matching Headings', difficulty: 'Hard', bandRange: '7.5-8.5', attempted: false },
  { id: 'p6', title: 'Listening Section 4: Academic Lecture', skill: 'L', subType: 'Note Completion', difficulty: 'Hard', bandRange: '7.5-9.0', attempted: false },
  { id: 'p7', title: 'General Training Reading: Work Habits', skill: 'R', subType: 'Multiple Choice', difficulty: 'Easy', bandRange: '5.0-6.0', attempted: true, score: '38/40' },
  { id: 'p9', title: 'Speaking Part 1: Hometown and Hobbies', skill: 'S', subType: 'Introductory Questions', difficulty: 'Easy', bandRange: '5.5-6.5', attempted: true, score: '8.0' },
  { id: 'p10', title: 'Listening Section 2: Local Gallery Tour', skill: 'L', subType: 'Map Labeling', difficulty: 'Medium', bandRange: '6.0-7.0', attempted: false },
  { id: 'p11', title: 'Academic Reading: Marine Biology', skill: 'R', subType: 'Summary Completion', difficulty: 'Medium', bandRange: '6.5-7.5', attempted: false },
  { id: 'p13', title: 'Listening Section 3: Student Project', skill: 'L', subType: 'Multiple Choice (Multiple)', difficulty: 'Hard', bandRange: '7.0-8.5', attempted: false },
  { id: 'p14', title: 'Speaking Part 2: A Memorable Journey', skill: 'S', subType: 'Cue Card', difficulty: 'Medium', bandRange: '6.0-7.5', attempted: false },
  { id: 'p15', title: 'Academic Reading: AI in Healthcare', skill: 'R', subType: 'Matching Information', difficulty: 'Hard', bandRange: '7.5-9.0', attempted: false },
  { id: 'p17', title: 'General Training Reading: Health Policy', skill: 'R', subType: 'Sentence Completion', difficulty: 'Medium', bandRange: '6.0-7.0', attempted: false },
  { id: 'p18', title: 'Listening Section 4: Architecture History', skill: 'L', subType: 'Flow-chart Completion', difficulty: 'Hard', bandRange: '7.5-9.0', attempted: false },
  { id: 'p19', title: 'Speaking Part 3: Impact of Social Media', skill: 'S', subType: 'Abstract Discussion', difficulty: 'Hard', bandRange: '7.5-9.0', attempted: false },
  { id: 'p20', title: 'Academic Reading: Psychology of Play', skill: 'R', subType: 'List Selection', difficulty: 'Medium', bandRange: '6.5-7.5', attempted: false },
];

export const vocabularyWords: VocabularyWord[] = [
  { id: 'v1', word: 'Buoyant', group: 'Group 1', type: 'Adjective', englishMeaning: 'Able to float easily on water or another liquid.', banglaMeaning: 'পানি বা অন্য তরলের ওপর সহজে ভাসতে সক্ষম', sentence: 'Cork is buoyant in water.', sentenceBanglaMeaning: 'কর্ক পানিতে ভাসে।', masteryLevel: 0 },
  { id: 'v2', word: 'Granules', group: 'Group 1', type: 'Plural Noun', englishMeaning: 'Very small grains or pieces of a substance.', banglaMeaning: 'কোনো পদার্থের খুব ছোট দানা বা কণা', sentence: 'The cork is cut into small granules.', sentenceBanglaMeaning: 'কর্কটি ছোট ছোট দানায় কাটা হয়।', masteryLevel: 0 },
  { id: 'v3', word: 'Monopoly', group: 'Group 1', type: 'Noun', englishMeaning: 'Complete control of the supply or trade of a product or service.', banglaMeaning: 'কোনো পণ্য বা সেবার সরবরাহ বা বাণিজ্যের পূর্ণ নিয়ন্ত্রণ', sentence: 'One company has a monopoly on this product.', sentenceBanglaMeaning: 'একটি কোম্পানির এই পণ্যের ওপর একচেটিয়া নিয়ন্ত্রণ আছে।', masteryLevel: 0 },
  { id: 'v4', word: 'Arctophilist', group: 'Group 1', type: 'Noun', englishMeaning: 'A person who collects teddy bears.', banglaMeaning: 'টেডি বিয়ার সংগ্রহকারী ব্যক্তি', sentence: 'The arctophilist has many teddy bears.', sentenceBanglaMeaning: 'টেডি বিয়ার সংগ্রাহকের অনেক টেডি বিয়ার আছে।', masteryLevel: 0 },
  { id: 'v5', word: 'Deltiologist', group: 'Group 1', type: 'Noun', englishMeaning: 'A person who collects postcards.', banglaMeaning: 'পোস্টকার্ড সংগ্রহকারী ব্যক্তি', sentence: 'The deltiologist keeps old postcards.', sentenceBanglaMeaning: 'পোস্টকার্ড সংগ্রাহক পুরোনো পোস্টকার্ড রাখেন।', masteryLevel: 0 },
  { id: 'v6', word: 'Philatelist', group: 'Group 1', type: 'Noun', englishMeaning: 'A person who collects and studies postage stamps.', banglaMeaning: 'ডাকটিকিট সংগ্রহ ও অধ্যয়নকারী ব্যক্তি', sentence: 'The philatelist has stamps from many countries.', sentenceBanglaMeaning: 'ডাকটিকিট সংগ্রাহকের অনেক দেশের ডাকটিকিট আছে।', masteryLevel: 0 },
  { id: 'v7', word: 'Engrossing', group: 'Group 1', type: 'Adjective', englishMeaning: 'Very interesting and able to hold all your attention.', banglaMeaning: 'খুব আকর্ষণীয় এবং পুরো মনোযোগ ধরে রাখতে সক্ষম', sentence: 'The book is simple but engrossing.', sentenceBanglaMeaning: 'বইটি সহজ কিন্তু খুব আকর্ষণীয়।', masteryLevel: 0 },
  { id: 'v8', word: 'Eccentric', group: 'Group 1', type: 'Adjective / Noun', englishMeaning: 'Unusual or strange in behaviour; an unusual person.', banglaMeaning: 'আচরণে অস্বাভাবিক বা অদ্ভুত; অদ্ভুত ব্যক্তি', sentence: 'The eccentric man wears two hats.', sentenceBanglaMeaning: 'অদ্ভুত লোকটি দুটি টুপি পরে।', masteryLevel: 0 },
  { id: 'v9', word: 'Prosecution', group: 'Group 1', type: 'Noun', englishMeaning: 'The legal process of taking someone to court for a crime.', banglaMeaning: 'অপরাধের জন্য কাউকে আদালতে নেওয়ার আইনি প্রক্রিয়া', sentence: 'The case may lead to prosecution.', sentenceBanglaMeaning: 'মামলাটি আইনি বিচারের দিকে যেতে পারে।', masteryLevel: 0 },
  { id: 'v10', word: 'Codify', group: 'Group 1', type: 'Verb', englishMeaning: 'To arrange rules or laws into a clear, organised system.', banglaMeaning: 'নিয়ম বা আইনকে পরিষ্কার ও সুশৃঙ্খল ব্যবস্থায় সাজানো', sentence: 'The country will codify the new rules.', sentenceBanglaMeaning: 'দেশটি নতুন নিয়মগুলো বিধিবদ্ধ করবে।', masteryLevel: 0 },
  { id: 'v11', word: 'Scrutiny', group: 'Group 1', type: 'Noun', englishMeaning: 'Very careful and detailed examination.', banglaMeaning: 'খুব সতর্ক ও বিস্তারিত পরীক্ষা', sentence: 'The accounts came under scrutiny.', sentenceBanglaMeaning: 'হিসাবগুলো গভীর পরীক্ষার আওতায় আসে।', masteryLevel: 0 },
  { id: 'v12', word: 'Presumable', group: 'Group 1', type: 'Adjective', englishMeaning: 'Able to be reasonably supposed or believed.', banglaMeaning: 'যুক্তিসঙ্গতভাবে ধারণা করা যায় এমন', sentence: 'The presumable cause was heavy rain.', sentenceBanglaMeaning: 'ধারণা করা যায়, কারণটি ছিল ভারী বৃষ্টি।', masteryLevel: 0 },
  { id: 'v13', word: 'Articulate', group: 'Group 1', type: 'Verb / Adjective', englishMeaning: 'To express ideas clearly; able to speak clearly.', banglaMeaning: 'ভাবনা পরিষ্কারভাবে প্রকাশ করা; স্পষ্টভাবে কথা বলতে সক্ষম', sentence: 'He can articulate the problem clearly.', sentenceBanglaMeaning: 'সে সমস্যাটি পরিষ্কারভাবে ব্যাখ্যা করতে পারে।', masteryLevel: 0 },
  { id: 'v14', word: 'Entrenched', group: 'Group 1', type: 'Adjective', englishMeaning: 'Firmly established and difficult to change.', banglaMeaning: 'দৃঢ়ভাবে প্রতিষ্ঠিত এবং পরিবর্তন করা কঠিন', sentence: 'The old habit is deeply entrenched.', sentenceBanglaMeaning: 'পুরোনো অভ্যাসটি গভীরভাবে প্রতিষ্ঠিত।', masteryLevel: 0 },
  { id: 'v15', word: 'Prevalent', group: 'Group 1', type: 'Adjective', englishMeaning: 'Common or widespread in a particular place or time.', banglaMeaning: 'কোনো স্থান বা সময়ে সাধারণ বা ব্যাপক', sentence: 'Malaria is prevalent in some regions.', sentenceBanglaMeaning: 'কিছু অঞ্চলে ম্যালেরিয়া ব্যাপক।', masteryLevel: 0 },
  { id: 'v16', word: 'Alleviate', group: 'Group 1', type: 'Verb', englishMeaning: 'To make pain, difficulty, or a problem less severe.', banglaMeaning: 'ব্যথা, কষ্ট বা সমস্যা কমানো', sentence: 'This medicine can alleviate pain.', sentenceBanglaMeaning: 'এই ওষুধ ব্যথা কমাতে পারে।', masteryLevel: 0 },
  { id: 'v17', word: 'Subsidies', group: 'Group 1', type: 'Plural Noun', englishMeaning: 'Money given by a government or organisation to support an activity.', banglaMeaning: 'কোনো কাজকে সহায়তা করতে সরকার বা সংস্থার দেওয়া অর্থসাহায্য', sentence: 'Farmers receive government subsidies.', sentenceBanglaMeaning: 'কৃষকেরা সরকারি ভর্তুকি পান।', masteryLevel: 0 },
  { id: 'v18', word: 'Stranglehold', group: 'Group 1', type: 'Noun', englishMeaning: 'Very strong control that prevents freedom or competition.', banglaMeaning: 'এমন শক্ত নিয়ন্ত্রণ যা স্বাধীনতা বা প্রতিযোগিতা বাধাগ্রস্ত করে', sentence: 'The company has a stranglehold on the market.', sentenceBanglaMeaning: 'কোম্পানিটির বাজারের ওপর শক্ত নিয়ন্ত্রণ আছে।', masteryLevel: 0 },
  { id: 'v19', word: 'Contend', group: 'Group 1', type: 'Verb', englishMeaning: 'To argue or state that something is true.', banglaMeaning: 'কোনো কিছু সত্য বলে যুক্তি দেওয়া বা দাবি করা', sentence: 'Some experts contend that the plan will work.', sentenceBanglaMeaning: 'কিছু বিশেষজ্ঞ দাবি করেন যে পরিকল্পনাটি কাজ করবে।', masteryLevel: 0 },
  { id: 'v20', word: 'Mitigate', group: 'Group 1', type: 'Verb', englishMeaning: 'To make something harmful or unpleasant less severe.', banglaMeaning: 'ক্ষতিকর বা অপ্রীতিকর কিছু কম গুরুতর করা', sentence: 'Trees can mitigate city heat.', sentenceBanglaMeaning: 'গাছ শহরের তাপ কমাতে পারে।', masteryLevel: 0 },
];

export const mockTests: MockTest[] = [
  { id: 'm1', number: 1, dateTaken: '2026-05-10', overallBand: 6.5, scores: { L: 7.0, R: 6.5, W: 6.0, S: 6.5 }, status: 'attempted' },
  { id: 'm2', number: 2, dateTaken: '2026-05-18', overallBand: 6.5, scores: { L: 6.5, R: 7.0, W: 6.0, S: 7.0 }, status: 'attempted' },
  { id: 'm3', number: 3, dateTaken: null, overallBand: null, scores: null, status: 'not-attempted' },
  { id: 'm4', number: 4, dateTaken: null, overallBand: null, scores: null, status: 'not-attempted' },
  { id: 'm5', number: 5, dateTaken: null, overallBand: null, scores: null, status: 'not-attempted' },
  { id: 'm6', number: 6, dateTaken: null, overallBand: null, scores: null, status: 'not-attempted' },
];

export const dashboardData: DashboardData = {
  currentBand: 6.5,
  targetBand: 7.5,
  streak: 12,
  errorLog: [
    { id: 'e1', questionId: 'p1-q5', skill: 'R', errorType: 'Careless Mistake', date: '2026-05-24' },
    { id: 'e2', questionId: 'p2-q3', skill: 'L', errorType: 'Spelling', date: '2026-05-23' },
    { id: 'e3', questionId: 'p8-q1', skill: 'W', errorType: 'Grammar', date: '2026-05-22' },
  ],
  recentSessions: [
    { id: 's1', type: 'Practice Questions', duration: '45m', date: '2026-05-24' },
    { id: 's2', type: 'Video Lecture', duration: '15m', date: '2026-05-24' },
    { id: 's3', type: 'Vocabulary Review', duration: '20m', date: '2026-05-23' },
  ],
  practiceSchedule: [
    { id: 'sc1', day: 'Monday', task: 'Reading Practice (Matching Headings)', completed: true },
    { id: 'sc2', day: 'Tuesday', task: 'Listening Section 4 Practice', completed: true },
    { id: 'sc3', day: 'Wednesday', task: 'Writing Task 2 Essay', completed: false },
    { id: 'sc4', day: 'Thursday', task: 'Speaking Mock with AI', completed: false },
    { id: 'sc5', day: 'Friday', task: 'Mock Test 3', completed: false },
  ],
};

export const studyPlan: StudyPlan = {
  tier: '1-Month Balanced',
  startDate: '2026-05-01',
  examDate: '2026-06-01',
  todayTasks: [
    { id: 't-1', title: 'Complete Reading Passage 3', feature: 'PRACTICE', estimatedTime: '20m', isPrimary: true },
    { id: 't-2', title: 'Mastering Multiple Choice', feature: 'VIDEO', estimatedTime: '15m', isPrimary: false },
    { id: 't-3', title: 'Technology Vocabulary Review', feature: 'VOCAB', estimatedTime: '10m', isPrimary: true },
    { id: 't-4', title: 'Mock Test 2 Review', feature: 'MOCK', estimatedTime: '45m', isPrimary: false },
  ],
  days: [
    {
      dayNumber: 25,
      tasks: [
        { id: 't1', title: 'Complete Reading Passage 3', skill: 'R', duration: '20m', completed: true },
        { id: 't2', title: 'Review Academic Vocabulary', skill: 'General', duration: '15m', completed: false },
        { id: 't3', title: 'Practice Speaking Part 2', skill: 'S', duration: '10m', completed: false },
      ],
    },
  ],
};

export const ieltsEssays = [
  { 
    id: 'T2-1', 
    title: 'The Impact of Social Media on Modern Communication',
    content: 'Social media has fundamentally transformed the way humans interact and communicate in the twenty-first century. While it has bridged geographical divides and allowed for instantaneous exchange of ideas, some critics argue that it has simultaneously eroded the depth and quality of personal relationships. In this essay, I will discuss both the positive and negative implications of this digital shift, ultimately arguing that the benefits of connectivity outweigh the drawbacks of social isolation.'
  },
  { 
    id: 'T2-2', 
    title: 'Economic Growth vs. Environmental Protection',
    content: 'The tension between economic development and environmental sustainability remains one of the most pressing challenges of our time. Many developing nations prioritize industrial expansion to alleviate poverty, often at the expense of ecological health. Conversely, developed countries advocate for stringent regulations to combat climate change. This essay will examine whether it is possible to achieve a balance where economic prosperity does not necessitate the destruction of our natural world.'
  },
  { 
    id: 'T2-3', 
    title: 'The Role of Government in Public Healthcare',
    content: 'The question of whether healthcare should be a universal right provided by the state or a private service determined by market forces is a subject of intense debate. Proponents of public healthcare argue that a nations health is a collective responsibility that ensures equity for all citizens. On the other hand, advocates of privatization believe that competition leads to better quality and innovation. This essay will explore the various models of healthcare delivery and their impact on societal well-being.'
  },
  { 
    id: 'T2-4', 
    title: 'Online Learning vs. Traditional Classrooms',
    content: 'The rapid advancement of digital technology has ushered in a new era of education, characterized by the rise of online learning platforms. Many students now prefer the flexibility and accessibility of virtual classrooms over the traditional brick-and-mortar experience. However, skeptics maintain that the lack of physical interaction and the potential for distractions can hinder the learning process. This essay will compare both methods and argue that a hybrid approach is the most effective solution for future education.'
  },
  { 
    id: 'T1-1', 
    title: 'Data Analysis: Global Smartphone Adoption 2010-2025',
    content: 'The provided data illustrates the exponential growth in smartphone adoption across different continents between 2010 and 2025. In the early stages, North America and Europe led the market, accounting for over sixty percent of total users. However, by 2020, Asian markets saw a dramatic surge, surpassing all other regions combined. This trend is expected to continue as infrastructure improves in developing nations, leading to near-total global connectivity by the end of the forecast period.'
  },
  { 
    id: 'T1-2', 
    title: 'Process Diagram: The Hydrological Cycle',
    content: 'The hydrological cycle, more commonly known as the water cycle, describes the continuous movement of water on, above, and below the surface of the Earth. The process begins with evaporation, where solar energy heats water in oceans and lakes, turning it into vapor. This vapor then rises into the atmosphere, where it cools and condenses into clouds. Finally, precipitation occurs in the form of rain or snow, returning the water to the Earths surface to begin the cycle anew.'
  },
];
