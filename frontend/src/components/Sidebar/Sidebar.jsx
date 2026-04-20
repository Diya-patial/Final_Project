import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { VscServerProcess } from "react-icons/vsc";
import { BsTerminal } from "react-icons/bs";
import { TbLayoutDashboard } from "react-icons/tb";
import { getMe } from "../../services/api";
import styles from "./Sidebar.module.css";

const links = [
  {
    to: "/dashboard",
    icon: <MdOutlineSpaceDashboard />,
    label: "Dashboard",
    sub: "Overview",
  },
  {
    to: "/deployments",
    icon: <VscServerProcess />,
    label: "Deployments",
    sub: "Pipeline",
  },
  {
    to: "/logs",
    icon: <BsTerminal />,
    label: "Logs",
    sub: "Activity",
  },
];

function Sidebar({ expanded, setExpanded }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setExpanded(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setExpanded]);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await getMe();
        setCurrentUser(res.data.user);
      } catch (error) {
        setCurrentUser(null);
      }
    }

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (isMobile && expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, expanded]);

  const isDrawerOpen = isMobile && expanded;
  const avatarText = currentUser?.username
    ? currentUser.username.slice(0, 2).toUpperCase()
    : "KS";

  return (
    <>
      {isDrawerOpen && (
        <div className={styles.overlay} onClick={() => setExpanded(false)} />
      )}

      <aside
        className={[
          styles.sidebar,
          isMobile ? styles.mobile : "",
          isMobile
            ? expanded
              ? styles.mobileOpen
              : styles.mobileClosed
            : expanded
              ? styles.expanded
              : styles.collapsed,
        ].join(" ")}
      >
        <div className={styles.gradientEdge} />

        <button
          className={styles.toggleBtn}
          onClick={() => setExpanded(!expanded)}
          title={expanded ? "Collapse" : "Expand"}
        >
          <span
            className={`${styles.toggleIcon} ${expanded ? styles.rotated : ""}`}
          >
            ›
          </span>
        </button>

        <div
          className={`${styles.logo} ${!expanded ? styles.logoCentered : ""}`}
        >
          <div className={styles.logoMark}>
            <TbLayoutDashboard className={styles.logoIcon} />
          </div>
          {expanded && (
            <div className={styles.logoText}>
              <p className={styles.logoName}>DevOps</p>
              <p className={styles.logoSub}>Control Panel</p>
            </div>
          )}
        </div>

        <div className={styles.divider} />
        {expanded && <p className={styles.sectionLabel}>Navigation</p>}

        <nav className={styles.nav}>
          {links.map(({ to, icon, label, sub }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              title={!expanded ? label : ""}
              onClick={() => isMobile && setExpanded(false)}
            >
              <span className={styles.linkIcon}>{icon}</span>
              {expanded && (
                <div className={styles.linkText}>
                  <span className={styles.linkLabel}>{label}</span>
                  <span className={styles.linkSub}>{sub}</span>
                </div>
              )}
              {expanded && <span className={styles.linkArrow}>›</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {expanded && (
          <div className={styles.statusBox}>
            <div className={styles.statusRow}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>All Systems Nominal</span>
            </div>
            <div className={styles.statusBar}>
              <div className={styles.statusFill} />
            </div>
            <p className={styles.statusMeta}>Uptime — 99.98%</p>
          </div>
        )}

        {!expanded && (
          <div className={styles.collapsedStatus}>
            <span className={styles.statusDot} />
          </div>
        )}

        <div className={styles.divider} />

        <div
          className={styles.user}
          title={!expanded ? currentUser?.username || "User" : ""}
        >
          <div className={styles.avatar}>{avatarText}</div>
          {expanded && (
            <div style={{ flex: 1, overflow: "hidden" }}>
              <p className={styles.userName}>
                {currentUser?.username || "Karan S."}
              </p>
              <p className={styles.userRole}>
                {currentUser?.email || "Frontend Dev"}
              </p>
            </div>
          )}
          {expanded && <span className={styles.userMenu}>⋯</span>}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
