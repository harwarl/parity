export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Tape", href: "#tape" },
  { label: "How it works", href: "#how-it-works" },
  { label: "History", href: "#history" },
  { label: "Rails", href: "#rails" },
];

export const footerLinks: NavLink[] = [
  { label: "Design", href: "#" },
  { label: "GitHub", href: "#" },
];
