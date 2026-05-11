import Link from "next/link";

type AppHeaderProps = {
  currentPage: "patient" | "admin";
};

const navItems = [
  { href: "/", label: "Patient booking", page: "patient" },
  { href: "/admin", label: "Admin view", page: "admin" },
] as const;

export function AppHeader({ currentPage }: AppHeaderProps) {
  return (
    <header className="app-header">
      <Link className="app-brand" href="/">
        <span className="app-brand__mark" aria-hidden="true">
          V
        </span>
        <span>
          <strong>Vero Booking Flow</strong>
          <small>Work sample</small>
        </span>
      </Link>

      <nav className="page-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const isActive = item.page === currentPage;

          return (
            <Link
              key={item.href}
              className={`page-nav__link ${
                isActive ? "page-nav__link--active" : ""
              }`}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
