import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout, getMe } from "../../services/api";
import {
  BsSearch,
  BsBellFill,
  BsGrid,
  BsTerminal,
  BsServer,
  BsCheckCircleFill,
  BsExclamationTriangleFill,
  BsPersonCircle,
  BsGear,
  BsBoxArrowRight,
  BsSun,
  BsMoon,
  BsList,
} from "react-icons/bs";
import { MdOutlineVerified } from "react-icons/md";
import { VscServerProcess } from "react-icons/vsc";
import styles from "./Navbar.module.css";

const searchData = [
  { label: "Dashboard", sub: "Page", icon: <BsGrid />, path: "/dashboard" },
  {
    label: "Deployments",
    sub: "Page",
    icon: <VscServerProcess />,
    path: "/deployments",
  },
  { label: "Logs", sub: "Page", icon: <BsTerminal />, path: "/logs" },
  {
    label: "api-gateway",
    sub: "Service",
    icon: <BsServer />,
    path: "/deployments",
  },
  {
    label: "auth-service",
    sub: "Service",
    icon: <BsServer />,
    path: "/deployments",
  },
  {
    label: "data-pipeline",
    sub: "Service",
    icon: <BsServer />,
    path: "/deployments",
  },
  {
    label: "Live Logs",
    sub: "Quick Link",
    icon: <BsTerminal />,
    path: "/logs",
  },
];

const systemServices = [
  { name: "API Gateway", status: "operational", latency: "12ms" },
  { name: "Auth Service", status: "operational", latency: "4ms" },
  { name: "Data Pipeline", status: "degraded", latency: "340ms" },
  { name: "Notification Service", status: "operational", latency: "8ms" },
];

const statusColor = {
  operational: "#10b981",
  degraded: "#f59e0b",
  down: "#ef4444",
};

