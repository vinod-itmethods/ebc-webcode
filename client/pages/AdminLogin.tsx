import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "executive2024";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to submissions page
  useEffect(() => {
    const adminEmail = localStorage.getItem("adminEmail");
    const userEmail = localStorage.getItem("userEmail");
    const customerAuth = localStorage.getItem("portalAuthenticated") === "true";

    // If authenticated as admin, go to submissions
    if (adminEmail && adminEmail.endsWith("@itmethods.com")) {
      navigate("/admin/submissions", { replace: true });
    }
    // If authenticated as customer with @itmethods.com email, auto-authenticate as admin
    else if (customerAuth && userEmail && userEmail.endsWith("@itmethods.com")) {
      localStorage.setItem("adminEmail", userEmail);
      navigate("/admin/submissions", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate email is @itmethods.com
    if (!email.endsWith("@itmethods.com")) {
      setError("Only @itmethods.com email addresses can access the admin portal");
      setLoading(false);
      return;
    }

    // Validate password
    if (password !== ADMIN_PASSWORD) {
      setError("Invalid email or password");
      setPassword("");
      setLoading(false);
      return;
    }

    // Store email and redirect
    localStorage.setItem("adminEmail", email);
    navigate("/admin/submissions");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <section className="flex-grow flex items-center justify-center py-12 lg:py-20 bg-gradient-to-b from-blue-50/20 to-white px-4 relative">
        {/* Home Button */}
        <Link
          to="/"
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-white/50 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium">Home</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-border/10 p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-foreground">Admin Portal</h1>
              <p className="text-foreground/70">Enter your credentials to access submissions</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@itmethods.com"
                  className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full font-semibold"
              >
                {loading ? "Verifying..." : "Access Admin Portal"}
              </Button>
            </form>

            <div className="text-xs text-foreground/50 text-center">
              Only @itmethods.com email addresses can access this portal
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
