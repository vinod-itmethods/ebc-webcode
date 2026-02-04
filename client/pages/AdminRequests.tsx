import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, AlertCircle, Plus, Calendar } from "lucide-react";

interface CustomerRequest {
  id: string;
  email: string;
  name: string;
  role: string;
  company: string;
  createdAt: string;
  briefingData: any;
  status: string;
  approvalStatus: "pending" | "approved" | "rejected";
  approvedAt?: string;
  approvedBy?: string;
}

interface PartnerRequest {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  expertise: string[];
  description: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  status: "completed" | "pending" | "upcoming";
  type: "submission" | "update" | "scheduled" | "email";
}

type RequestType = "all" | "customer" | "partner";

export default function AdminRequests() {
  const navigate = useNavigate();
  const [requestType, setRequestType] = useState<RequestType>("all");
  const [customerRequests, setCustomerRequests] = useState<CustomerRequest[]>([]);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<{
    [key: string]: TimelineEvent[];
  }>({});
  const [showTimelineForm, setShowTimelineForm] = useState<string | null>(null);
  const [timelineFormData, setTimelineFormData] = useState({
    title: "",
    date: "",
    status: "pending" as const,
    type: "update" as const,
  });
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [editPartnerStatus, setEditPartnerStatus] = useState<"pending" | "reviewed" | "approved" | "rejected">("pending");
  const [editPartnerNotes, setEditPartnerNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    if (!storedEmail || !storedEmail.endsWith("@itmethods.com")) {
      navigate("/admin");
      return;
    }
    setAdminEmail(storedEmail);
    fetchAllRequests(storedEmail);
  }, [navigate]);

  const fetchAllRequests = async (email: string) => {
    try {
      setLoading(true);
      const [customerRes, partnerRes] = await Promise.all([
        fetch(`/api/admin/customers?adminEmail=${encodeURIComponent(email)}`),
        fetch(`/api/admin/partner-requests?adminEmail=${encodeURIComponent(email)}`),
      ]);

      const customerData = customerRes.ok ? await customerRes.json() : {};
      const partnerData = partnerRes.ok ? await partnerRes.json() : {};

      const allCustomers = [
        ...(customerData.pending || []),
        ...(customerData.approved || []),
        ...(customerData.rejected || []),
      ];

      setCustomerRequests(allCustomers);
      setPartnerRequests(partnerData.requests || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCustomer = async (customerEmail: string) => {
    try {
      setActionLoading(customerEmail);
      const response = await fetch("/api/admin/customers/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail,
          customerEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve customer");
      }

      const today = new Date().toISOString().split("T")[0];
      const inReviewDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      await fetch("/api/admin/timeline-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({
          customerEmail,
          title: "Request Approved",
          description: "Your briefing request has been approved by our team",
          eventDate: today,
          status: "completed",
          eventType: "update",
        }),
      }).catch(console.error);

      await fetch("/api/admin/timeline-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({
          customerEmail,
          title: "Briefing Details Being Prepared",
          description: "We are preparing your briefing itinerary with selected partners",
          eventDate: inReviewDate,
          status: "pending",
          eventType: "update",
        }),
      }).catch(console.error);

      await fetchAllRequests(adminEmail);
      setExpandedId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error approving customer");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectCustomer = async (customerEmail: string) => {
    if (!confirm("Are you sure you want to reject this customer request?")) {
      return;
    }

    try {
      setActionLoading(customerEmail);
      const response = await fetch("/api/admin/customers/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail,
          customerEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject customer");
      }

      await fetchAllRequests(adminEmail);
      setExpandedId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error rejecting customer");
    } finally {
      setActionLoading(null);
    }
  };

  const fetchTimelineEvents = async (customerEmail: string) => {
    try {
      const response = await fetch(
        `/api/timeline-events?email=${encodeURIComponent(customerEmail)}`
      );
      if (response.ok) {
        const data = await response.json();
        setTimelineEvents((prev) => ({
          ...prev,
          [customerEmail]: data.events || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching timeline events:", error);
    }
  };

  const handleAddTimelineEvent = async (customerEmail: string) => {
    if (!timelineFormData.title || !timelineFormData.date) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("/api/admin/timeline-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({
          customerEmail,
          title: timelineFormData.title,
          description: "",
          eventDate: timelineFormData.date,
          status: timelineFormData.status,
          eventType: timelineFormData.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add timeline event");
      }

      setTimelineFormData({
        title: "",
        date: "",
        status: "pending",
        type: "update",
      });
      setShowTimelineForm(null);
      await fetchTimelineEvents(customerEmail);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to add event");
    }
  };

  const handleUpdatePartnerStatus = async (requestId: string) => {
    try {
      setUpdating(true);
      const response = await fetch("/api/admin/partner-requests/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({
          requestId,
          status: editPartnerStatus,
          notes: editPartnerNotes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request");
      }

      setEditingPartnerId(null);
      await fetchAllRequests(adminEmail);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update request");
    } finally {
      setUpdating(false);
    }
  };

  const getDisplayRequests = () => {
    let requests: any[] = [];

    if (requestType === "all" || requestType === "customer") {
      requests = requests.concat(
        customerRequests.map((r) => ({
          ...r,
          _type: "customer",
          _id: r.id,
        }))
      );
    }

    if (requestType === "all" || requestType === "partner") {
      requests = requests.concat(
        partnerRequests.map((r) => ({
          ...r,
          _type: "partner",
          _id: r.id,
        }))
      );
    }

    return requests.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at).getTime();
      const dateB = new Date(b.createdAt || b.created_at).getTime();
      return dateB - dateA;
    });
  };

  const displayRequests = getDisplayRequests();
  const customerPendingCount = customerRequests.filter(
    (r) => r.approvalStatus === "pending"
  ).length;
  const partnerPendingCount = partnerRequests.filter(
    (r) => r.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Admin Header */}
      <section className="border-b border-border/10 bg-gradient-to-r from-slate-50 to-blue-50/30 px-4 py-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Manage Requests
          </h2>
          <p className="text-sm text-foreground/60">
            Review and approve customer briefing requests and technology provider access requests
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Total Requests</p>
              <p className="text-3xl font-bold text-foreground">
                {customerRequests.length + partnerRequests.length}
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Pending</p>
              <p className="text-3xl font-bold text-amber-600">
                {customerPendingCount + partnerPendingCount}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Customer Requests</p>
              <p className="text-3xl font-bold text-slate-600">
                {customerRequests.length}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Provider Requests</p>
              <p className="text-3xl font-bold text-slate-600">
                {partnerRequests.length}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border/10">
            {["all", "customer", "partner"].map((tab) => (
              <button
                key={tab}
                onClick={() => setRequestType(tab as RequestType)}
                className={`px-4 py-2 border-b-2 transition-colors capitalize ${
                  requestType === tab
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab === "all"
                  ? "All Requests"
                  : tab === "customer"
                    ? "Customer Requests"
                    : "Provider Requests"}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-foreground/60">Loading requests...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && displayRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60">
                No {requestType === "all" ? "" : requestType} requests
              </p>
            </div>
          )}

          {/* Requests List */}
          {!loading && !error && displayRequests.length > 0 && (
            <div className="space-y-3">
              {displayRequests.map((request) => (
                <div
                  key={`${request._type}-${request._id}`}
                  className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                    request._type === "customer"
                      ? request.approvalStatus === "approved"
                        ? "bg-green-50 border-green-200"
                        : request.approvalStatus === "rejected"
                          ? "bg-red-50 border-red-200"
                          : "bg-amber-50 border-amber-200"
                      : request.status === "approved"
                        ? "bg-green-50 border-green-200"
                        : request.status === "rejected"
                          ? "bg-red-50 border-red-200"
                          : request.status === "reviewed"
                            ? "bg-blue-50 border-blue-200"
                            : "bg-amber-50 border-amber-200"
                  }`}
                >
                  {/* Summary Row */}
                  <button
                    onClick={() => {
                      if (expandedId === `${request._type}-${request._id}`) {
                        setExpandedId(null);
                      } else {
                        setExpandedId(`${request._type}-${request._id}`);
                        if (
                          request._type === "customer" &&
                          request.approvalStatus === "approved"
                        ) {
                          fetchTimelineEvents(request.email);
                        }
                      }
                    }}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
                  >
                    <div className="flex-grow text-left">
                      <div className="flex items-start justify-between gap-4 w-full">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="inline-block bg-slate-200 text-slate-700 text-xs font-medium px-2 py-1 rounded">
                              {request._type === "customer" ? "Customer" : "Provider"}
                            </span>
                            <h3 className="font-semibold text-foreground">
                              {request._type === "customer"
                                ? request.name
                                : request.company_name}
                            </h3>
                          </div>
                          <p className="text-sm text-foreground/70 ml-20">
                            {request._type === "customer"
                              ? `${request.company} • ${request.email}`
                              : `${request.contact_name} • ${request.contact_email}`}
                          </p>
                          <p className="text-xs text-foreground/50 mt-1 ml-20">
                            Submitted{" "}
                            {new Date(
                              request.createdAt || request.created_at
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                              request._type === "customer"
                                ? request.approvalStatus === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : request.approvalStatus === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-700"
                                : request.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : request.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : request.status === "reviewed"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {request._type === "customer"
                              ? request.approvalStatus
                              : request.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expandedId === `${request._type}-${request._id}` && (
                    <div className="border-t border-current border-opacity-20 bg-white/50 px-6 py-4 space-y-6">
                      {/* Customer Request Details */}
                      {request._type === "customer" && (
                        <>
                          {/* Timeline Section */}
                          {request.approvalStatus === "approved" && (
                            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-foreground text-sm">
                                  Timeline & Updates
                                </h4>
                                <Button
                                  onClick={() => {
                                    setShowTimelineForm(
                                      showTimelineForm === request.email
                                        ? null
                                        : request.email
                                    );
                                    if (
                                      !timelineEvents[request.email] ||
                                      timelineEvents[request.email].length === 0
                                    ) {
                                      fetchTimelineEvents(request.email);
                                    }
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1 h-8"
                                >
                                  <Plus className="w-3 h-3" />
                                  Add Event
                                </Button>
                              </div>

                              {/* Timeline Events */}
                              <div className="space-y-2 mb-4">
                                {timelineEvents[request.email]?.length > 0 ? (
                                  timelineEvents[request.email].map((event) => (
                                    <div
                                      key={event.id}
                                      className="bg-white rounded p-3 text-sm"
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                          <p className="font-medium text-foreground">
                                            {event.title}
                                          </p>
                                          <p className="text-xs text-foreground/60">
                                            {event.date}
                                          </p>
                                        </div>
                                        <span
                                          className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                                            event.status === "completed"
                                              ? "bg-green-100 text-green-700"
                                              : event.status === "upcoming"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-amber-100 text-amber-700"
                                          }`}
                                        >
                                          {event.status}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-foreground/60">
                                    No timeline events yet
                                  </p>
                                )}
                              </div>

                              {/* Add Event Form */}
                              {showTimelineForm === request.email && (
                                <div className="bg-white rounded p-3 border border-blue-200 space-y-3">
                                  <input
                                    type="text"
                                    placeholder="Event title"
                                    value={timelineFormData.title}
                                    onChange={(e) =>
                                      setTimelineFormData({
                                        ...timelineFormData,
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                    <input
                                      type="date"
                                      value={timelineFormData.date}
                                      onChange={(e) =>
                                        setTimelineFormData({
                                          ...timelineFormData,
                                          date: e.target.value,
                                        })
                                      }
                                      className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <select
                                      value={timelineFormData.status}
                                      onChange={(e) =>
                                        setTimelineFormData({
                                          ...timelineFormData,
                                          status: e.target.value as
                                            | "completed"
                                            | "pending"
                                            | "upcoming",
                                        })
                                      }
                                      className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                      <option value="completed">Completed</option>
                                      <option value="pending">Pending</option>
                                      <option value="upcoming">Upcoming</option>
                                    </select>
                                  </div>
                                  <select
                                    value={timelineFormData.type}
                                    onChange={(e) =>
                                      setTimelineFormData({
                                        ...timelineFormData,
                                        type: e.target.value as
                                          | "submission"
                                          | "update"
                                          | "scheduled"
                                          | "email",
                                      })
                                    }
                                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    <option value="update">Update</option>
                                    <option value="email">Email</option>
                                    <option value="submission">Submission</option>
                                    <option value="scheduled">Scheduled</option>
                                  </select>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        handleAddTimelineEvent(request.email)
                                      }
                                      className="flex-1 bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
                                    >
                                      Add Event
                                    </button>
                                    <button
                                      onClick={() =>
                                        setShowTimelineForm(null)
                                      }
                                      className="flex-1 bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded hover:bg-slate-300"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Customer Actions */}
                          {request.approvalStatus === "pending" && (
                            <div className="flex gap-3 border-t border-current border-opacity-10 pt-4">
                              <Button
                                onClick={() =>
                                  handleApproveCustomer(request.email)
                                }
                                disabled={actionLoading === request.email}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4" />
                                {actionLoading === request.email
                                  ? "Approving..."
                                  : "Approve"}
                              </Button>
                              <Button
                                onClick={() =>
                                  handleRejectCustomer(request.email)
                                }
                                disabled={actionLoading === request.email}
                                variant="destructive"
                                className="flex-1 flex items-center justify-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                {actionLoading === request.email
                                  ? "Rejecting..."
                                  : "Reject"}
                              </Button>
                            </div>
                          )}
                        </>
                      )}

                      {/* Provider Request Details */}
                      {request._type === "partner" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                                Contact
                              </p>
                              <p className="text-sm text-foreground/80">
                                {request.contact_name}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                                Email
                              </p>
                              <p className="text-sm text-foreground/80">
                                {request.contact_email}
                              </p>
                            </div>
                          </div>

                          {request.contact_phone && (
                            <div>
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                                Phone
                              </p>
                              <p className="text-sm text-foreground/80">
                                {request.contact_phone}
                              </p>
                            </div>
                          )}

                          {request.expertise?.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                                Areas of Expertise
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {request.expertise.map((area) => (
                                  <span
                                    key={area}
                                    className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                                  >
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                              Description
                            </p>
                            <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                              {request.description}
                            </p>
                          </div>

                          {request.reviewed_at && (
                            <div className="bg-slate-50 rounded p-3 border border-slate-200">
                              <p className="text-xs font-semibold text-slate-900 mb-1">
                                Review Info
                              </p>
                              <p className="text-sm text-slate-800">
                                Reviewed on{" "}
                                {new Date(request.reviewed_at).toLocaleString()}{" "}
                                by {request.reviewed_by}
                              </p>
                              {request.notes && (
                                <p className="text-sm text-slate-800 mt-2">
                                  Notes: {request.notes}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Provider Actions */}
                          {editingPartnerId === request.id ? (
                            <div className="bg-blue-50 rounded p-4 border border-blue-200 space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                  Status
                                </label>
                                <select
                                  value={editPartnerStatus}
                                  onChange={(e) =>
                                    setEditPartnerStatus(
                                      e.target.value as
                                        | "pending"
                                        | "reviewed"
                                        | "approved"
                                        | "rejected"
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="reviewed">Reviewed</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                  Notes
                                </label>
                                <textarea
                                  value={editPartnerNotes}
                                  onChange={(e) =>
                                    setEditPartnerNotes(e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  placeholder="Optional notes"
                                  rows={3}
                                />
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdatePartnerStatus(request.id)
                                  }
                                  disabled={updating}
                                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm disabled:opacity-50"
                                >
                                  {updating ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingPartnerId(null);
                                    setEditPartnerStatus("pending");
                                    setEditPartnerNotes("");
                                  }}
                                  className="flex-1 bg-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-300 font-medium text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            request.status === "pending" && (
                              <button
                                onClick={() => {
                                  setEditingPartnerId(request.id);
                                  setEditPartnerStatus("reviewed");
                                  setEditPartnerNotes("");
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                              >
                                <Calendar className="w-4 h-4" />
                                Review Request
                              </button>
                            )
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
