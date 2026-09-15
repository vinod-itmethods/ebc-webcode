import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Home } from "lucide-react";

const PARTNER_PASSWORD = import.meta.env.VITE_PARTNER_PASSWORD;

export default function PartnerLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated
    const isAuth = localStorage.getItem("partnerAuthenticated") === "true";
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password === PARTNER_PASSWORD) {
      localStorage.setItem("partnerAuthenticated", "true");
      setIsAuthenticated(true);
      navigate("/partner-dashboard");
    } else {
      setError("Invalid password. Please try again.");
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-foreground/70 mb-6">Redirecting to partner dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-white/50 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="text-sm font-medium">Home</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Partner Portal</h1>
          <p className="text-foreground/60 mt-2">Executive Business Council</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Partner Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full font-semibold rounded-lg"
            >
              Login
            </Button>
          </form>

          {/* Info Section */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-foreground/60 text-center">
              Access restricted to Executive Briefing Council partners only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
