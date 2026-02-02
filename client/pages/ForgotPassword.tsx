import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, CheckCircle, Loader } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/portal-login/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to process password reset request");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <section className="flex-grow flex items-center justify-center py-12 lg:py-20 bg-gradient-to-b from-blue-50/20 to-white px-4 relative">
        {/* Back Button */}
        <Link
          to="/portal"
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-white/50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to login</span>
        </Link>

        <div className="w-full max-w-md">
          {submitted ? (
            <div className="bg-white rounded-lg border border-border/10 p-8 space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Request Sent</h1>
                <p className="text-foreground/70">
                  We've received your password reset request.
                </p>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  An admin will review your request and send you a temporary password at <span className="font-medium">{email}</span>. Please check your email for further instructions.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <p className="text-xs text-foreground/60">
                  You should receive your reset password within 24 hours. If you don't receive it, please contact support.
                </p>
                <Button asChild className="w-full">
                  <Link to="/portal">Return to login</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-border/10 p-8 space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
                <p className="text-foreground/70">
                  Enter your email address and we'll help you reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
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
                  disabled={loading || !email}
                  className="w-full font-semibold flex items-center justify-center gap-2"
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {loading ? "Submitting..." : "Request Password Reset"}
                </Button>
              </form>

              <div className="text-xs text-foreground/50 text-center">
                Remember your password?{" "}
                <Link to="/portal" className="text-primary hover:text-primary/80 font-medium">
                  Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
