import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartnerProfileEditor from "@/components/PartnerProfileEditor";
import { LogOut } from "lucide-react";

export default function PartnerDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "briefings" | "resources">("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("partnerAuthenticated") === "true";
    if (!isAuth) {
      navigate("/partner-login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("partnerAuthenticated");
    navigate("/partner-login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Partner Dashboard</h1>
            <p className="text-foreground/60 mt-2">Executive Business Council Partner Portal</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Dashboard Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Briefings */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-foreground mb-4">Upcoming Briefings</h2>
            <p className="text-foreground/70 mb-6">
              Access details about upcoming executive briefing sessions you're participating in.
            </p>
            <Button asChild variant="secondary-outline">
              <a href="#briefings">View Briefings</a>
            </Button>
          </div>

          {/* Resources */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-8 border border-purple-200">
            <h2 className="text-2xl font-bold text-foreground mb-4">Partner Resources</h2>
            <p className="text-foreground/70 mb-6">
              Download materials, guidelines, and documentation for partner participation.
            </p>
            <Button asChild variant="secondary-outline">
              <a href="#resources">Access Resources</a>
            </Button>
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="space-y-8">
          {/* Briefings Section */}
          <section id="briefings" className="bg-white rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Briefings</h2>
            <div className="space-y-4 text-foreground/70">
              <p>You currently have no scheduled briefings.</p>
              <p className="text-sm">
                Briefing sessions will be displayed here as they are scheduled. You'll receive email notifications for new bookings.
              </p>
            </div>
          </section>

          {/* Resources Section */}
          <section id="resources" className="bg-white rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Partner Resources</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <h3 className="font-semibold text-foreground mb-1">Partner Guidelines</h3>
                <p className="text-sm text-foreground/70">
                  Best practices and expectations for Executive Briefing participation.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <h3 className="font-semibold text-foreground mb-1">Briefing Framework</h3>
                <p className="text-sm text-foreground/70">
                  Understand the structure and format of executive briefing sessions.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <h3 className="font-semibold text-foreground mb-1">Communication Template</h3>
                <p className="text-sm text-foreground/70">
                  Standard templates and messaging guidelines for partner communications.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
