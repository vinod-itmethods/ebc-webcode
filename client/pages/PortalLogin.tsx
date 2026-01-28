import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { partners } from "@/data/partners";
import { Lock } from "lucide-react";

const PORTAL_PASSWORD = "executive2024";

type UserRole = "customer" | "provider";

export default function PortalLogin() {
  const [role, setRole] = useState<UserRole>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>(partners[0].id);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated
    const isAuth = localStorage.getItem("portalAuthenticated") === "true";
    const storedRole = localStorage.getItem("userRole") as UserRole;
    if (isAuth && storedRole) {
      setIsAuthenticated(true);
      navigate(storedRole === "customer" ? "/portal/customer" : "/portal/provider");
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (password === PORTAL_PASSWORD) {
      localStorage.setItem("portalAuthenticated", "true");
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);
      if (role === "provider") {
        localStorage.setItem("providerCompanyId", selectedCompany);
      }
      setIsAuthenticated(true);

      if (role === "customer") {
        navigate("/portal/customer");
      } else {
        navigate("/portal/provider");
      }
    } else {
      setError("Invalid email or password. Please try again.");
      setPassword("");
    }
  };

  const microcopy = 
    role === "customer"
      ? "Log in to view your briefing request status and upcoming session details. Access is limited to approved customer accounts."
      : "Log in to manage participation, opt in to briefing opportunities, and complete your provider registration. Access is limited to approved provider accounts.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white flex flex-col items-center justify-center p-4">
      {/* Hero Header */}
      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Executive Briefing Council Portal</h1>
        <p className="text-lg text-foreground/90">Secure access for customers and technology providers participating in Executive Briefing Council briefings.</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-border p-8 space-y-8">
          
          {/* Role Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">I am a:</label>
            <div className="flex gap-3">
              <button
                onClick={() => setRole("customer")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  role === "customer"
                    ? "bg-[hsl(193_45%_45%)] text-white"
                    : "bg-slate-100 text-foreground hover:bg-slate-200"
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setRole("provider")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  role === "provider"
                    ? "bg-[hsl(193_45%_45%)] text-white"
                    : "bg-slate-100 text-foreground hover:bg-slate-200"
                }`}
              >
                Technology Provider
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Company Selection for Providers */}
            {role === "provider" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Your Company
                </label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(45_82%_52%)]"
                >
                  {partners.map(partner => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              className="w-full font-semibold rounded-lg py-2.5"
            >
              Log in
            </Button>
          </form>

          {/* Microcopy */}
          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <p className="text-sm text-foreground/80 leading-relaxed">{microcopy}</p>
          </div>

          {/* Help Links */}
          <div className="flex flex-col gap-3 pt-2">
            <a href="#" className="text-sm text-primary hover:text-primary/80 font-medium">
              Forgot password?
            </a>
            <Button
              variant="secondary-outline"
              asChild
              className="w-full"
            >
              <a href="/portal/request-access">Request access</a>
            </Button>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 flex items-start gap-3 justify-center text-center">
          <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/60">Confidential and secure. Briefing details are visible only to approved participants.</p>
        </div>
      </div>
    </div>
  );
}
