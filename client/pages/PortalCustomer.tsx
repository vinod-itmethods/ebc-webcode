import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LogOut, CheckCircle2, Clock, AlertCircle } from "lucide-react";

type RequestStatus = "draft" | "submitted" | "pending" | "scheduled" | "completed";

interface BriefingRequest {
  id: string;
  status: RequestStatus;
  topics: string[];
  timeframe: string;
  attendees: number;
  submittedDate: string;
  statusMessage: string;
}

export default function PortalCustomer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "user@company.com";

  useEffect(() => {
    const isAuth = localStorage.getItem("portalAuthenticated") === "true";
    const role = localStorage.getItem("userRole");
    if (!isAuth || role !== "customer") {
      navigate("/portal");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("portalAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/portal");
  };

  // Mock briefing request data
  const briefingRequests: BriefingRequest[] = [
    {
      id: "br-001",
      status: "pending",
      topics: ["AI & Machine Learning", "DevOps & Continuous Delivery"],
      timeframe: "Q2 2024",
      attendees: 8,
      submittedDate: "March 15, 2024",
      statusMessage: "Your request has been received and is currently being reviewed. We'll notify you when scheduling is confirmed.",
    },
  ];

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "scheduled":
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "scheduled":
        return "bg-blue-50 border-blue-200";
      case "pending":
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  const getStatusLabel = (status: RequestStatus) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "submitted":
        return "Submitted";
      case "pending":
        return "Pending Review";
      case "scheduled":
        return "Scheduled";
      case "completed":
        return "Completed";
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-grow">
        <div className="container max-w-4xl mx-auto px-4 py-20">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">Customer Portal</h1>
              <p className="text-lg text-foreground/90">Welcome. This portal provides a limited view of your Executive Briefing Council activity, including request status and confirmed session details.</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="secondary-outline"
              className="flex items-center gap-2 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </Button>
          </div>

          {/* User Info */}
          <div className="mb-12 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <p className="text-sm text-foreground/80">
              Logged in as: <span className="font-medium">{userEmail}</span>
            </p>
          </div>

          {/* Briefing Requests Section */}
          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Briefing Requests</h2>
              <p className="text-foreground/70 mb-6">View the status of your Executive Briefing Council requests.</p>
            </div>

            {briefingRequests.length > 0 ? (
              <div className="space-y-6">
                {briefingRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`rounded-lg border p-8 space-y-6 ${getStatusColor(request.status)}`}
                  >
                    {/* Status Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(request.status)}
                        <div>
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</p>
                          <p className="text-xl font-semibold text-foreground">{getStatusLabel(request.status)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-foreground/60">Submitted</p>
                        <p className="text-sm font-medium text-foreground">{request.submittedDate}</p>
                      </div>
                    </div>

                    {/* Status Message */}
                    <div className="p-4 bg-white/60 rounded border border-white/40">
                      <p className="text-sm text-foreground/80 leading-relaxed">{request.statusMessage}</p>
                    </div>

                    {/* Request Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Topics</p>
                        <div className="space-y-2">
                          {request.topics.map((topic) => (
                            <p key={topic} className="text-sm text-foreground/80">
                              • {topic}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Preferred Timeframe</p>
                          <p className="text-sm text-foreground/80">{request.timeframe}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Attendees</p>
                          <p className="text-sm text-foreground/80">{request.attendees} stakeholders</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/40">
                      <Button
                        variant="secondary-outline"
                        asChild
                      >
                        <a href="mailto:briefings@example.com">Contact the team</a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <p className="text-foreground/70">No briefing requests found.</p>
                <Button asChild className="mt-4">
                  <a href="/">Submit a request</a>
                </Button>
              </div>
            )}
          </section>

          {/* Confidentiality Note */}
          <div className="mt-16 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-foreground/60 text-center leading-relaxed">
              To protect confidentiality, customer portal access is limited and does not include vendor or provider materials. All briefing details are restricted to approved participants only.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
