"use client";

import { useState } from "react";
import styles from "./styles";
import type { PlannerTask } from "./types";

type Props = { initialTasks: PlannerTask[] };

export default function PlannerTracker({ initialTasks }: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [draft, setDraft] = useState("");

  const doneCount = tasks.filter((t) => t.done).length;
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  function addTask() {
    const title = draft.trim();
    if (!title) return;
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), title, dueLabel: "Today", done: false }]);
    setDraft("");
  }

  function toggle(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function remove(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <section className={styles.card} aria-labelledby="planner-heading">
      <div className={styles.cardHeader}>
        <h2 id="planner-heading" className={styles.cardTitle}>
          Study planner
        </h2>
        <p className={styles.muted}>
          {doneCount} of {tasks.length} done
        </p>
      </div>

      <div
        className={styles.progress}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Planner progress"
      >
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>

      {tasks.length === 0 ? (
        <p className={styles.empty}>Nothing planned yet. Add your first study task below.</p>
      ) : (
        <ul className={styles.taskList}>
          {tasks.map((t) => (
            <li key={t.id} className={styles.task}>
              <label className={styles.taskLabel}>
                <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
                <span className={t.done ? styles.taskDone : undefined}>{t.title}</span>
              </label>
              <span className={styles.taskDue}>{t.dueLabel}</span>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => remove(t.id)}
                aria-label={`Remove ${t.title}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.addRow}>
        <label htmlFor="new-task" className={styles.srOnly}>
          New study task
        </label>
        <input
          id="new-task"
          className={styles.textInput}
          placeholder="Add a task…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button type="button" className={styles.secondaryButton} onClick={addTask}>
          Add task
        </button>
      </div>
    </section>
  );
}
