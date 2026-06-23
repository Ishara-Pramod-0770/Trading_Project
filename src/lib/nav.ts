import {
  LayoutDashboard,
  LineChart,
  CandlestickChart,
  Brain,
  Shapes,
  Gauge,
  GraduationCap,
  Newspaper,
  Bell,
  NotebookPen,
  Wallet,
  Settings,
  ScanLine,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  group: "Trade" | "Learn" | "Manage";
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Trade" },
  { title: "Market", href: "/market", icon: LineChart, group: "Trade" },
  { title: "Charts", href: "/charts", icon: CandlestickChart, group: "Trade" },
  { title: "AI Analysis", href: "/ai-analysis", icon: Brain, group: "Trade" },
  { title: "Chart Scanner", href: "/scanner", icon: ScanLine, group: "Trade" },
  { title: "Patterns", href: "/patterns", icon: Shapes, group: "Learn" },
  { title: "Indicators", href: "/indicators", icon: Gauge, group: "Learn" },
  { title: "Learn Trading", href: "/learn", icon: GraduationCap, group: "Learn" },
  { title: "News", href: "/news", icon: Newspaper, group: "Learn" },
  { title: "Alerts", href: "/alerts", icon: Bell, group: "Manage" },
  { title: "Trading Journal", href: "/journal", icon: NotebookPen, group: "Manage" },
  { title: "Portfolio", href: "/portfolio", icon: Wallet, group: "Manage" },
  { title: "Settings", href: "/settings", icon: Settings, group: "Manage" },
];

export const NAV_GROUPS = ["Trade", "Learn", "Manage"] as const;
