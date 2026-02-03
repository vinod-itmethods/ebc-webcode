import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { partners as originalPartners, type Partner } from "@/data/partners";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

type CategoryType = "cloud" | "ai" | "devops" | "platform" | "security" | "data";

const categories: { id: CategoryType; label: string }[] = [
  { id: "cloud", label: "Cloud & Infrastructure" },
  { id: "ai", label: "AI & Machine Learning" },
  { id: "devops", label: "DevOps & Continuous Delivery" },
  { id: "platform", label: "Platform & Architecture" },
  { id: "security", label: "Security & Compliance" },
  { id: "data", label: "Data & Analytics" },
];

export default function Partners() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedVendors, setSelectedVendors] = useState<string[]>(() => {
    // Initialize from localStorage
    return JSON.parse(localStorage.getItem('vendor_wishlist') || '[]') as string[];
  });
  const [customProviders, setCustomProviders] = useState<Partner[]>([]);
  const returnTo = searchParams.get('returnTo'); // Check if coming from briefing form
  const fromStep = searchParams.get('step') || '4'; // Default to step 4

  // Load custom providers from API
  useEffect(() => {
    const loadCustomProviders = async () => {
      try {
        const response = await fetch("/api/custom-providers");
        if (response.ok) {
          const data = await response.json();
          const converted = (data.providers || []).map((cp: any) => ({
            id: cp.id,
            name: cp.name,
            logo: cp.logo,
            tagline: cp.tagline,
            description: cp.description,
            topics: cp.topics || [],
            benefits: cp.benefits || [],
            categories: cp.categories || [],
            domain: cp.domain,
          }));
          setCustomProviders(converted);
        }
      } catch (error) {
        console.error("Error loading custom providers:", error);
      }
    };

    loadCustomProviders();
  }, []);

  // Load partners with any edited data from localStorage, plus custom providers
  const partners = useMemo(() => {
    let result = originalPartners.map(partner => {
      const savedData = localStorage.getItem(`partner_${partner.id}`);
      if (savedData) {
        try {
          return JSON.parse(savedData) as Partner;
        } catch {
          return partner;
        }
      }
      return partner;
    });

    // Add custom providers from API
    result = [...result, ...customProviders];

    // Filter by selected category
    if (selectedCategory) {
      result = result.filter(partner => partner.categories.includes(selectedCategory));
    }

    return result;
  }, [selectedCategory, customProviders]);

  const toggleVendor = (vendorId: string) => {
    setSelectedVendors(prev => {
      if (prev.includes(vendorId)) {
        return prev.filter(id => id !== vendorId);
      } else {
        return [...prev, vendorId];
      }
    });
  };

  // Save selected vendors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('vendor_wishlist', JSON.stringify(selectedVendors));
  }, [selectedVendors]);

  const handleAddSelectedAndReturn = () => {
    if (returnTo === 'briefing') {
      navigate(`/request-briefing?step=${fromStep}`);
    }
  };

  const handleBackToBriefing = () => {
    navigate(`/request-briefing?step=${fromStep}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Back to Briefing Bar */}
      {returnTo === 'briefing' && (
        <section className="sticky top-16 z-40 bg-blue-50 border-b border-blue-200 py-3 shadow-sm">
          <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
            <p className="text-sm text-foreground/70">Browsing more vendors for your briefing request</p>
            <Button
              onClick={handleBackToBriefing}
              variant="secondary"
              size="sm"
              className="rounded-lg font-medium"
            >
              Back to briefing
            </Button>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-white to-blue-50/40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-slate-50/50"></div>
        </div>

        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Technology providers</h1>
            <p className="text-lg text-foreground/90 max-w-2xl mx-auto">
              Executive Briefings bring perspectives from a broad range of leading technology providers, selected for relevance to your organization's strategic priorities.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-4 bg-white border-b border-border/10">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <label htmlFor="category-filter" className="text-sm font-semibold text-foreground">
              Filter by category:
            </label>
            <select
              id="category-filter"
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value ? (e.target.value as CategoryType) : null)}
              className="px-4 py-2 rounded-lg border border-border bg-white text-foreground font-medium transition-all hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Partner Grid */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            {partners.map((partner) => {
              const isSelected = selectedVendors.includes(partner.id);
              return (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className={`flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 transition-all ${
                    isSelected ? 'ring-2 ring-primary shadow-lg bg-primary/5' : 'hover:shadow-lg hover:bg-white'
                  }`}
                  style={{ height: "160px" }}
                >
                  {/* Logo */}
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.style.display = "none";
                      el.parentElement!.innerHTML =
                        '<div class="text-xs font-medium text-slate-400 text-center px-2">' +
                        partner.name +
                        "</div>";
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border/10 p-6 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img
                    src={selectedPartner.logo}
                    alt={selectedPartner.name}
                    className="max-h-14 max-w-full object-contain"
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.style.display = "none";
                      el.parentElement!.innerHTML =
                        '<div class="text-xs font-medium text-slate-400">' +
                        selectedPartner.name +
                        "</div>";
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedPartner.name}</h2>
                  <p className="text-foreground/70 mt-1">{selectedPartner.tagline}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <p className="text-foreground/70 leading-relaxed">{selectedPartner.description}</p>
              </div>

              {/* Example Discussion Topics */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                  Example discussion topics
                </h3>
                <ul className="space-y-2">
                  {selectedPartner.topics.map((topic, idx) => (
                    <li key={idx} className="flex gap-3 text-foreground/70">
                      <span className="text-primary font-bold">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What You'll Get */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                  What you'll get from this session
                </h3>
                <ul className="space-y-2">
                  {selectedPartner.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex gap-3 text-foreground/70">
                      <span className="text-primary font-bold">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Featured Speaker Section */}
              {selectedPartner.speakerImage && selectedPartner.speakerQuote && (
                <div className="space-y-4 pt-2">
                  {/* Speaker Header */}
                  <div>
                    <p className="text-sm text-primary font-semibold uppercase tracking-wide mb-4">
                      Featured Speaker: <span className="text-foreground font-bold">{selectedPartner.speakerName}, {selectedPartner.speakerTitle?.split(',')[0]}</span>
                    </p>
                    <div className="flex gap-4 items-start">
                      <img
                        src={selectedPartner.speakerImage}
                        alt={selectedPartner.speakerName}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        {selectedPartner.speakerBio}
                      </p>
                    </div>
                  </div>

                  {/* Speaker Quote */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-5 border border-blue-200 italic text-foreground text-sm">
                    "{selectedPartner.speakerQuote}"
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 border-t border-border/10 bg-white p-6 flex gap-3">
              <Button
                onClick={() => {
                  toggleVendor(selectedPartner.id);
                  setSelectedPartner(null);
                }}
                className="flex-1 font-semibold rounded-lg"
              >
                {selectedVendors.includes(selectedPartner.id) ? "Remove from wishlist" : "Add to wishlist"}
              </Button>
              <Button
                onClick={() => {
                  // Calculate the updated vendors list before navigating
                  const updatedVendors = selectedVendors.includes(selectedPartner.id)
                    ? selectedVendors.filter(id => id !== selectedPartner.id)
                    : [...selectedVendors, selectedPartner.id];

                  localStorage.setItem('vendor_wishlist', JSON.stringify(updatedVendors));
                  navigate(`/request-briefing?step=${returnTo === 'briefing' ? fromStep : '4'}`);
                }}
                variant="secondary-outline"
                className="flex-1 font-semibold rounded-lg"
              >
                Request a briefing
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-teal-50/40 via-blue-50/30 to-white">
        <div className="container max-w-2xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
            Ready to plan your briefing?
          </h2>
          <p className="text-foreground/70">
            Select the technology partners you'd like to engage with and we'll design a briefing around your priorities.
          </p>
          <Button
            asChild
            size="lg"
            className="font-semibold px-8 rounded-lg"
          >
            <Link to="/request-briefing">Request a briefing</Link>
          </Button>
        </div>
      </section>

      {/* Action Buttons - Only show when coming from briefing */}
      {returnTo === 'briefing' && (
        <section className="py-8 bg-blue-50 border-t border-border/10">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Selected vendors</h3>
                  {selectedVendors.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedVendors.map(vendorId => {
                        const vendor = originalPartners.find(p => p.id === vendorId);
                        return vendor ? (
                          <div key={vendorId} className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                            <span className="text-sm font-medium text-foreground">{vendor.name}</span>
                            <button
                              onClick={() => toggleVendor(vendorId)}
                              className="text-primary hover:text-primary/70 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-foreground/60">No vendors selected yet</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddSelectedAndReturn}
                    disabled={selectedVendors.length === 0}
                    className="flex-1 font-semibold rounded-lg"
                  >
                    Add selected vendors & return
                  </Button>
                  <Button
                    variant="secondary-outline"
                    className="flex-1 font-semibold rounded-lg"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Select more vendors
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
