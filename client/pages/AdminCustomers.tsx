import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, AlertCircle } from "lucide-react";

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
  approvalStatus: "pending" | "approved" | "rejected";
  approvedAt?: string;
  approvedBy?: string;
}

interface AdminCustomersResponse {
  pending: CustomerProfile[];
  approved: CustomerProfile[];
  rejected: CustomerProfile[];
}

const STEP_NAMES = [
  "Areas of Interest",
  "Decision Context",
  "Technology Perspectives",
  "Technology Vendors",
  "Location & Format",
  "Goals & Outcomes",
  "Contact Details",
];

export default function AdminCustomers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<AdminCustomersResponse>({
    pending: [],
    approved: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    if (!storedEmail || !storedEmail.endsWith("@itmethods.com")) {
      navigate("/admin");
      return;
    }
    setAdminEmail(storedEmail);
    fetchCustomers(storedEmail);
  }, [navigate]);

  const fetchCustomers = async (email: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/customers?adminEmail=${encodeURIComponent(email)}`);

      if (!response.ok) {
        throw new Error("Unauthorized or failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (customerEmail: string) => {
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

      // Refresh the customer list
      await fetchCustomers(adminEmail);
      setExpandedId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error approving customer");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (customerEmail: string) => {
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

      // Refresh the customer list
      await fetchCustomers(adminEmail);
      setExpandedId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error rejecting customer");
    } finally {
      setActionLoading(null);
    }
  };

  const getDisplayCustomers = (): CustomerProfile[] => {
    if (filter === "all") {
      return [...customers.pending, ...customers.approved, ...customers.rejected];
    }
    return customers[filter as keyof AdminCustomersResponse];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <X className="w-5 h-5 text-red-600" />;
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
      default:
        return "bg-amber-50 border-amber-200";
    }
  };

  const displayCustomers = getDisplayCustomers().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Admin Header */}
      <section className="border-b border-border/10 bg-gradient-to-r from-slate-50 to-blue-50/30 px-4 py-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-foreground">Customer Requests</h2>
          <p className="text-sm text-foreground/60">Approve or reject briefing requests from customers</p>
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
                {customers.pending.length + customers.approved.length + customers.rejected.length}
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Pending</p>
              <p className="text-3xl font-bold text-amber-600">{customers.pending.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Approved</p>
              <p className="text-3xl font-bold text-green-600">{customers.approved.length}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{customers.rejected.length}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border/10">
            {["pending", "approved", "rejected", "all"].map((tab) => (
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
              <p className="text-foreground/60">Loading customers...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Customers List */}
          {!loading && !error && displayCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60">No {filter === "all" ? "" : filter} customers</p>
            </div>
          )}

          {!loading && !error && displayCustomers.length > 0 && (
            <div className="space-y-3">
              {displayCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${getStatusColor(customer.approvalStatus)}`}
                >
                  {/* Summary Row */}
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === customer.id ? null : customer.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
                  >
                    <div className="flex-grow text-left">
                      <div className="flex items-start justify-between gap-4 w-full">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-1">
                            {getStatusIcon(customer.approvalStatus)}
                            <h3 className="font-semibold text-foreground">{customer.name}</h3>
                          </div>
                          <p className="text-sm text-foreground/70 ml-8">{customer.company}</p>
                          <p className="text-sm text-foreground/70 ml-8">{customer.email}</p>
                          <p className="text-xs text-foreground/50 mt-1 ml-8">
                            Submitted {new Date(customer.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                              customer.approvalStatus === "approved"
                                ? "bg-green-100 text-green-700"
                                : customer.approvalStatus === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {customer.approvalStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expandedId === customer.id && (
                    <div className="border-t border-current border-opacity-20 bg-white/50 px-6 py-4 space-y-6">
                      {/* Briefing Data */}
                      {customer.briefingData && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground text-sm">Briefing Request Details</h4>

                          {customer.briefingData.interests && customer.briefingData.interests.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                                Areas of Interest
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {customer.briefingData.interests.map((interest: string) => (
                                  <span key={interest} className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {customer.briefingData.vendors && customer.briefingData.vendors.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                                Selected Vendors
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {customer.briefingData.vendors.map((vendor: string) => (
                                  <span key={vendor} className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                                    {vendor}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {customer.briefingData.location && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Location</p>
                                <p className="text-sm text-foreground/80">{customer.briefingData.location}</p>
                              </div>
                              {customer.briefingData.format && (
                                <div>
                                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Format</p>
                                  <p className="text-sm text-foreground/80">{customer.briefingData.format}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {customer.briefingData.goals && (
                            <div>
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Goals</p>
                              <p className="text-sm text-foreground/80">{customer.briefingData.goals}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-4 border-t border-current border-opacity-10 pt-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Role</p>
                          <p className="text-sm text-foreground/80">{customer.role || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Email</p>
                          <p className="text-sm text-foreground/80">{customer.email}</p>
                        </div>
                      </div>

                      {/* Approval Info */}
                      {customer.approvalStatus === "approved" && customer.approvedAt && (
                        <div className="bg-green-50 rounded p-3 border border-green-200">
                          <p className="text-xs font-semibold text-green-900 mb-1">Approved</p>
                          <p className="text-sm text-green-800">
                            Approved on {new Date(customer.approvedAt).toLocaleString()} by {customer.approvedBy}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      {customer.approvalStatus === "pending" && (
                        <div className="flex gap-3 border-t border-current border-opacity-10 pt-4">
                          <Button
                            onClick={() => handleApprove(customer.email)}
                            disabled={actionLoading === customer.email}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                            {actionLoading === customer.email ? "Approving..." : "Approve"}
                          </Button>
                          <Button
                            onClick={() => handleReject(customer.email)}
                            disabled={actionLoading === customer.email}
                            variant="destructive"
                            className="flex-1 flex items-center justify-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            {actionLoading === customer.email ? "Rejecting..." : "Reject"}
                          </Button>
                        </div>
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
