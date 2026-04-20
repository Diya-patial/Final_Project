import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { getDeployments, getHealthMetrics, getLogs } from "../services/api";

const chartDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusClasses = {
  success: "statusSuccess",
  failed: "statusFailed",
  pending: "statusPending",
  "in-progress": "statusProgress",
};

function Badge({ status }) {
  const statusClass = statusClasses[status] || "statusPending";

  return (
    <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
      <span className={styles.statusDot} />
      {status}
    </span>
  );
}

function CircleMetric({ label, value, colorClass }) {
  const safeValue = Math.max(0, Math.min(Number(value) || 0, 100));

  return (
    <div className={styles.circleCard}>
      <div
        className={`${styles.circleWrap} ${styles[colorClass]}`}
        style={{ "--progress": `${safeValue}%` }}
      >
        <div className={styles.circleInner}>
          <span className={styles.circleValue}>{safeValue}%</span>
        </div>
      </div>
      <p className={styles.circleLabel}>{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const [deployments, setDeployments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [latestHealth, setLatestHealth] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const deploymentsRes = await getDeployments();
        const healthRes = await getHealthMetrics();
        const logsRes = await getLogs();

        const deploymentData = deploymentsRes.data;
        const healthData = healthRes.data;
        const logData = logsRes.data;

        setDeployments(deploymentData);
        setLogs(logData);

        const latestMetric =
          Array.isArray(healthData) && healthData.length > 0
            ? healthData[0]
            : null;

        setLatestHealth(latestMetric);

        const countsByDay = [0, 0, 0, 0, 0, 0, 0];

        deploymentData.forEach((item) => {
          const date = new Date(item.createdAt || item.deployedAt);
          countsByDay[date.getDay()] += 1;
        });

        const maxCount = Math.max(...countsByDay, 1);

        const weeklyData = chartDays.map((day, index) => ({
          day,
          count: countsByDay[index],
          height: `${Math.max((countsByDay[index] / maxCount) * 100, 8)}%`,
        }));

        setChartData(weeklyData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const successCount = deployments.filter(
    (item) => item.status === "success",
  ).length;
  const failedCount = deployments.filter(
    (item) => item.status === "failed",
  ).length;

  const successRate = deployments.length
    ? `${((successCount / deployments.length) * 100).toFixed(1)}%`
    : "0%";

  const avgDuration = deployments.length
    ? `${Math.round(
        deployments.reduce((sum, item) => sum + (item.duration || 0), 0) /
          deployments.length,
      )} sec`
    : "0 sec";

  const activeServices = new Set(deployments.map((item) => item.serviceName))
    .size;

  const stats = [
    { label: "Total Deployments", value: String(deployments.length) },
    { label: "Success Rate", value: successRate },
    { label: "Avg Deploy Time", value: avgDuration },
    { label: "Active Services", value: String(activeServices) },
  ];

  const healthCards = latestHealth
    ? [
        {
          label: "CPU Usage",
          value: latestHealth.cpuUsage || 0,
          colorClass: "cpuCircle",
        },
        {
          label: "Memory Usage",
          value: latestHealth.memoryUsage || 0,
          colorClass: "memoryCircle",
        },
      ]
    : [];

  const liveMetrics = latestHealth
    ? [
        { name: "Active Deploys", value: latestHealth.activeDeploys || 0 },
        { name: "Critical Errors", value: latestHealth.criticalErrors || 0 },
        { name: "Health Status", value: latestHealth.status || "stable" },
        { name: "Total Logs", value: logs.length },
      ]
    : [];

  const recentActivity = deployments.slice(0, 5);

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Loading dashboard...</p>
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
        <div className={styles.headerLeft}>
          <div className={styles.liveRow}>
            <span className={styles.liveDot} />
            <span className={styles.liveText}>LIVE</span>
            <span className={styles.headerSub}>System Overview</span>
          </div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Real-time deployments, health metrics, and logs
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((item) => (
          <div key={item.label} className={styles.statCard}>
            <div className={styles.statTop}>
              <span className={styles.statLabel}>{item.label}</span>
            </div>
            <div className={styles.statValue}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.midGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Deployments</h2>
            <p className={styles.panelSub}>Real data by weekday</p>
          </div>

          <div className={styles.chartWrap}>
            <div className={styles.chartBars}>
              {chartData.map((item) => (
                <div key={item.day} className={styles.barCol}>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.bar}
                      style={{ height: item.height }}
                    />
                  </div>
                  <span className={styles.barLabel}>{item.day}</span>
                  <span className={styles.barCount}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>CPU & Memory</h2>
            <p className={styles.panelSub}>Live usage indicators</p>
          </div>

          <div className={styles.circleMetricsGrid}>
            {healthCards.map((item) => (
              <CircleMetric
                key={item.label}
                label={item.label}
                value={item.value}
                colorClass={item.colorClass}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Live Metrics</h2>
            <p className={styles.panelSub}>Current backend values</p>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          {liveMetrics.map((item) => (
            <div key={item.name} className={styles.metricCard}>
              <span className={styles.metricName}>{item.name}</span>
              <span className={styles.metricValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Recent Activity</h2>
            <p className={styles.panelSub}>
              Latest pipeline runs | Failed: {failedCount}
            </p>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Service</th>
                <th>Environment</th>
                <th>Status</th>
                <th>Commit</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((row) => (
                <tr key={row._id} className={styles.tableRow}>
                  <td className={styles.tdService}>{row.serviceName}</td>
                  <td className={styles.tdMuted}>{row.environment}</td>
                  <td>
                    <Badge status={row.status} />
                  </td>
                  <td className={styles.tdCommit}>{row.commitId || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className={styles.panelSub}>Total logs: {logs.length}</p>
      </div>
    </div>
  );
}
