"use client";

import { useState } from "react";
import styles from "./styles";
import StudyMaterialInput from "./StudyMaterialInput";
import StreakTracker from "./StreakTracker";
import PlannerTracker from "./PlannerTracker";
import StudyHistory from "./StudyHistory";
import type {
  MaterialSubmission,
  PlannerTask,
  PlayMode,
  StudyMaterial,
} from "./types";

// ---- Mock data: replace with real data once the backend exists ----
const MOCK_MATERIALS: StudyMaterial[] = [
  { id: "m1", title: "Cell Biology, Chapter 4.pdf", source: "document", questionCount: 20, processedLabel: "Yesterday" },
  { id: "m2", title: "The causes of World War I", source: "topic", questionCount: 10, processedLabel: "2 days ago" },
];

const MOCK_TASKS: PlannerTask[] = [
  { id: "t1", title: "Review Chapter 4 quiz mistakes", dueLabel: "Today", done: false },
  { id: "t2", title: "Make flashcards for Chapter 5", dueLabel: "Thu", done: false },
  { id: "t3", title: "Finish practice problems", dueLabel: "Today", done: true },
];

export default function DashboardPage() {
  console.log(styles);
  const [materials, setMaterials] = useState<StudyMaterial[]>(MOCK_MATERIALS);

  async function handleSubmit(submission: MaterialSubmission) {
    // TODO: send `submission` to your API route (e.g. POST /api/generate-quiz)
    await new Promise((r) => setTimeout(r, 1200)); // fake AI delay

    const title =
      submission.source === "document"
        ? submission.file.name
        : submission.source === "topic"
        ? submission.topic
        : submission.text.slice(0, 40).trim() + "…";

    setMaterials((prev) => [
      { id: crypto.randomUUID(), title, source: submission.source, questionCount: 10, processedLabel: "Just now" },
      ...prev,
    ]);
  }

  function handlePlay(id: string, mode: PlayMode) {
    // TODO: route to the game lobby, e.g. router.push(`/play/${id}?mode=${mode}`)
    console.log("Play", id, mode);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.brand}>StudyStreak</h1>
        <p className={styles.muted}>Turn your notes into a game night.</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <StudyMaterialInput onSubmit={handleSubmit} />
          <StudyHistory materials={materials} onPlay={handlePlay} />
        </div>
        <aside className={styles.sideCol}>
          <StreakTracker currentStreak={5} bestStreak={12} week={[true, true, true, true, true, false, false]} todayIndex={4} />
          <PlannerTracker initialTasks={MOCK_TASKS} />
        </aside>
      </div>
    </main>
  );
}