import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BriefingTimeline from "@/components/BriefingTimeline";
import { CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react";
import { downloadICS, getOutlookLink } from "@/utils/calendar";

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
  status: "completed" | "pending" | "upcoming";
  type?: "submission" | "update" | "scheduled" | "email";
}

type RequestStatus = "draft" | "submitted" | "pending" | "scheduled" | "completed";

interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  company: string;
  createdAt: string;
  updatedAt: string;
  briefingData: any;
  status: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  approvedAt?: string;
}

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
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [briefingRequests, setBriefingRequests] = useState<BriefingRequest[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "user@company.com";

  useEffect(() => {
    const isAuth = localStorage.getItem("portalAuthenticated") === "true";
    const role = localStorage.getItem("userRole");
    if (!isAuth || role !== "customer") {
      navigate("/portal");
    } else {
      setIsAuthenticated(true);
      fetchCustomerProfile();
    }
  }, [navigate, userEmail]);

  const fetchCustomerProfile = async () => {
    try {
      const response = await fetch(`/api/customer-profile?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data.customer);

        // Generate briefing request cards from the customer's briefing data
        if (data.customer.briefingData) {
          const request = generateBriefingCard(
            data.customer.briefingData,
            data.customer.updatedAt,
            data.customer.approvalStatus
          );
          setBriefingRequests([request]);

          // Generate timeline events
          const submittedDate = new Date(data.customer.createdAt);
          const threeDaysLater = new Date(submittedDate);
          threeDaysLater.setDate(threeDaysLater.getDate() + 3);
          const fiveDaysLater = new Date(submittedDate);
          fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
          const tenDaysLater = new Date(submittedDate);
          tenDaysLater.setDate(tenDaysLater.getDate() + 10);

          const events: TimelineEvent[] = [
            {
              id: "1",
              title: "Briefing Request Submitted",
              date: submittedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              description: "Your briefing request has been received",
              status: "completed",
              type: "submission",
            },
            {
              id: "2",
              title: "Confirmation Email Sent",
              date: submittedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              description: "Welcome email with portal access details",
              status: "completed",
              type: "email",
            },
            {
              id: "3",
              title: "Request Under Review",
              date: threeDaysLater.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              description: "Our team is reviewing your organization's needs and matching technology partners",
              status: "completed",
              type: "update",
            },
            {
              id: "4",
              title: "Briefing Itinerary Added",
              date: fiveDaysLater.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              description: "Briefing agenda and confirmed partners are now available in your portal",
              status: "pending",
              type: "update",
            },
            {
              id: "5",
              title: "Briefing Session Scheduled",
              date: tenDaysLater.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              description: "Your executive briefing is scheduled for this date",
              status: "upcoming",
              type: "scheduled",
            },
          ];

          setTimelineEvents(events);
        }
      }
    } catch (error) {
      console.error("Error fetching customer profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateBriefingCard = (
    briefingData: any,
    submittedDate: string,
    approvalStatus?: string
  ): BriefingRequest => {
    const interests = briefingData.interests || [];
    const location = briefingData.location || "Not specified";

    let status: RequestStatus = "pending";
    let statusMessage = "Your briefing request has been received and is awaiting approval from our team.";

    if (approvalStatus === "approved") {
      status = "submitted";
      statusMessage = "Your briefing request has been approved! We're now coordinating with the selected technology partners to schedule your session.";
    } else if (approvalStatus === "rejected") {
      status = "draft";
      statusMessage = "Unfortunately, your briefing request was not approved. Please contact our team for more information.";
    }

    return {
      id: `br-${Date.now()}`,
      status,
      topics: interests.slice(0, 2),
      timeframe: location,
      attendees: 5,
      submittedDate: new Date(submittedDate).toLocaleDateString(),
      statusMessage,
    };
  };

  const handleRequestAnotherBriefing = () => {
    // Store customer info for pre-filling
    localStorage.setItem("prefillCustomerEmail", customer?.email || "");
    localStorage.setItem("prefillCustomerName", customer?.name || "");
    localStorage.setItem("prefillCustomerCompany", customer?.company || "");
    localStorage.setItem("prefillCustomerRole", customer?.role || "");
    localStorage.setItem("skipContactStep", "true");

    navigate("/request-briefing");
  };


  const handleAddToCalendar = (dateStr: string) => {
    // Parse the date string
    const dateParts = dateStr.split(" ");
    const monthStr = dateParts[0];
    const day = parseInt(dateParts[1]);
    const monthMap: { [key: string]: number } = {
      "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
      "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11,
    };
    const month = monthMap[monthStr];
    const year = parseInt(dateParts[2]);

    const eventDate = new Date(year, month, day, 9, 0, 0);

    const calendarEvent = {
      title: "Executive Briefing Council Session",
      description: `Your scheduled briefing session with technology partners\n\nCompany: ${customer?.company}\nContact: ${customer?.name}`,
      startDate: eventDate,
      endDate: new Date(eventDate.getTime() + 90 * 60 * 1000), // 90 minutes
      location: "Virtual",
    };

    // For now, download ICS file. Could also open Outlook link if desired
    downloadICS(calendarEvent);
  };

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
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">Customer portal</h1>
            <p className="text-lg text-foreground/90">Welcome. This portal provides a limited view of your Executive Briefing Council activity, including request status and confirmed session details.</p>
          </div>

          {/* User Info */}
          <div className="mb-12 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <p className="text-sm text-foreground/80">
              Logged in as: <span className="font-medium">{userEmail}</span>
            </p>
          </div>

          {/* Briefing Requests Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Briefing Requests</h2>
                <p className="text-foreground/70">View the status of your Executive Briefing Council requests.</p>
              </div>
              <Button
                onClick={handleRequestAnotherBriefing}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                Request another briefing
              </Button>
            </div>

            {loading ? (
              <div className="p-8 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <p className="text-foreground/70">Loading your briefing requests...</p>
              </div>
            ) : briefingRequests.length > 0 ? (
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

          {/* Timeline Section */}
          {timelineEvents.length > 0 && (
            <section className="mt-16">
              <BriefingTimeline
                events={timelineEvents}
                onAddToCalendar={handleAddToCalendar}
              />
            </section>
          )}

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
