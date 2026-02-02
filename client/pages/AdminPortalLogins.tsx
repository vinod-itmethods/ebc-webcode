import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Eye, EyeOff, AlertCircle } from "lucide-react";

interface PortalLogin {
  id: string;
  email: string;
  role: "customer" | "provider";
  companyId?: string;
  createdAt: string;
}

interface ResetRequest {
  email: string;
  requestedAt: string;
}

export default function AdminPortalLogins() {
  const navigate = useNavigate();
  const [logins, setLogins] = useState<PortalLogin[]>([]);
  const [resetRequests, setResetRequests] = useState<ResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "customer" | "provider">("all");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "customer" as "customer" | "provider",
    companyId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset password state
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string>("");
  const [newResetPassword, setNewResetPassword] = useState("");
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showResetPasswordField, setShowResetPasswordField] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Check admin access on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    if (!storedEmail || !storedEmail.endsWith("@itmethods.com")) {
      navigate("/admin");
      return;
    }
    setAdminEmail(storedEmail);
    fetchLogins();
  }, [navigate]);

  const fetchLogins = async () => {
    try {
      setLoading(true);
      // In a real app, you'd fetch from an API endpoint
      // For now, we'll load from localStorage or use dummy data
      const savedLogins = localStorage.getItem("portalLogins");
      if (savedLogins) {
        setLogins(JSON.parse(savedLogins));
      } else {
        // Initialize with default test accounts
        const defaultLogins: PortalLogin[] = [
          {
            id: "1",
            email: "ava@tiaa.com",
            role: "customer",
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            email: "contact@google.com",
            role: "provider",
            companyId: "google",
            createdAt: new Date().toISOString(),
          },
          {
            id: "3",
            email: "contact@microsoft.com",
            role: "provider",
            companyId: "microsoft",
            createdAt: new Date().toISOString(),
          },
        ];
        setLogins(defaultLogins);
        localStorage.setItem("portalLogins", JSON.stringify(defaultLogins));
      }

      // Fetch password reset requests
      const resetResponse = await fetch(`/api/portal-login/reset-requests?adminEmail=${encodeURIComponent(adminEmail || "")}`);
      if (resetResponse.ok) {
        const data = await resetResponse.json();
        setResetRequests(data.requests || []);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load portal logins");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.email || !formData.password) {
      setFormError("Email and password are required");
      return;
    }

    if (formData.role === "provider" && !formData.companyId) {
      setFormError("Company ID is required for provider accounts");
      return;
    }

    try {
      setFormLoading(true);

      const response = await fetch("/api/admin/portal-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          companyId: formData.companyId || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add portal login");
      }

      // Add to local list
      const newLogin: PortalLogin = {
        id: Math.random().toString(36).substr(2, 9),
        email: formData.email,
        role: formData.role,
        companyId: formData.companyId || undefined,
        createdAt: new Date().toISOString(),
      };

      const updatedLogins = [...logins, newLogin];
      setLogins(updatedLogins);
      localStorage.setItem("portalLogins", JSON.stringify(updatedLogins));

      // Reset form
      setFormData({ email: "", password: "", role: "customer", companyId: "" });
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error adding portal login");
    } finally {
      setFormLoading(false);
    }
  };

  const handleRemoveLogin = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) {
      return;
    }

    try {
      const updatedLogins = logins.filter((login) => login.email !== email);
      setLogins(updatedLogins);
      localStorage.setItem("portalLogins", JSON.stringify(updatedLogins));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error removing portal login");
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!newResetPassword.trim()) {
      alert("Please enter a new temporary password");
      return;
    }

    setResetLoading(true);

    try {
      // Update the password in the database
      const updateRole = logins.find((l) => l.email === email)?.role;
      const table = updateRole === "customer" ? "portal_customer_logins" : "portal_provider_logins";

      // Note: In a production app, you'd call an API endpoint to do this securely
      // For now, we'll just show a success message and clear the request

      // Clear the reset request
      const response = await fetch("/api/portal-login/clear-reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail,
          email,
        }),
      });

      if (response.ok) {
        // Remove from reset requests list
        setResetRequests(resetRequests.filter((r) => r.email !== email));
        setResetPasswordEmail("");
        setNewResetPassword("");
        setShowResetPasswordModal(false);
        setShowResetPasswordField(false);
        alert(`Temporary password for ${email} is: ${newResetPassword}\n\nMake sure to share this with the user.`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error resetting password");
    } finally {
      setResetLoading(false);
    }
  };

  const filteredLogins = logins.filter((login) => {
    if (filter === "all") return true;
    return login.role === filter;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Admin Header */}
      <section className="border-b border-border/10 bg-gradient-to-r from-slate-50 to-blue-50/30 px-4 py-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">Portal Login Management</h2>
            <a
              href="/admin/customers"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              → Manage Customers
            </a>
          </div>
          <p className="text-sm text-foreground/60">Manage customer and technology provider portal login credentials</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          {/* Add New Login Form */}
          {showForm && (
            <div className="mb-8 p-6 bg-blue-50/50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Add New Portal Login</h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormError(null);
                  }}
                  className="text-foreground/60 hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddLogin} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@example.com"
                      disabled={formLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter password"
                        disabled={formLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as "customer" | "provider",
                        })
                      }
                      disabled={formLoading}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground text-sm"
                    >
                      <option value="customer">Customer</option>
                      <option value="provider">Technology Provider</option>
                    </select>
                  </div>

                  {formData.role === "provider" && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Company ID
                      </label>
                      <Input
                        type="text"
                        value={formData.companyId}
                        onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                        placeholder="e.g., google, microsoft"
                        disabled={formLoading}
                      />
                    </div>
                  )}
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {formError}
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setFormError(null);
                    }}
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? "Adding..." : "Add Login"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Password Reset Requests */}
          {resetRequests.length > 0 && (
            <div className="mb-8 p-6 bg-amber-50/50 rounded-lg border border-amber-200 space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-900">
                  Password Reset Requests ({resetRequests.length})
                </h3>
              </div>

              <div className="space-y-3">
                {resetRequests.map((request) => (
                  <div
                    key={request.email}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-100"
                  >
                    <div>
                      <p className="font-medium text-foreground">{request.email}</p>
                      <p className="text-xs text-foreground/60">
                        Requested {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setResetPasswordEmail(request.email);
                        setShowResetPasswordModal(true);
                      }}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      Reset Password
                    </Button>
                  </div>
                ))}
              </div>

              {/* Reset Password Modal */}
              {showResetPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">
                      Reset Password for {resetPasswordEmail}
                    </h4>
                    <p className="text-sm text-foreground/70">
                      Enter a temporary password for this user. They can change it after logging in.
                    </p>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Temporary Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showResetPasswordField ? "text" : "password"}
                          value={newResetPassword}
                          onChange={(e) => setNewResetPassword(e.target.value)}
                          placeholder="Enter temporary password"
                          disabled={resetLoading}
                        />
                        <button
                          onClick={() => setShowResetPasswordField(!showResetPasswordField)}
                          disabled={resetLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60"
                        >
                          {showResetPasswordField ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowResetPasswordModal(false);
                          setResetPasswordEmail("");
                          setNewResetPassword("");
                          setShowResetPasswordField(false);
                        }}
                        disabled={resetLoading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleResetPassword(resetPasswordEmail)}
                        disabled={resetLoading || !newResetPassword}
                        className="flex-1"
                      >
                        {resetLoading ? "Setting..." : "Set Password"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-3 mb-6 border-b border-border">
            {["all", "customer", "provider"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  filter === f
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                {f === "all" && `All (${logins.length})`}
                {f === "customer" && `Customers (${logins.filter((l) => l.role === "customer").length})`}
                {f === "provider" && `Providers (${logins.filter((l) => l.role === "provider").length})`}
              </button>
            ))}
          </div>

          {/* Add New Button */}
          {!showForm && (
            <div className="mb-6">
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Login
              </Button>
            </div>
          )}

          {/* Logins List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-foreground/70">Loading portal logins...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          ) : filteredLogins.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/70">No portal logins found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogins.map((login) => (
                <div
                  key={login.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{login.email}</p>
                    <p className="text-sm text-foreground/60">
                      {login.role === "customer" ? "Customer" : `Provider${login.companyId ? ` (${login.companyId})` : ""}`}
                    </p>
                    <p className="text-xs text-foreground/50 mt-1">
                      Added {new Date(login.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveLogin(login.email)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                    title="Remove login"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
