import type { ReactNode } from "react";
import { createElement } from "react";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import type { SessionType } from "./types";

export type ActivityVisual = {
  /** User-facing label rendered in the card eyebrow (e.g. "Assignment", "Discussion Question") */
  label: string;
  /** Type accent color — used for eyebrow icon + label and the spine DOW */
  color: string;
  /** Renders the activity icon at the given pixel size in the type color */
  renderIcon: (size?: number) => ReactNode;
};

const make = (
  Icon: typeof VideocamOutlinedIcon,
  color: string,
  label: string,
): ActivityVisual => ({
  color,
  label,
  renderIcon: (size = 16) =>
    createElement(Icon, { sx: { fontSize: size, color } }),
});

export const ACTIVITY_VISUALS: Record<SessionType | "Webinar", ActivityVisual> = {
  /* Guru-run marketing webinars (Recommend / GL Guru Collective) */
  "Webinar": make(VideocamOutlinedIcon, "#0369a1", "Webinar"),
  "Online session": make(VideocamOutlinedIcon, "#2563eb", "Online session"),
  "Online class": make(VideocamOutlinedIcon, "#2563eb", "Online class"),
  "Mentored Learning session": make(ForumOutlinedIcon, "#7c3aed", "Mentored Learning"),
  "Career mentoring session": make(WorkOutlineIcon, "#0d9488", "Career mentoring"),
  "Capstone project mentoring session": make(AssignmentTurnedInOutlinedIcon, "#4f46e5", "Capstone"),
  "Industry session": make(BusinessOutlinedIcon, "#b45309", "Industry session"),
  "Residency": make(SchoolOutlinedIcon, "#15803d", "Residency"),
  /* User-facing relabelling: Evaluation → "Assignment", Moderation → "Discussion Question" */
  "Evaluation": make(AssignmentOutlinedIcon, "#ea580c", "Assignment"),
  "Moderation": make(GroupsOutlinedIcon, "#0d9488", "Discussion Question"),
  "CV Review": make(DescriptionOutlinedIcon, "#be185d", "CV Review"),
  "Schedule a call": make(PhoneInTalkOutlinedIcon, "#475569", "Call"),
  "Others": make(EventOutlinedIcon, "#475569", "Activity"),
};

export function getActivityVisual(type: SessionType | string | undefined): ActivityVisual {
  if (!type) return ACTIVITY_VISUALS.Others;
  return (ACTIVITY_VISUALS as Record<string, ActivityVisual>)[type] ?? ACTIVITY_VISUALS.Others;
}
