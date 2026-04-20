import { useEffect, useRef, useState } from "react";
import styles from "./Logs.module.css";
import { getLogs } from "../services/api";

const levelClasses = {
  info: "infoLevel",
  debug: "debugLevel",
  warning: "warnLevel",
  error: "errorLevel",
};

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    async function loadLogs() {
      try {
        const response = await getLogs();
        setLogs(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, []);

  useEffect(() => {
    if (isLive) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isLive]);

  const services = [
    "ALL",
    ...Array.from(new Set(logs.map((item) => item.service).filter(Boolean))),
  ];

  const filtered = logs.filter((item) => {
    const level = (item.level || "").toLowerCase();
    const service = (item.service || "").toLowerCase();
    const message = (item.message || "").toLowerCase();
    const searchValue = search.toLowerCase();

    return (
      (levelFilter === "ALL" || level === levelFilter.toLowerCase()) &&
      (serviceFilter === "ALL" || item.service === serviceFilter) &&
      (!searchValue ||
        message.includes(searchValue) ||
        service.includes(searchValue))
    );
  });

  const counts = {
    info: 0,
    debug: 0,
    warning: 0,
    error: 0,
  };

  logs.forEach((item) => {
    const level = (item.level || "").toLowerCase();
    if (counts[level] !== undefined) {
      counts[level] += 1;
    }
  });

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Loading logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.liveRow}>
            <span
              className={`${styles.liveDot} ${isLive ? styles.liveActive : ""}`}
            />
            <span className={styles.liveText}>ACTIVITY STREAM</span>
          </div>
          <h1 className={styles.title}>Logs</h1>
          <p className={styles.subtitle}>
            {filtered.length} entries | {logs.length} total
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            onClick={() => setIsLive((value) => !value)}
            className={`${styles.liveBtn} ${isLive ? styles.liveBtnActive : ""}`}
          >
            {isLive ? "Live" : "Paused"}
          </button>
        </div>
      </div>

      <div className={styles.levelBadges}>
        {Object.entries(counts).map(([level, count]) => {
          const levelClass = levelClasses[level] || "infoLevel";
          const isActive = levelFilter.toLowerCase() === level;

          return (
            <button
              key={level}
              onClick={() =>
                setLevelFilter(isActive ? "ALL" : level.toUpperCase())
              }
              className={`${styles.levelBadge} ${styles[levelClass]} ${isActive ? styles.levelBadgeActive : ""}`}
            >
              <span className={styles.levelCount}>{count}</span>
              <span className={styles.levelLabel}>{level.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search logs by message or service..."
            className={styles.searchInput}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch("")}>
              X
            </button>
          )}
        </div>

        <select
          value={serviceFilter}
          onChange={(event) => setServiceFilter(event.target.value)}
          className={styles.select}
        >
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.terminal}>
        <div className={styles.termBar}>
          <div className={styles.termDots}>
            <span className={styles.termDotRed} />
            <span className={styles.termDotYellow} />
            <span className={styles.termDotGreen} />
          </div>
          <span className={styles.termTitle}>
            logs/stream | {filtered.length} lines
          </span>
          <span className={styles.termStatus}>
            {isLive ? "streaming" : "paused"}
          </span>
        </div>

        <div className={styles.logLines}>
          {filtered.map((log) => {
            const level = (log.level || "info").toLowerCase();
            const levelClass = levelClasses[level] || "infoLevel";

            return (
              <div key={log._id} className={styles.logRow}>
                <span className={styles.logTime}>
                  {new Date(
                    log.timestamp || log.createdAt,
                  ).toLocaleTimeString()}
                </span>

                <span className={`${styles.logLevel} ${styles[levelClass]}`}>
                  {level.toUpperCase()}
                </span>

                <span className={styles.logService}>
                  [{log.service || "unknown"}]
                </span>

                <span className={styles.logMsg}>{log.message}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
