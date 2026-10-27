import styles from "./styles";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

type Props = {
  currentStreak: number;
  bestStreak: number;
  /** Monday → Sunday. true = studied that day */
  week: boolean[];
  /** 0 = Monday … 6 = Sunday */
  todayIndex: number;
};

export default function StreakTracker({ currentStreak, bestStreak, week, todayIndex }: Props) {
  return (
    <section className={styles.card} aria-labelledby="streak-heading">
      <h2 id="streak-heading" className={styles.cardTitle}>
        Study streak
      </h2>

      <div className={styles.streakHero}>
        <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2c1 4-3 5.5-3 9.5a3 3 0 0 0 6 0c0-1-.4-1.8-1-2.5 2.8 1.2 5 3.7 5 7A7 7 0 0 1 5 16c0-5 5-6.5 7-14Z"
            fill="var(--coral)"
          />
        </svg>
        <p className={styles.streakNumber}>
          {currentStreak}
          <span className={styles.streakUnit}>{currentStreak === 1 ? " day" : " days"}</span>
        </p>
      </div>
      <p className={styles.muted}>Best: {bestStreak} days</p>

      <ol className={styles.week} aria-label="This week">
        {DAYS.map((d, i) => (
          <li
            key={i}
            className={`${styles.day} ${week[i] ? styles.dayDone : ""} ${i === todayIndex ? styles.dayToday : ""}`}
          >
            <span>{d}</span>
            <span className={styles.srOnly}>
              {week[i] ? "studied" : i > todayIndex ? "upcoming" : "missed"}
              {i === todayIndex ? ", today" : ""}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
