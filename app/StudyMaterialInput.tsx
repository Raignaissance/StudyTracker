"use client";

import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import styles from "./styles";
import type { MaterialSource, MaterialSubmission } from "./types";

const MAX_MB = 10;
const MIN_TEXT_CHARS = 50;

const TABS: { id: MaterialSource; label: string }[] = [
  { id: "document", label: "Upload file" },
  { id: "text", label: "Paste text" },
  { id: "topic", label: "Type a topic" },
];

type Props = {
  onSubmit: (submission: MaterialSubmission) => Promise<void>;
};

export default function StudyMaterialInput({ onSubmit }: Props) {
  const [tab, setTab] = useState<MaterialSource>("document");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function pickFile(f: File | undefined) {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("That file isn't a PDF. Choose a .pdf file.");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`That PDF is over ${MAX_MB} MB. Try a smaller file or split it.`);
      return;
    }
    setError(null);
    setFile(f);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  }

  // Arrow keys move between tabs (standard tablist behavior)
  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    setError(null);
    document.getElementById(`tab-${TABS[next].id}`)?.focus();
  }

  function buildSubmission(): MaterialSubmission | null {
    if (tab === "document") {
      if (!file) return setError("Add a PDF to continue."), null;
      return { source: "document", file };
    }
    if (tab === "text") {
      if (text.trim().length < MIN_TEXT_CHARS)
        return setError(`Paste at least ${MIN_TEXT_CHARS} characters so the quiz has something to work with.`), null;
      return { source: "text", text: text.trim() };
    }
    if (topic.trim().length < 3) return setError("Enter a topic, like “photosynthesis”."), null;
    return { source: "topic", topic: topic.trim() };
  }

  async function handleSubmit() {
    const submission = buildSubmission();
    if (!submission) return;
    setError(null);
    setLoading(true);
    try {
      await onSubmit(submission);
      setFile(null);
      setText("");
      setTopic("");
    } catch {
      setError("Quiz generation failed. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.inputCard} aria-labelledby="input-heading">
      <h2 id="input-heading" className={styles.inputTitle}>
        What are you studying?
      </h2>
      <p className={styles.inputHint}>Give the AI your material and it turns it into quiz questions.</p>

      <div role="tablist" aria-label="Study material source" className={styles.tabs}>
        {TABS.map((t, i) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            className={styles.tab}
            onClick={() => {
              setTab(t.id);
              setError(null);
            }}
            onKeyDown={(e) => onTabKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className={styles.panel}>
        {tab === "document" && (
          <div
            className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <input
              ref={fileInput}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            {file ? (
              <>
                <p className={styles.fileName}>{file.name}</p>
                <p className={styles.fileMeta}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button type="button" className={styles.linkButton} onClick={() => setFile(null)}>
                  Remove file
                </button>
              </>
            ) : (
              <>
                <p className={styles.dropTitle}>Drop your PDF here</p>
                <p className={styles.fileMeta}>PDF only, up to {MAX_MB} MB</p>
                <button type="button" className={styles.secondaryButton} onClick={() => fileInput.current?.click()}>
                  Browse files
                </button>
              </>
            )}
          </div>
        )}

        {tab === "text" && (
          <>
            <label htmlFor="material-text" className={styles.srOnly}>
              Study text
            </label>
            <textarea
              id="material-text"
              className={styles.textarea}
              rows={8}
              placeholder="Paste your notes, a chapter, or an article…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className={styles.counter}>{text.length.toLocaleString()} characters</p>
          </>
        )}

        {tab === "topic" && (
          <>
            <label htmlFor="material-topic" className={styles.srOnly}>
              Topic
            </label>
            <input
              id="material-topic"
              className={styles.textInput}
              type="text"
              placeholder="e.g. The causes of World War I"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <p className={styles.counter}>The AI writes questions from what it knows about the topic.</p>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <button type="button" className={styles.primaryButton} onClick={handleSubmit} disabled={loading}>
        {loading ? "Generating quiz…" : "Generate quiz"}
      </button>
    </section>
  );
}
