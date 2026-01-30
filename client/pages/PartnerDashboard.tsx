import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartnerProfileEditor from "@/components/PartnerProfileEditor";

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

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("briefings")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "briefings"
                ? "border-primary text-primary"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            Briefings
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "resources"
                ? "border-primary text-primary"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            Resources
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <PartnerProfileEditor />
          )}

          {/* Briefings Tab */}
          {activeTab === "briefings" && (
            <section className="bg-white rounded-lg border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Your Briefings</h2>
              <div className="space-y-4 text-foreground/70">
                <p>You currently have no scheduled briefings.</p>
                <p className="text-sm">
                  Briefing sessions will be displayed here as they are scheduled. You'll receive email notifications for new bookings.
                </p>
              </div>
            </section>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <section className="bg-white rounded-lg border border-border p-8">
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
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
