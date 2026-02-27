import type { ActiveSessionInfo } from "@shared/gfn";
import { LayoutGrid, Library, Settings, Loader2, PlayCircle } from "lucide-react";
import { type JSX } from "react";

interface NavbarProps {
  currentPage: "home" | "library" | "settings";
  onNavigate: (page: "home" | "library" | "settings") => void;
  activeSession: ActiveSessionInfo | null;
  activeSessionGameTitle: string | null;
  isResumingSession: boolean;
  onResumeSession: () => void;
}

export function Navbar({
  currentPage,
  onNavigate,
  activeSession,
  activeSessionGameTitle,
  isResumingSession,
  onResumeSession,
}: NavbarProps): JSX.Element {
  const navItems = [
    { id: "home" as const, label: "Catalog", icon: LayoutGrid },
    { id: "library" as const, label: "Library", icon: Library },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  const activeSessionTitle = activeSessionGameTitle?.trim() || null;

  return (
    <nav className="navbar">
      {activeSession && (
        <button
          type="button"
          className={`navbar-session-resume${isResumingSession ? " is-loading" : ""}`}
          title={
            activeSession.serverIp
              ? activeSessionTitle
                ? `Resume: ${activeSessionTitle}`
                : "Resume active session"
              : "Active session found (missing server address)"
          }
          onClick={onResumeSession}
          disabled={isResumingSession || !activeSession.serverIp}
        >
          {isResumingSession ? <Loader2 size={14} className="navbar-session-resume-spin" /> : <PlayCircle size={14} />}
          <span className="navbar-session-resume-text">Resume</span>
          {activeSessionTitle && <span className="navbar-session-resume-game">{activeSessionTitle}</span>}
        </button>
      )}
      <div className="navbar-tabs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`navbar-tab${isActive ? " active" : ""}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
