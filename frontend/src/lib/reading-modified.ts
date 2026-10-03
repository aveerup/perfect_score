export const GAP_MARKER = "{<gap>}";
export const READING_MODIFIED_PREFIX = "reading-modified-";

export type PassageComponent = {
  id: string;
  type: "passage";
  markdown: string;
};

export type FillGapQuestion = {
  id: string;
  text: string;
  answer: string;
};

export type FillGapsComponent = {
  id: string;
  type: "fillGaps";
  heading: string;
  answerEnabled: boolean;
  questions: FillGapQuestion[];
};

export type McqOption = {
  id: string;
  text: string;
};

export type McqQuestion = {
  id: string;
  text: string;
  options: McqOption[];
  correctOptionId: string;
};

export type McqComponent = {
  id: string;
  type: "mcq";
  heading: string;
  answerEnabled: boolean;
  questions: McqQuestion[];
};

export type CompleteSentenceQuestion = {
  id: string;
  text: string;
  correctEndingId: string;
};

export type SentenceEnding = {
  id: string;
  text: string;
};

export type CompleteSentenceComponent = {
  id: string;
  type: "completeSentence";
  heading: string;
  answerEnabled: boolean;
  questions: CompleteSentenceQuestion[];
  endings: SentenceEnding[];
};

export type ReadingComponent = PassageComponent | FillGapsComponent | McqComponent | CompleteSentenceComponent;
export type ReadingQuestionComponent = Exclude<ReadingComponent, PassageComponent>;

export type ReadingPart = {
  id: string;
  number: number | null;
  passage: PassageComponent | null;
  sections: { component: ReadingQuestionComponent; startNumber: number }[];
  questions: { id: string; number: number }[];
};

export type ReadingSet = {
  id: string;
  title: string;
  components: ReadingComponent[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReadingImage = {
  id: string;
  filename: string;
  url: string;
  createdAt: string;
};

export type ReadingResult = {
  practiceId: string;
  title: string;
  skill: "R";
  scoringMode: "basic" | "saved";
  score: null;
  rawScore: { correct: number; total: number } | null;
  gradedAnswers: { questionId: string; number: number; isCorrect: boolean }[];
  answered: number;
  questionCount: number;
};

export function totalQuestions(components: ReadingComponent[]): number {
  return components.reduce(
    (count, component) => count + (component.type === "passage" ? 0 : component.questions.length),
    0,
  );
}

export function groupReadingParts(components: ReadingComponent[]): ReadingPart[] {
  const parts: ReadingPart[] = [];
  let currentPart: ReadingPart | null = null;
  let passageNumber = 0;
  let questionNumber = 0;

  for (const component of components) {
    if (component.type === "passage") {
      passageNumber += 1;
      currentPart = {
        id: component.id,
        number: passageNumber,
        passage: component,
        sections: [],
        questions: [],
      };
      parts.push(currentPart);
      continue;
    }

    // Keep older sets with questions before their first passage usable.
    if (!currentPart) {
      currentPart = {
        id: "questions-before-first-passage",
        number: null,
        passage: null,
        sections: [],
        questions: [],
      };
      parts.push(currentPart);
    }

    currentPart.sections.push({ component, startNumber: questionNumber });
    for (const question of component.questions) {
      questionNumber += 1;
      currentPart.questions.push({ id: question.id, number: questionNumber });
    }
  }

  return parts;
}

export function letterLabel(index: number): string {
  let value = index + 1;
  let label = "";
  while (value > 0) {
    value -= 1;
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26);
  }
  return label;
}
