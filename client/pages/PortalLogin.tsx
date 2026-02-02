import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ChevronLeft, Loader } from "lucide-react";

type UserRole = "customer" | "provider";

export default function PortalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already authenticated
    const adminEmail = localStorage.getItem("adminEmail");
    if (adminEmail && adminEmail.endsWith("@itmethods.com")) {
      setIsAuthenticated(true);
      navigate("/admin/submissions");
      return;
    }

    // Check if already authenticated as customer/provider
    const isAuth = localStorage.getItem("portalAuthenticated") === "true";
    const storedRole = localStorage.getItem("userRole") as UserRole;
    if (isAuth && storedRole) {
      setIsAuthenticated(true);
      navigate(
        storedRole === "customer" ? "/portal/customer" : "/portal/provider",
      );
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      // Call the portal login API
      const response = await fetch("/api/portal-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { user } = data;

        // Store authentication data
        localStorage.setItem("portalAuthenticated", "true");
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userEmail", user.email);

        if (user.role === "provider" && user.companyId) {
          localStorage.setItem("providerCompanyId", user.companyId);
        }

        setIsAuthenticated(true);

        // Navigate to the appropriate portal
        if (user.role === "customer") {
          navigate("/portal/customer");
        } else if (user.role === "provider") {
          navigate("/portal/provider");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed. Please try again.");
        setPassword("");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white flex flex-col items-center justify-center p-4">
      {/* Back to Home Link */}
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      {/* Hero Header */}
      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">
          Executive briefing
          <br className="hidden sm:block" /> council portal
        </h1>
        <p className="text-lg text-foreground/90">
          Secure access for customers and technology providers participating in
          Executive Briefing Council briefings.
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-sm border border-border p-8 space-y-8">
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold rounded-lg py-2.5 flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          {/* Microcopy */}
          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <p className="text-sm text-foreground/80 leading-relaxed">
              Log in with your email address to access your portal.
            </p>
          </div>

          {/* Help Links */}
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/portal/forgot-password"
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Vendor Section */}
          <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200 space-y-3">
            <p className="text-sm text-foreground/80 leading-relaxed">
              Are you a technology vendor interested in joining our ecosystem?
            </p>
            <Button variant="secondary-outline" asChild className="w-full">
              <a href="/request-partner-access">Request access</a>
            </Button>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 flex items-start gap-3 justify-center text-center">
          <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/60">
            Confidential and secure. Briefing details are visible only to
            approved participants.
          </p>
        </div>
      </div>
    </div>
  );
}
