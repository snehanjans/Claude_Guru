import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import type { RailItem } from "./NinjaRail";

/**
 * The console's rail, shared by every page that renders it so the two cannot
 * drift apart. "Gurus" stays active throughout, because every page built here
 * so far lives under it.
 */
export const RAIL_ITEMS: RailItem[] = [
  { label: "Programs", Icon: GroupsOutlinedIcon },
  { label: "Batches", Icon: GridViewOutlinedIcon },
  { label: "Learners", Icon: PersonOutlineIcon },
  { label: "Content", Icon: DescriptionOutlinedIcon },
  { label: "Gurus", Icon: VideocamOutlinedIcon, active: true },
  { label: "Payments", Icon: CreditCardOutlinedIcon },
  { label: "Labs", Icon: CodeOutlinedIcon },
  { label: "Administration", Icon: ShieldOutlinedIcon },
  { label: "Excelerate", Icon: WorkOutlineIcon },
  { label: "Support", Icon: HelpOutlineIcon },
  { label: "Reports", Icon: AssessmentOutlinedIcon },
  { label: "GLA", Icon: SchoolOutlinedIcon },
  { label: "Communication", Icon: ChatOutlinedIcon },
  { label: "Others", Icon: SettingsOutlinedIcon },
];
