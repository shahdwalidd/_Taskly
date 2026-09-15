
import { useState } from "react";
import { SidebarNavItem } from "./SidebarNavItem";
import { ProjectAccordion } from "./ProjectAccordion";
import { CollapsedProjectPopup } from "./CollapsedProjectPopup";
import LogoIcon from "../../../public/Iconlogo.svg?react";
import FolderIcon from "../../assets/icons/sideBaricons/ProjectsIcon.svg?react";
import StatsIcon from "../../assets/icons/sideBaricons/MyStatisticsIcon.svg?react";
import FolderOutlineIcon from "../../assets/icons/sideBaricons/ActiveProjectIcon.svg?react";
import ChevronLeftIcon from "../../assets/icons/sideBaricons/chevlefticon.svg?react";
import ChevronRightIcon from "../../assets/icons/sideBaricons/chevrightIcon.svg?react";
import LogoutIcon from "../../assets/icons/sideBaricons/LogoutIcon.svg?react";

interface SidebarProps {
  projectName?: string; 
}

export function Sidebar({ projectName }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const hasActiveProject = Boolean(projectName);

  return (
    <aside
      className={`hidden md:flex h-screen shrink-0 flex-col justify-between bg-surface p-3 transition-all duration-200
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      <div>
        <div className={`mb-4 flex items-center gap-2 px-2 py-2 ${isCollapsed ? "justify-center" : ""}`}>
          <LogoIcon className="h-6 w-6 shrink-0 text-brand" />
          {!isCollapsed && (
            <span className="text-lg font-extrabold tracking-tight text-ink">
              TASKLY
            </span>
          )}
        </div>

        <div className="space-y-1">
          <SidebarNavItem icon={FolderIcon} label="Projects" isActive isCollapsed={isCollapsed} />
          <SidebarNavItem icon={StatsIcon} label="My Statistics" isCollapsed={isCollapsed} />
        </div>

        {hasActiveProject && (
          <>
            <div className="my-3 border-t border-black/10" />

            {isCollapsed ? (
              <div className="relative">
                <button
                  onClick={() => setIsPopupOpen((prev) => !prev)}
                  className="flex w-full items-center justify-center rounded-lg p-2.5 text-gray-700 hover:bg-white/60"
                  aria-label="Show project links"
                >
                  <FolderOutlineIcon className="h-5 w-5" />
                </button>
                {isPopupOpen && (
                  <CollapsedProjectPopup onClose={() => setIsPopupOpen(false)} />
                )}
              </div>
            ) : (
              <ProjectAccordion projectName={projectName!} />
            )}
          </>
        )}
      </div>


      <div className="space-y-1 border-t border-black/10 pt-3">
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-white/60
            ${isCollapsed ? "justify-center" : ""}
          `}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5 shrink-0" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 shrink-0" />
          )}
          {!isCollapsed && <span>Collapse</span>}
        </button>

        <button
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50
            ${isCollapsed ? "justify-center" : ""}
          `}
        >
          <LogoutIcon className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}