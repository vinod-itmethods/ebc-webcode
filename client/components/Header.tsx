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
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F3ee4b2193a1f49feab79dc6eb04adb1a%2F30e916b3d745426487a83b6ef010cb51?format=webp&width=800&height=1200"
            alt="EBC Logo"
            className="w-8 h-8 flex-shrink-0"
          />
          <span className="text-sm text-foreground hidden sm:inline whitespace-nowrap"><span className="font-bold">EBC</span> | <span className="font-normal">Executive Briefing Council</span></span>
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
        </nav>

        {/* Right Side - Vendor Login and CTA */}
        <div className="flex items-center gap-4 ml-auto">
          <Link
            to="/partner-login"
            className={`hidden md:inline text-sm font-medium transition-colors ${
              isActive("/partner-login") || isActive("/partner-dashboard")
                ? "text-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Vendor Login
          </Link>
          <Button
            asChild
            className="font-medium rounded-lg"
          >
            <Link to="/request-briefing">Request a briefing</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
