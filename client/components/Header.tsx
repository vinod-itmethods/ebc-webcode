import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity mr-12">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sm text-foreground hidden sm:inline whitespace-nowrap">Executive Business Council</span>
        </Link>

        {/* Nav Links - Centered */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          <Link
            to="/partners"
            className={`text-sm font-medium transition-colors ${
              isActive("/partners")
                ? "text-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Technology partners
          </Link>
          <Link
            to="/faq"
            className={`text-sm font-medium transition-colors ${
              isActive("/faq")
                ? "text-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            FAQ
          </Link>
          <Link
            to="/partner-login"
            className={`text-sm font-medium transition-colors ${
              isActive("/partner-login") || isActive("/partner-dashboard")
                ? "text-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Partner Login
          </Link>
        </nav>

        {/* CTA Button */}
        <Button
          asChild
          className="ml-auto font-medium rounded-lg"
        >
          <Link to="/request-briefing">Request a briefing</Link>
        </Button>
      </div>
    </header>
  );
}