function Navbar({ expanded, toggleTheme, theme, setExpanded }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [unread, setUnread] = useState(3);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      type: "error",
      title: "Build Failed",
      desc: "user-dashboard on main branch",
      time: "2m ago",
    },
    {
      type: "warning",
      title: "High Memory Usage",
      desc: "data-pipeline at 78% threshold",
      time: "14m ago",
    },
    {
      type: "success",
      title: "Deployment Successful",
      desc: "api-gateway deployed to production",
      time: "1h ago",
    },
  ]);

  const inputRef = useRef(null);
  const activeRef = useRef(null);
  const statusRef = useRef(null);
  const notifRef = useRef(null);
  const avatarRef = useRef(null);
  const navigate = useNavigate();

  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const results =
    query.trim() === ""
      ? searchData
      : searchData.filter(
          (item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.sub.toLowerCase().includes(query.toLowerCase()),
        );

  const overallStatus = systemServices.some((s) => s.status === "down")
    ? "down"
    : systemServices.some((s) => s.status === "degraded")
      ? "degraded"
      : "operational";

  const openSearch = () => {
    setQuery("");
    setActive(0);
    setSearchOpen(true);
  };

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setStatusOpen(false);
        setNotifOpen(false);
        setAvatarOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    const handler = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target))
        setStatusOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target))
        setAvatarOpen(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActive((p) => Math.min(p + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setActive((p) => Math.max(p - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      navigate(results[active].path);
      setSearchOpen(false);
    }
  };

  const handleSelect = (path) => {
    navigate(path);
    setSearchOpen(false);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnread(0);
  };

  async function handlerlogout() {
    try {
      await logout();
      toast.success("Logged out successfully ✅");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error("Failed to Logout");
    }
  }

  const avatarText = currentUser?.username
    ? currentUser.username.slice(0, 2).toUpperCase()
    : "KS";

  return (
    <>
      <header
        className={`${styles.navbar} ${!expanded ? styles.navbarWide : ""}`}
      >
        {isMobile && (
          <button
            className={styles.hamburger}
            onClick={() => setExpanded && setExpanded((prev) => !prev)}
            title="Open menu"
          >
            <BsList className={styles.hamburgerIcon} />
          </button>
        )}

        <div className={styles.left} />

        <div className={styles.searchWrapper}>
          <div className={styles.search} onClick={openSearch}>
            <BsSearch className={styles.searchIcon} />
            <span className={styles.searchPlaceholder}>
              Search commands, logs, deployments...
            </span>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.clock}>{time}</div>

          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <BsSun className={styles.themeIcon} />
            ) : (
              <BsMoon className={styles.themeIcon} />
            )}
          </button>

          <div className={styles.pillWrap} ref={statusRef}>
            <div
              className={`${styles.pill} ${statusOpen ? styles.pillActive : ""}`}
              onClick={() => setStatusOpen(!statusOpen)}
            >
              <MdOutlineVerified className={styles.pillIcon} />
              <span className={styles.pillText}>
                {overallStatus === "operational"
                  ? "Operational"
                  : overallStatus === "degraded"
                    ? "Degraded"
                    : "Outage"}
              </span>
              <span className={styles.pillChevron}>▼</span>
            </div>

            {statusOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <p className={styles.dropdownTitle}>System Status</p>
                  <span
                    className={styles.overallBadge}
                    style={{
                      color: statusColor[overallStatus],
                      background: `${statusColor[overallStatus]}18`,
                    }}
                  >
                    {overallStatus}
                  </span>
                </div>
                <div className={styles.dropdownDivider} />
                <div className={styles.serviceList}>
                  {systemServices.map((service) => (
                    <div key={service.name} className={styles.serviceRow}>
                      <div className={styles.serviceLeft}>
                        <span
                          className={styles.serviceDot}
                          style={{
                            background: statusColor[service.status],
                            boxShadow: `0 0 6px ${statusColor[service.status]}`,
                          }}
                        />
                        <span className={styles.serviceName}>
                          {service.name}
                        </span>
                      </div>
                      <div className={styles.serviceRight}>
                        <span className={styles.serviceLatency}>
                          {service.latency}
                        </span>
                        <span
                          className={styles.serviceStatus}
                          style={{ color: statusColor[service.status] }}
                        >
                          {service.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.dropdownDivider} />
                <p className={styles.dropdownFooter}>Last checked just now</p>
              </div>
            )}
          </div>

          <div className={styles.notifWrap} ref={notifRef}>
            <button
              className={`${styles.notifBtn} ${notifOpen ? styles.notifActive : ""}`}
              onClick={() => {
                setNotifOpen(!notifOpen);
                setUnread(0);
              }}
            >
              <BsBellFill className={styles.notifIcon} />
              {unread > 0 && (
                <span className={styles.notifBadge}>{unread}</span>
              )}
            </button>

            {notifOpen && (
              <div className={`${styles.dropdown} ${styles.notifDropdown}`}>
                <div className={styles.dropdownHeader}>
                  <p className={styles.dropdownTitle}>Notifications</p>
                  <span className={styles.clearAll} onClick={clearAll}>
                    Clear all
                  </span>
                </div>
                <div className={styles.dropdownDivider} />
                <div className={styles.notifList}>
                  {notifications.length === 0 && (
                    <div className={styles.noNotifs}>
                      <p className={styles.noNotifsTitle}>All caught up</p>
                      <p className={styles.noNotifsSub}>
                        No new notifications right now
                      </p>
                    </div>
                  )}
                  {notifications.map((item, index) => (
                    <div key={index} className={styles.notifItem}>
                      <span className={styles.notifTypeIcon}>
                        {item.type === "error" && (
                          <BsExclamationTriangleFill
                            style={{ color: "#ef4444" }}
                          />
                        )}
                        {item.type === "warning" && (
                          <BsExclamationTriangleFill
                            style={{ color: "#f59e0b" }}
                          />
                        )}
                        {item.type === "success" && (
                          <BsCheckCircleFill style={{ color: "#10b981" }} />
                        )}
                      </span>
                      <div className={styles.notifContent}>
                        <p className={styles.notifTitle}>{item.title}</p>
                        <p className={styles.notifDesc}>{item.desc}</p>
                        <span className={styles.notifTime}>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.avatarWrap} ref={avatarRef}>
            <div
              className={styles.avatar}
              onClick={() => setAvatarOpen(!avatarOpen)}
            >
              {avatarText}
              <div className={styles.avatarRing} />
            </div>

            {avatarOpen && (
              <div className={`${styles.dropdown} ${styles.avatarDropdown}`}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileAvatar}>{avatarText}</div>
                  <div>
                    <p className={styles.profileName}>
                      {currentUser?.username || "Karan S."}
                    </p>
                    <p className={styles.profileRole}>
                      {currentUser?.email || "Frontend Developer"}
                    </p>
                  </div>
                </div>
                <div className={styles.dropdownDivider} />
                <div className={styles.menuList}>
                  <div className={styles.menuItem}>
                    <BsPersonCircle className={styles.menuIcon} />
                    <span>Profile</span>
                  </div>
                  <div className={styles.menuItem}>
                    <BsGear className={styles.menuIcon} />
                    <span>Settings</span>
                  </div>
                  <div className={styles.menuItem} onClick={toggleTheme}>
                    {theme === "dark" ? (
                      <BsSun className={styles.menuIcon} />
                    ) : (
                      <BsMoon className={styles.menuIcon} />
                    )}
                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </div>
                </div>
                <div className={styles.dropdownDivider} />
                <div className={`${styles.menuItem} ${styles.menuItemDanger}`}>
                  <BsBoxArrowRight className={styles.menuIcon} />
                  <span>
                    <button
                      onClick={handlerlogout}
                      className={styles.logoutBtn}
                    >
                      Sign Out
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className={styles.overlay} onClick={() => setSearchOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalSearch}>
              <BsSearch className={styles.modalSearchIcon} />
              <input
                ref={inputRef}
                className={styles.modalInput}
                placeholder="Search pages, services, logs..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={handleKeyDown}
              />
              {query && (
                <button
                  className={styles.clearBtn}
                  onClick={() => setQuery("")}
                >
                  X
                </button>
              )}
            </div>
            <div className={styles.modalDivider} />
            <div className={styles.results}>
              {results.length === 0 ? (
                <p className={styles.noResults}>No results for "{query}"</p>
              ) : (
                results.map((result, index) => (
                  <div
                    key={index}
                    ref={active === index ? activeRef : null}
                    className={`${styles.resultItem} ${active === index ? styles.resultActive : ""}`}
                    onClick={() => handleSelect(result.path)}
                    onMouseEnter={() => setActive(index)}
                  >
                    <span className={styles.resultIcon}>{result.icon}</span>
                    <div className={styles.resultText}>
                      <span className={styles.resultLabel}>{result.label}</span>
                      <span className={styles.resultSub}>{result.sub}</span>
                    </div>
                    <span className={styles.resultEnter}>Enter</span>
                  </div>
                ))
              )}
            </div>
            <div className={styles.modalFooter}>
              <span>Arrow keys navigate</span>
              <span>Enter select</span>
              <span>Esc close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
