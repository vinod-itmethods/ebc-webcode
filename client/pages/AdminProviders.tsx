import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { partners } from "@/data/partners";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

interface ProviderLogin {
  id: string;
  email: string;
  provider_id: string;
  provider_name: string;
}

export default function AdminProviders() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [providerLogins, setProviderLogins] = useState<ProviderLogin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newProviderId, setNewProviderId] = useState(partners[0]?.id || "");

  useEffect(() => {
    // Check authentication
    const email = localStorage.getItem("adminEmail");
    if (!email || !email.endsWith("@itmethods.com")) {
      navigate("/admin");
      return;
    }
    setAdminEmail(email);
    loadProviderLogins();
  }, [navigate]);

  const loadProviderLogins = async () => {
    try {
      setLoading(true);
      // Get stored provider mappings from localStorage
      const stored = localStorage.getItem("provider_login_mappings");
      if (stored) {
        setProviderLogins(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading provider logins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProviderLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newProviderId) {
      alert("Please fill in all fields");
      return;
    }

    const provider = partners.find((p) => p.id === newProviderId);
    if (!provider) {
      alert("Provider not found");
      return;
    }

    try {
      // Add to Supabase portal_provider_logins table
      const response = await fetch("/api/portal-login/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newEmail.toLowerCase(),
          password: "TemporaryPassword123!", // Placeholder, user should change
          role: "provider",
          companyId: newProviderId,
          adminEmail,
        }),
      });

      if (response.ok) {
        // Store the mapping locally
        const newMapping: ProviderLogin = {
          id: Date.now().toString(),
          email: newEmail.toLowerCase(),
          provider_id: newProviderId,
          provider_name: provider.name,
        };

        const updated = [...providerLogins, newMapping];
        setProviderLogins(updated);
        localStorage.setItem("provider_login_mappings", JSON.stringify(updated));

        setNewEmail("");
        setNewProviderId(partners[0]?.id || "");
        alert(`Provider login created for ${provider.name}`);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create provider login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the provider login");
    }
  };

  const handleDeleteProviderLogin = async (id: string) => {
    if (!confirm("Are you sure you want to delete this provider login?")) {
      return;
    }

    const updated = providerLogins.filter((p) => p.id !== id);
    setProviderLogins(updated);
    localStorage.setItem("provider_login_mappings", JSON.stringify(updated));
  };

  const getProviderName = (providerId: string) => {
    return partners.find((p) => p.id === providerId)?.name || providerId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-foreground/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Provider Logins
              </h1>
              <p className="text-foreground/60 mt-2">
                Map provider emails to their technology provider profiles
              </p>
            </div>
            <Button variant="secondary-outline" onClick={() => navigate("/admin")}>
              Back to Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Add New Provider Login Form */}
        <div className="bg-white rounded-lg border border-border p-8 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Provider Login
          </h2>

          <form onSubmit={handleAddProviderLogin} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Provider Email
                </label>
                <Input
                  type="email"
                  placeholder="provider@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Technology Provider
                </label>
                <select
                  value={newProviderId}
                  onChange={(e) => setNewProviderId(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground"
                >
                  {partners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button type="submit" className="w-full">
                  Add Provider Login
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Provider Logins List */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="px-8 py-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">
              Mapped Provider Logins
            </h2>
          </div>

          {providerLogins.length === 0 ? (
            <div className="px-8 py-12 text-center">
              <p className="text-foreground/60">No provider logins configured yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-border">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-foreground">
                      Provider Email
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-foreground">
                      Technology Provider
                    </th>
                    <th className="px-8 py-4 text-right text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {providerLogins.map((login) => (
                    <tr key={login.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4 text-foreground">{login.email}</td>
                      <td className="px-8 py-4 text-foreground">
                        {login.provider_name}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteProviderLogin(login.id)
                          }
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
