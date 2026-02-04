import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, Edit2 } from "lucide-react";

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

export default function AdminPartnerRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<
    "pending" | "reviewed" | "approved" | "rejected"
  >("pending");
  const [editNotes, setEditNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    if (!storedEmail || !storedEmail.endsWith("@itmethods.com")) {
      navigate("/admin");
      return;
    }
    setAdminEmail(storedEmail);
    fetchRequests(storedEmail);
  }, [navigate]);

  const fetchRequests = async (email: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/partner-requests?adminEmail=${encodeURIComponent(email)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();
      setRequests(data.requests || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string) => {
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
          status: editStatus,
          notes: editNotes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request");
      }

      setEditingId(null);
      await fetchRequests(adminEmail);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update request");
    } finally {
      setUpdating(false);
    }
  };

  const getDisplayRequests = () => {
    if (filter === "pending") {
      return requests.filter((r) => r.status === "pending");
    }
    return requests;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "reviewed":
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 border-green-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      case "reviewed":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-amber-50 border-amber-200";
    }
  };

  const displayRequests = getDisplayRequests().sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Admin Header */}
      <section className="border-b border-border/10 bg-gradient-to-r from-slate-50 to-blue-50/30 px-4 py-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">
              Partner Access Requests
            </h2>
            <div className="flex gap-3">
              <a
                href="/admin/submissions"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                → View Submissions
              </a>
              <span className="text-foreground/30">|</span>
              <a
                href="/admin/requests"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                → Manage All Requests
              </a>
            </div>
          </div>
          <p className="text-sm text-foreground/60">
            Manage requests from technology providers wanting to join the
            ecosystem
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Total</p>
              <p className="text-3xl font-bold text-foreground">
                {requests.length}
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Pending</p>
              <p className="text-3xl font-bold text-amber-600">
                {requests.filter((r) => r.status === "pending").length}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Reviewed</p>
              <p className="text-3xl font-bold text-blue-600">
                {requests.filter((r) => r.status === "reviewed").length}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {requests.filter((r) => r.status === "approved").length}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border/10">
            {["pending", "all"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-4 py-2 border-b-2 transition-colors capitalize ${
                  filter === tab
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab}
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
                No {filter === "all" ? "" : filter} requests
              </p>
            </div>
          )}

          {/* Requests List */}
          {!loading && !error && displayRequests.length > 0 && (
            <div className="space-y-3">
              {displayRequests.map((request) => (
                <div
                  key={request.id}
                  className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${getStatusColor(
                    request.status,
                  )}`}
                >
                  {/* Summary Row */}
                  <button
                    onClick={() =>
                      setExpandedId(
                        expandedId === request.id ? null : request.id,
                      )
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
                  >
                    <div className="flex-grow text-left">
                      <div className="flex items-start justify-between gap-4 w-full">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-1">
                            {getStatusIcon(request.status)}
                            <h3 className="font-semibold text-foreground">
                              {request.company_name}
                            </h3>
                          </div>
                          <p className="text-sm text-foreground/70 ml-8">
                            {request.contact_name} • {request.contact_email}
                          </p>
                          <p className="text-xs text-foreground/50 mt-1 ml-8">
                            Submitted{" "}
                            {new Date(request.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                              request.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : request.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : request.status === "reviewed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expandedId === request.id && (
                    <div className="border-t border-current border-opacity-20 bg-white/50 px-6 py-4 space-y-6">
                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                            Contact Name
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

                      {/* Expertise */}
                      {request.expertise && request.expertise.length > 0 && (
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

                      {/* Description */}
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                          Description
                        </p>
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                          {request.description}
                        </p>
                      </div>

                      {/* Review Info */}
                      {request.reviewed_at && (
                        <div className="bg-slate-50 rounded p-3 border border-slate-200">
                          <p className="text-xs font-semibold text-slate-900 mb-1">
                            Review Info
                          </p>
                          <p className="text-sm text-slate-800">
                            Reviewed on{" "}
                            {new Date(request.reviewed_at).toLocaleString()} by{" "}
                            {request.reviewed_by}
                          </p>
                          {request.notes && (
                            <p className="text-sm text-slate-800 mt-2">
                              Notes: {request.notes}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      {editingId === request.id ? (
                        <div className="bg-blue-50 rounded p-4 border border-blue-200 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Status
                            </label>
                            <select
                              value={editStatus}
                              onChange={(e) =>
                                setEditStatus(
                                  e.target.value as
                                    | "pending"
                                    | "reviewed"
                                    | "approved"
                                    | "rejected",
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
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="Optional notes about this request"
                              rows={3}
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(request.id)}
                              disabled={updating}
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm disabled:opacity-50"
                            >
                              {updating ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditStatus("pending");
                                setEditNotes("");
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
                              setEditingId(request.id);
                              setEditStatus("reviewed");
                              setEditNotes("");
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                          >
                            <Edit2 className="w-4 h-4" />
                            Review Request
                          </button>
                        )
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
