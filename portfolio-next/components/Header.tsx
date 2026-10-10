import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#devsecops", label: "DevSecOps" },
  { href: "/projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="bar">
      <Link className="brand" href="/">
        Nour Kidoudi
      </Link>
      <nav aria-label="Navigation principale">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
      <ThemeToggle />
    </header>
  );
}
