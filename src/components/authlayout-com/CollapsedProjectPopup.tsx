import { useEffect,useRef } from "react";
import { SidebarNavItem } from "./SidebarNavItem";

import EpicsIcon from "../../assets/icons/sideBaricons/EpicsIcon.svg?react";
import TasksIcon from "../../assets/icons/sideBaricons/TasksIcon.svg?react";
import MembersIcon from "../../assets/icons/sideBaricons/MembersIcon.svg?react";
import DetailsIcon from "../../assets/icons/sideBaricons/DetailsIcon.svg?react";

const PROJECT_LINKS = [
  { icon: EpicsIcon, label: "Epics" },
  { icon: TasksIcon, label: "Tasks" },
  { icon: MembersIcon, label: "Members" },
  { icon: DetailsIcon, label: "Details" },
];

interface CollapsedProjectPopupProps {
  onClose: () => void;
}
export function CollapsedProjectPopup({ onClose }: CollapsedProjectPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute left-full top-0 ml-2 w-48 space-y-1 rounded-xl bg-background p-1.5 shadow-lg ring-1 ring-black/5"
    >
      {PROJECT_LINKS.map((link) => (
        <SidebarNavItem key={link.label} icon={link.icon} label={link.label} />
      ))}
    </div>
  );
}