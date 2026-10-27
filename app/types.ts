export type MaterialSource = "document" | "text" | "topic";

export type MaterialSubmission =
  | { source: "document"; file: File }
  | { source: "text"; text: string }
  | { source: "topic"; topic: string };

export type StudyMaterial = {
  id: string;
  title: string;
  source: MaterialSource;
  questionCount: number;
  processedLabel: string; // e.g. "Today", "Yesterday"
};

export type PlannerTask = {
  id: string;
  title: string;
  dueLabel: string; // e.g. "Today", "Fri"
  done: boolean;
};

export type PlayMode = "party" | "solo";
