import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // Check for customer portal authentication
    const customerAuth = localStorage.getItem("portalAuthenticated") === "true";
    const customerEmail = localStorage.getItem("userEmail");

    // Check for partner authentication
    const partnerAuth = localStorage.getItem("partnerAuthenticated") === "true";

    // Check for admin authentication
    const adminEmail = localStorage.getItem("adminEmail");

    if (customerAuth && customerEmail) {
      setIsAuthenticated(true);
      setUserEmail(customerEmail);
    } else if (partnerAuth) {
      setIsAuthenticated(true);
      setUserEmail("Partner");
    } else if (adminEmail) {
      setIsAuthenticated(true);
      setUserEmail(adminEmail);
    }
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isAdmin = userEmail && userEmail.endsWith("@itmethods.com");

  const handleLogout = () => {
    localStorage.removeItem("portalAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("partnerAuthenticated");
    localStorage.removeItem("adminEmail");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm overflow-visible">
      <div className="container flex h-16 max-w-7xl items-center px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-0 hover:opacity-80 transition-opacity mr-16 flex-shrink-0 -my-4">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F3ee4b2193a1f49feab79dc6eb04adb1a%2Fb708ee6487aa42df951001ea08f04fa4?format=webp&width=800&height=1200"
            alt="EBC Logo"
            className="h-24 flex-shrink-0"
          />
          <span className="text-foreground/70 text-lg ml-0.5 mr-2">|</span>
          <span className="text-base font-semibold text-foreground">Executive Briefing Council</span>
        </Link>

        {/* Nav Links - Centered */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          <Link
            to="/partners"
            className={`text-sm font-medium transition-colors ${
              isActive("/partners")
                ? "text-primary font-semibold"
                : "text-foreground/70 hover:text-primary"
            }`}
          >
            Technology providers
          </Link>
          <Link
            to="/faq"
            className={`text-sm font-medium transition-colors ${
              isActive("/faq")
                ? "text-primary font-semibold"
                : "text-foreground/70 hover:text-primary"
            }`}
          >
            FAQ
          </Link>
        </nav>

        {/* Right Side - Auth and CTA */}
        <div className="flex items-center gap-3 ml-auto">
          {isAuthenticated ? (
            <>
              {/* Admin Portal Link - Only for admins */}
              {isAdmin && (
                <Link
                  to="/admin/submissions"
                  className={`hidden md:inline text-sm font-medium transition-colors px-3 py-1 rounded-lg ${
                    isActive("/admin")
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  Admin Portal
                </Link>
              )}

              <span className="hidden md:inline text-sm text-foreground/60">
                {userEmail}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/portal"
                className={`hidden md:inline text-sm font-medium transition-colors ${
                  isActive("/portal") || isActive("/partner-login") || isActive("/partner-dashboard")
                    ? "text-primary font-semibold"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                Login
              </Link>
              <Button
                asChild
                className="font-medium rounded-lg"
              >
                <Link to="/request-briefing">Request a briefing</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
