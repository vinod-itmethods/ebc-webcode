import { useState, useMemo } from "react";
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
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  // Load partners with any edited data from localStorage
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

    // Filter by selected category
    if (selectedCategory) {
      result = result.filter(partner => partner.categories.includes(selectedCategory));
    }

    return result;
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

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
      <section className="py-12 lg:py-16 bg-white border-b border-border/10">
        <div className="container max-w-7xl mx-auto px-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-6">Filter by category</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === null
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-foreground hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-foreground hover:bg-slate-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Grid */}
      <section className="py-20 lg:py-28">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {partners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => setSelectedPartner(partner)}
                className="group relative flex flex-col items-center cursor-pointer bg-slate-50 rounded-lg p-6 hover:shadow-lg hover:bg-white transition-all"
              >
                {/* Logo */}
                <div className="flex items-center justify-center mb-3" style={{ width: "240px", height: "120px" }}>
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.style.display = "none";
                      el.parentElement!.innerHTML =
                        '<div class="text-xs font-medium text-slate-400 text-center px-2">' +
                        partner.name +
                        "</div>";
                    }}
                  />
                </div>

                {/* Name */}
                <h3 className="font-semibold text-foreground text-center text-sm group-hover:text-primary transition-colors">
                  {partner.name}
                </h3>

                {/* Hover Tagline */}
                <p className="text-xs text-foreground/60 text-center mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {partner.tagline}
                </p>
              </button>
            ))}
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
            <div className="sticky bottom-0 border-t border-border/10 bg-white p-6">
              <Button
                asChild
                className="w-full font-semibold rounded-lg"
              >
                <Link to="/request-briefing">Include {selectedPartner.name}</Link>
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

      <Footer />
    </div>
  );
}
