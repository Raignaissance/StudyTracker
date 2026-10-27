import styles from "./styles";
import type { MaterialSource, PlayMode, StudyMaterial } from "./types";

const SOURCE_LABEL: Record<MaterialSource, string> = {
  document: "PDF",
  text: "Text",
  topic: "Topic",
};

type Props = {
  materials: StudyMaterial[];
  onPlay: (id: string, mode: PlayMode) => void;
};

export default function StudyHistory({ materials, onPlay }: Props) {
  return (
    <section className={styles.card} aria-labelledby="history-heading">
      <h2 id="history-heading" className={styles.cardTitle}>
        Your study materials
      </h2>

      {materials.length === 0 ? (
        <p className={styles.empty}>
          No materials yet. Upload a PDF, paste text, or type a topic above to make your first quiz.
        </p>
      ) : (
        <ul className={styles.historyList}>
          {materials.map((m) => (
            <li key={m.id} className={styles.historyItem}>
              <div className={styles.historyInfo}>
                <p className={styles.historyTitle}>{m.title}</p>
                <p className={styles.muted}>
                  <span className={styles.badge}>{SOURCE_LABEL[m.source]}</span> {m.questionCount} questions,{" "}
                  {m.processedLabel}
                </p>
              </div>
              <div className={styles.historyActions}>
                <button type="button" className={styles.secondaryButton} onClick={() => onPlay(m.id, "solo")}>
                  Play solo
                </button>
                <button type="button" className={styles.smallPrimary} onClick={() => onPlay(m.id, "party")}>
                  Host party
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
