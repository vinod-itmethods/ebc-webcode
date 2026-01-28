import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { partners, type Partner } from "@/data/partners";
import { LogOut, CheckCircle2, AlertCircle, Upload, X, Plus } from "lucide-react";

type RegistrationStep = "not-started" | "in-progress" | "complete";

const COVERAGE_AREAS = [
  "AI & Machine Learning",
  "Cloud & Infrastructure",
  "DevOps & Continuous Delivery",
  "Platform & Architecture",
  "Security & Compliance",
  "Data & Analytics",
];

const REGISTRATION_STEPS = [
  "Company profile",
  "Areas of coverage",
  "Executive/SME contacts",
  "Confidentiality acknowledgement",
  "Participation preferences",
];

export default function PortalProvider() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "registration" | "preferences">("profile");
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStep>("in-progress");
  const [completedSteps, setCompletedSteps] = useState<number[]>([0, 1]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(["AI & Machine Learning", "Cloud & Infrastructure"]);
  const [availableForBriefings, setAvailableForBriefings] = useState(true);
  const [provideExecutiveSponsor, setProvideExecutiveSponsor] = useState(true);
  const [regions, setRegions] = useState("North America");
  const [selectedProviderId, setSelectedProviderId] = useState<string>(partners[0].id);
  const [providerData, setProviderData] = useState<Partner>(partners[0]);
  const [isSaved, setIsSaved] = useState(false);
  const [topics, setTopics] = useState<string[]>(partners[0].topics || []);
  const [additionalTopic, setAdditionalTopic] = useState("");

  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "contact@company.com";

  useEffect(() => {
    const isAuth = localStorage.getItem("portalAuthenticated") === "true";
    const role = localStorage.getItem("userRole");
    if (!isAuth || role !== "provider") {
      navigate("/portal");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Load provider profile data when provider selection changes
  useEffect(() => {
    const selected = partners.find(p => p.id === selectedProviderId);
    if (selected) {
      const savedData = localStorage.getItem(`partner_${selectedProviderId}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setProviderData(parsed);
          setTopics(parsed.topics || []);
          setAdditionalTopic(parsed.additionalTopic || "");
        } catch {
          setProviderData(selected);
          setTopics(selected.topics || []);
          setAdditionalTopic("");
        }
      } else {
        setProviderData(selected);
        setTopics(selected.topics || []);
        setAdditionalTopic("");
      }
    }
    setIsSaved(false);
  }, [selectedProviderId]);

  const handleLogout = () => {
    localStorage.removeItem("portalAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/portal");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setProviderData(prev => ({
          ...prev,
          speakerImage: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof Partner, value: string) => {
    setProviderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const addTopic = () => {
    if (additionalTopic.trim()) {
      setTopics([...topics, additionalTopic]);
      setAdditionalTopic("");
    }
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...(providerData.benefits || [])];
    newBenefits[index] = value;
    setProviderData(prev => ({
      ...prev,
      benefits: newBenefits
    }));
  };

  const addBenefit = () => {
    setProviderData(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), ""]
    }));
  };

  const removeBenefit = (index: number) => {
    setProviderData(prev => ({
      ...prev,
      benefits: prev.benefits?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSaveProfile = () => {
    const dataToSave = {
      ...providerData,
      topics,
      additionalTopic
    };
    localStorage.setItem(`partner_${selectedProviderId}`, JSON.stringify(dataToSave));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepIndex) ? prev.filter((i) => i !== stepIndex) : [...prev, stepIndex]
    );
  };

  const progressPercentage = (completedSteps.length / REGISTRATION_STEPS.length) * 100;

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
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">Technology Provider Portal</h1>
              <p className="text-lg text-foreground/90">This portal is for approved technology providers participating in Executive Briefing Council sessions. Use it to complete registration and indicate where you'd like to opt in.</p>
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

          {/* Registration Status Section */}
          <section className="mb-16 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Program Registration</h2>
              <p className="text-foreground/70 mb-6">Complete the steps below to register for the Executive Briefing Council program.</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Overall Progress</p>
                <p className="text-sm text-foreground/70">{Math.round(progressPercentage)}%</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-[hsl(45_82%_52%)] h-2 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Registration Checklist */}
            <div className="space-y-3">
              {REGISTRATION_STEPS.map((step, index) => (
                <button
                  key={index}
                  onClick={() => toggleStep(index)}
                  className="w-full p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-all text-left flex items-center gap-3 bg-white"
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      completedSteps.includes(index)
                        ? "bg-[hsl(45_82%_52%)] border-[hsl(45_82%_52%)]"
                        : "border-slate-300"
                    }`}
                  >
                    {completedSteps.includes(index) && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span
                    className={`font-medium ${
                      completedSteps.includes(index)
                        ? "text-foreground/60"
                        : "text-foreground"
                    }`}
                  >
                    {step}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Opt In Section */}
          <section className="mb-16 space-y-8 pb-16 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Opt in to Briefing Opportunities</h2>
              <p className="text-foreground/70 mb-6">Select the domains you support and indicate your participation preferences.</p>
            </div>

            {/* Coverage Areas */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-foreground">Select domains you support:</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {COVERAGE_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${
                      selectedAreas.includes(area)
                        ? "border-[hsl(45_82%_52%)] bg-[hsl(45_82%_52%/8%)] text-foreground"
                        : "border-slate-200 bg-white text-foreground/70 hover:border-slate-300"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Participation Preferences */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-lg border border-slate-200">
              <label className="text-sm font-semibold text-foreground">Participation preferences:</label>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Available for executive briefings</p>
                  <p className="text-sm text-foreground/70">Yes / No</p>
                </div>
                <button
                  onClick={() => setAvailableForBriefings(!availableForBriefings)}
                  className={`px-4 py-2 rounded font-medium transition-all ${
                    availableForBriefings
                      ? "bg-[hsl(45_82%_52%)] text-white"
                      : "bg-slate-300 text-foreground"
                  }`}
                >
                  {availableForBriefings ? "Yes" : "No"}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Will provide executive sponsor</p>
                  <p className="text-sm text-foreground/70">Yes / No</p>
                </div>
                <button
                  onClick={() => setProvideExecutiveSponsor(!provideExecutiveSponsor)}
                  className={`px-4 py-2 rounded font-medium transition-all ${
                    provideExecutiveSponsor
                      ? "bg-[hsl(45_82%_52%)] text-white"
                      : "bg-slate-300 text-foreground"
                  }`}
                >
                  {provideExecutiveSponsor ? "Yes" : "No"}
                </button>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Regions supported (optional)</label>
                <input
                  type="text"
                  value={regions}
                  onChange={(e) => setRegions(e.target.value)}
                  placeholder="e.g., North America, EMEA, APAC"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-foreground"
                />
              </div>
            </div>
          </section>

          {/* Important Note */}
          <div className="mb-12 p-6 bg-blue-50/50 rounded-lg border border-blue-100">
            <p className="text-sm text-foreground/80 leading-relaxed">
              <span className="font-semibold">Important:</span> Participation does not imply endorsement or preferred provider status. Briefings are customer-led and curated based on customer priorities. Vendors are selected based on relevance to customer needs.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="font-semibold px-8">
              Complete registration
            </Button>
            <Button variant="secondary-outline" className="font-semibold px-8">
              Update participation preferences
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
