import { useEffect, useState } from "react";
import styles from "./Deployments.module.css";
import { VscServerProcess } from "react-icons/vsc";
import { getDeployments } from "../services/api";

const filters = ["All", "Success", "In-Progress", "Failed", "Pending"];

const statusClasses = {
  success: "statusSuccess",
  failed: "statusFailed",
  pending: "statusPending",
  "in-progress": "statusProgress",
};

const envClasses = {
  production: "envProduction",
  staging: "envStaging",
  development: "envDevelopment",
};

export default function Deployments() {
  const [deploymentsData, setDeploymentsData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDeployments() {
      try {
        const response = await getDeployments();
        setDeploymentsData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDeployments();
  }, []);

  const filtered = deploymentsData.filter((item) => {
    if (activeFilter === "All") return true;
    return item.status === activeFilter.toLowerCase();
  });

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Loading deployments...</p>
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
            <span className={styles.liveDot} />
            <span className={styles.liveText}>PIPELINE</span>
          </div>
          <h1 className={styles.title}>Deployments</h1>
          <p className={styles.subtitle}>
            {deploymentsData.length} total |{" "}
            {deploymentsData.filter((d) => d.status === "in-progress").length}{" "}
            running now
          </p>
        </div>
      </div>

      <div className={styles.statsRow}>
        {[
          {
            label: "Total",
            value: deploymentsData.length,
            tone: styles.totalTone,
          },
          {
            label: "Success",
            value: deploymentsData.filter((d) => d.status === "success").length,
            tone: styles.successTone,
          },
          {
            label: "Running",
            value: deploymentsData.filter((d) => d.status === "in-progress")
              .length,
            tone: styles.runningTone,
          },
          {
            label: "Failed",
            value: deploymentsData.filter((d) => d.status === "failed").length,
            tone: styles.failedTone,
          },
        ].map((item) => (
          <div key={item.label} className={styles.statPill}>
            <span className={`${styles.statDot} ${item.tone}`} />
            <span className={styles.statLabel}>{item.label}</span>
            <span className={styles.statValue}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.filters}>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterActive : ""}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map((dep) => {
          const isExpanded = expanded === dep._id;
          const statusClass = statusClasses[dep.status] || "statusPending";
          const envClass = envClasses[dep.environment] || "envDevelopment";

          return (
            <div
              key={dep._id}
              className={`${styles.card} ${isExpanded ? styles.cardOpen : ""}`}
              onClick={() => setExpanded(isExpanded ? null : dep._id)}
            >
              <div className={styles.row}>
                <div className={styles.serviceCol}>
                  <div className={styles.serviceName}>
                    <VscServerProcess className={styles.serviceIcon} />
                    {dep.serviceName}
                  </div>
                  <div className={styles.serviceVersion}>
                    {dep.version || "N/A"}
                  </div>
                </div>

                <div className={styles.branchCol}>
                  <span className={styles.branch}>
                    {dep.region || "default-region"}
                  </span>
                  <span className={styles.commit}>{dep.commitId || "N/A"}</span>
                </div>

                <span className={`${styles.envBadge} ${styles[envClass]}`}>
                  {dep.environment}
                </span>

                <span
                  className={`${styles.statusBadge} ${styles[statusClass]}`}
                >
                  <span className={styles.statusDot} />
                  {dep.status}
                </span>

                <span className={styles.time}>
                  {new Date(dep.deployedAt || dep.createdAt).toLocaleString()}
                </span>

                <span
                  className={`${styles.arrow} ${isExpanded ? styles.arrowOpen : ""}`}
                >
                  ▼
                </span>
              </div>

              {isExpanded && (
                <div className={styles.expandedWrap}>
                  <div className={styles.expandedMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaKey}>Owner</span>
                      <span className={styles.metaVal}>
                        {dep.owner || "N/A"}
                      </span>
                    </div>

                    <div className={styles.metaItem}>
                      <span className={styles.metaKey}>Duration</span>
                      <span className={styles.metaVal}>
                        {dep.duration ? `${dep.duration} sec` : "N/A"}
                      </span>
                    </div>

                    <div className={styles.metaItem}>
                      <span className={styles.metaKey}>Run ID</span>
                      <span className={styles.metaId}>{dep._id}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
