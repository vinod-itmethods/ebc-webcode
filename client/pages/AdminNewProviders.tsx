import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, X } from "lucide-react";

interface CustomProvider {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  categories: string[];
  topics: string[];
  benefits: string[];
  domain?: string;
}

const AVAILABLE_CATEGORIES = [
  "ai",
  "cloud",
  "devops",
  "platform",
  "security",
  "data",
];

export default function AdminNewProviders() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [providers, setProviders] = useState<CustomProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<CustomProvider>>({
    name: "",
    tagline: "",
    description: "",
    logo: "",
    categories: [],
    topics: [],
    benefits: [],
    domain: "",
  });

  const [topicInput, setTopicInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("adminEmail");
    if (!email || !email.endsWith("@itmethods.com")) {
      navigate("/admin");
      return;
    }
    setAdminEmail(email);
    loadProviders();
  }, [navigate]);

  const loadProviders = async () => {
    try {
      const response = await fetch("/api/custom-providers");
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers || []);
      } else {
        console.error("Failed to load providers");
      }
    } catch (error) {
      console.error("Error loading providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProvider = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.tagline || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.categories?.length === 0) {
      alert("Please select at least one category");
      return;
    }

    try {
      const newProvider: CustomProvider = {
        id: `custom_${Date.now()}`,
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        logo: formData.logo || "https://via.placeholder.com/200",
        categories: formData.categories || [],
        topics: formData.topics || [],
        benefits: formData.benefits || [],
        domain: formData.domain,
      };

      const updated = editingId
        ? providers.map((p) => (p.id === editingId ? newProvider : p))
        : [...providers, newProvider];

      setProviders(updated);
      localStorage.setItem("custom_providers", JSON.stringify(updated));

      // Reset form
      resetForm();
      alert(
        editingId
          ? "Provider updated successfully!"
          : "Provider added successfully!",
      );
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      tagline: "",
      description: "",
      logo: "",
      categories: [],
      topics: [],
      benefits: [],
      domain: "",
    });
    setTopicInput("");
    setBenefitInput("");
    setEditingId(null);
  };

  const handleEditProvider = (provider: CustomProvider) => {
    setFormData(provider);
    setEditingId(provider.id);
  };

  const handleDeleteProvider = (id: string) => {
    if (!confirm("Are you sure you want to delete this provider?")) {
      return;
    }
    const updated = providers.filter((p) => p.id !== id);
    setProviders(updated);
    localStorage.setItem("custom_providers", JSON.stringify(updated));
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => {
      const current = prev.categories || [];
      const updated = current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category];
      return { ...prev, categories: updated };
    });
  };

  const addTopic = () => {
    if (!topicInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      topics: [...(prev.topics || []), topicInput],
    }));
    setTopicInput("");
  };

  const removeTopic = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics?.filter((_, i) => i !== index),
    }));
  };

  const addBenefit = () => {
    if (!benefitInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      benefits: [...(prev.benefits || []), benefitInput],
    }));
    setBenefitInput("");
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits?.filter((_, i) => i !== index),
    }));
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
                Add Technology Providers
              </h1>
              <p className="text-foreground/60 mt-2">
                Create new technology provider profiles for the briefing platform
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
        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg border border-border p-8 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editingId ? "Edit Provider" : "Add New Provider"}
          </h2>

          <form onSubmit={handleAddProvider} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Provider Name *
                </label>
                <Input
                  placeholder="e.g., Vercel"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tagline *
                </label>
                <Input
                  placeholder="e.g., Serverless platform for web applications"
                  value={formData.tagline || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                placeholder="Detailed description of what this provider does"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Logo and Domain */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Logo URL
                </label>
                <Input
                  placeholder="https://example.com/logo.png"
                  value={formData.logo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Domain
                </label>
                <Input
                  placeholder="example.com"
                  value={formData.domain || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, domain: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Categories *
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      formData.categories?.includes(cat)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-foreground hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Topics (Key Discussion Areas)
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a topic"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTopic();
                    }
                  }}
                />
                <Button type="button" onClick={addTopic}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.topics?.map((topic, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 flex items-center gap-2"
                  >
                    <span className="text-sm text-foreground">{topic}</span>
                    <button
                      type="button"
                      onClick={() => removeTopic(idx)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Benefits
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a benefit"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addBenefit();
                    }
                  }}
                />
                <Button type="button" onClick={addBenefit}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.benefits?.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="bg-green-50 border border-green-200 rounded-full px-3 py-1 flex items-center gap-2"
                  >
                    <span className="text-sm text-foreground">{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(idx)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Provider" : "Add Provider"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="secondary-outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Providers List */}
        {providers.length > 0 && (
          <div className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="px-8 py-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Added Providers ({providers.length})
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-8">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {provider.logo && (
                    <img
                      src={provider.logo}
                      alt={provider.name}
                      className="w-12 h-12 mb-3 rounded"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {provider.name}
                  </h3>
                  <p className="text-sm text-foreground/70 mb-3">
                    {provider.tagline}
                  </p>

                  <div className="mb-3">
                    <p className="text-xs font-medium text-foreground/60 mb-1">
                      Categories:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {provider.categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-1 bg-gray-100 text-xs rounded text-foreground"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary-outline"
                      size="sm"
                      onClick={() => handleEditProvider(provider)}
                      className="flex-1"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProvider(provider.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
