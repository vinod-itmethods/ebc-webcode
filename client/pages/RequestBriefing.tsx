import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2, X } from "lucide-react";
import { partners } from "@/data/partners";

interface FormData {
  interests: string[];
  interestOther?: string;
  decisionContext: string[];
  perspectives: string[];
  vendors: string[];
  location: string;
  format: string;
  goals: string;
  name: string;
  role: string;
  company: string;
  email: string;
  assistant?: string;
}

const STEPS = [
  { number: 1, title: "Areas of Interest" },
  { number: 2, title: "Decision Context" },
  { number: 3, title: "Technology Perspectives" },
  { number: 4, title: "Technology Vendors" },
  { number: 5, title: "Location & Format" },
  { number: 6, title: "Goals & Outcomes" },
  { number: 7, title: "Contact Details" },
];

export default function RequestBriefing() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    interests: [],
    decisionContext: [],
    perspectives: [],
    vendors: [],
    location: "",
    format: "",
    goals: "",
    name: "",
    role: "",
    company: "",
    email: "",
  });

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('vendor_wishlist') || '[]') as string[];
    setFormData((prev) => ({ ...prev, vendors: wishlist }));
  }, []);

  // Auto-save progress whenever form data changes
  useEffect(() => {
    const saveProgress = async () => {
      if (!formData.email || !formData.company) return;

      setIsSaving(true);
      try {
        const response = await fetch("/api/save-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            company: formData.company,
            stepNumber: currentStep,
            stepData: getStepData(currentStep),
            isCompleted: false,
            fullData: formData,
          }),
        });

        if (!response.ok) {
          console.error("Failed to save progress");
        }
      } catch (error) {
        console.error("Error saving progress:", error);
      } finally {
        setIsSaving(false);
      }
    };

    // Debounce the save by waiting a moment after user interaction
    const timer = setTimeout(saveProgress, 500);
    return () => clearTimeout(timer);
  }, [formData, currentStep]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCheckbox = (field: keyof FormData, value: string) => {
    const array = formData[field] as string[];
    const updated = array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];
    updateFormData(field, updated);
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Send briefing data to server
      const response = await fetch("/api/briefing-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.error("Failed to submit briefing request");
      } else {
        console.log("Briefing request submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting briefing request:", error);
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <section className="relative py-20 lg:py-28 overflow-hidden flex-grow flex items-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
          <div className="absolute inset-0 -z-10"></div>

          <div className="container max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg p-8 lg:p-12 space-y-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center icon-neutral-bg">
                  <CheckCircle2 className="w-8 h-8 icon-neutral" strokeWidth={1.5} />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Thank you for your briefing request</h2>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  We've received your briefing request and our team is reviewing your organization's needs. You'll receive an email shortly with your secure login credentials to access the customer portal and track your briefing status.
                </p>
              </div>

              <div className="bg-slate-50/50 rounded-lg p-6 space-y-3">
                <p className="text-sm font-semibold text-foreground/60 uppercase tracking-wide">What happens next</p>
                <ul className="space-y-2 text-left text-foreground/70">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">1</span>
                    <span>Our team reviews your briefing plan</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">2</span>
                    <span>We confirm timing and select relevant technology partners</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">3</span>
                    <span>You'll receive a confirmed briefing date and agenda</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 overflow-hidden bg-gradient-to-b from-white to-blue-50/40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-slate-50/50"></div>
        </div>

        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Request a briefing</h1>
            <p className="text-base lg:text-lg text-foreground/70 max-w-2xl mx-auto">
              Tell us about your organization's technology priorities and strategic decisions. Our team will curate a briefing tailored to your needs, bringing together perspectives from relevant technology partners.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-blue-50/20 to-white">
        <div className="container max-w-2xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-12 space-y-4">
            <div className="flex items-center justify-between text-xs font-medium text-foreground/60">
              <span>
                Step {currentStep} of 7
              </span>
              <span>{Math.round((currentStep / 7) * 100)}%</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(currentStep / 7) * 100}%`,
                  background: 'linear-gradient(90deg, hsl(45 82% 52%), hsl(38 92% 50%))'
                }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg p-8 lg:p-10 shadow-sm hover:shadow-md transition-shadow">
            {/* Step 1: Areas of Interest */}
            {currentStep === 1 && (
              <Step1
                interests={formData.interests}
                interestOther={formData.interestOther}
                onUpdate={(field, value) => updateFormData(field, value)}
                onToggle={(value) => toggleCheckbox("interests", value)}
              />
            )}

            {/* Step 2: Decision Context */}
            {currentStep === 2 && (
              <Step2
                decisionContext={formData.decisionContext}
                onToggle={(value) => toggleCheckbox("decisionContext", value)}
              />
            )}

            {/* Step 3: Technology Perspectives */}
            {currentStep === 3 && (
              <Step3
                perspectives={formData.perspectives}
                onToggle={(value) => toggleCheckbox("perspectives", value)}
              />
            )}

            {/* Step 4: Technology Vendors */}
            {currentStep === 4 && (
              <Step4Vendors
                vendors={formData.vendors}
                onToggle={(value) => toggleCheckbox("vendors", value)}
              />
            )}

            {/* Step 5: Location and Format */}
            {currentStep === 5 && (
              <Step5Location
                location={formData.location}
                format={formData.format}
                onUpdate={(field, value) => updateFormData(field, value)}
              />
            )}

            {/* Step 6: Goals and Outcomes */}
            {currentStep === 6 && (
              <Step6Goals goals={formData.goals} onUpdate={(value) => updateFormData("goals", value)} />
            )}

            {/* Step 7: Contact Details */}
            {currentStep === 7 && (
              <Step7Contact
                name={formData.name}
                role={formData.role}
                company={formData.company}
                email={formData.email}
                assistant={formData.assistant}
                onUpdate={(field, value) => updateFormData(field, value)}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 mt-10 pt-8 border-t border-border/10">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 text-foreground/60 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <div className="flex gap-2 items-center">
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step <= currentStep ? "bg-[hsl(45_82%_52%)]" : "bg-slate-200"
                    }`}
                  ></div>
                ))}
              </div>

              <Button
                onClick={currentStep === 7 ? handleSubmit : handleNext}
                className="font-semibold rounded-lg"
              >
                {currentStep === 7 ? "Request briefing" : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// STEP COMPONENTS

function Step1({
  interests,
  interestOther,
  onUpdate,
  onToggle,
}: {
  interests: string[];
  interestOther?: string;
  onUpdate: (field: string, value: any) => void;
  onToggle: (value: string) => void;
}) {
  const options = [
    "AI strategy and adoption",
    "DevOps and software delivery",
    "Platform and cloud architecture",
    "Infrastructure modernization",
    "Operating model and organizational change",
    "Governance, risk, and compliance",
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">What would you like to explore?</h2>
        <p className="text-foreground/70">Select the topics most relevant to your current priorities.</p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-3 p-4 border border-border/15 rounded-lg hover:border-primary/30 hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              checked={interests.includes(option)}
              onChange={() => onToggle(option)}
              className="w-5 h-5 rounded border-border/30"
            />
            <span className="font-medium text-foreground">{option}</span>
          </label>
        ))}

        {/* Other Option */}
        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-3 p-4 border border-border/15 rounded-lg hover:border-primary/30 hover:bg-blue-50/50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={interests.includes("Other")}
              onChange={() => onToggle("Other")}
              className="w-5 h-5 rounded border-border/30"
            />
            <span className="font-medium text-foreground">Other</span>
          </label>

          {interests.includes("Other") && (
            <input
              type="text"
              placeholder="Please describe..."
              value={interestOther || ""}
              onChange={(e) => onUpdate("interestOther", e.target.value)}
              className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Step2({
  decisionContext,
  onToggle,
}: {
  decisionContext: string[];
  onToggle: (value: string) => void;
}) {
  const options = [
    "Early exploration and comparison",
    "Evaluating options and trade-offs",
    "Preparing for near-term decisions",
    "Aligning executive or leadership teams",
    "Reassessing existing strategy",
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">What best describes your current context?</h2>
        <p className="text-sm text-foreground/60">This helps us tailor the discussion to where you are today.</p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-3 p-4 border border-border/15 rounded-lg hover:border-primary/30 hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              checked={decisionContext.includes(option)}
              onChange={() => onToggle(option)}
              className="w-5 h-5 rounded border-border/30"
            />
            <span className="font-medium text-foreground">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Step3({
  perspectives,
  onToggle,
}: {
  perspectives: string[];
  onToggle: (value: string) => void;
}) {
  const options = [
    "Cloud and infrastructure providers",
    "Platform and tooling vendors",
    "DevOps and delivery platforms",
    "Security and governance technologies",
    "AI and data platforms",
    "Open to recommendations",
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">What perspectives would be most helpful?</h2>
        <p className="text-foreground/70">Select the types of technology perspectives you would like included.</p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-3 p-4 border border-border/15 rounded-lg hover:border-primary/30 hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              checked={perspectives.includes(option)}
              onChange={() => onToggle(option)}
              className="w-5 h-5 rounded border-border/30"
            />
            <span className="font-medium text-foreground">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Step4Vendors({
  vendors,
  onToggle,
}: {
  vendors: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Which technology vendors interest you?</h2>
        <p className="text-foreground/70">Add vendors to your wishlist or explore additional options.</p>
      </div>

      {vendors.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Your wishlist ({vendors.length})</h3>
            <div className="flex flex-wrap gap-2">
              {vendors.map((vendorId) => {
                const vendor = partners.find((p) => p.id === vendorId);
                return vendor ? (
                  <div
                    key={vendorId}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                  >
                    {vendor.name}
                    <button
                      onClick={() => onToggle(vendorId)}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <Button
            asChild
            variant="secondary-outline"
            className="font-semibold rounded-lg"
          >
            <a href="/partners">Browse more vendors</a>
          </Button>
        </div>
      )}

      {vendors.length === 0 && (
        <div className="text-center space-y-4 py-8">
          <p className="text-foreground/70">No vendors added yet.</p>
          <Button
            asChild
            className="font-semibold rounded-lg"
          >
            <a href="/partners">Browse and add technology vendors</a>
          </Button>
        </div>
      )}
    </div>
  );
}

function Step5Location({
  location,
  format,
  onUpdate,
}: {
  location: string;
  format: string;
  onUpdate: (field: string, value: string) => void;
}) {
  const locations = ["New York", "San Francisco", "London", "Toronto", "Austin", "Open to other locations"];
  const formats = ["In person", "Private session aligned to an industry event", "Open to recommendations"];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Preferred briefing format</h2>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground/80">Location</label>
          <select
            value={location}
            onChange={(e) => onUpdate("location", e.target.value)}
            className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary bg-white"
          >
            <option value="">Select a location...</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground/80">Format</label>
        {formats.map((fmt) => (
          <label key={fmt} className="flex items-center gap-3 p-4 border border-border/15 rounded-lg hover:border-primary/30 hover:bg-blue-50/50 transition-colors cursor-pointer">
            <input
              type="radio"
              name="format"
              value={fmt}
              checked={format === fmt}
              onChange={(e) => onUpdate("format", e.target.value)}
              className="w-5 h-5 rounded-full border-border/30"
            />
            <span className="font-medium text-foreground">{fmt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Step6Goals({ goals, onUpdate }: { goals: string; onUpdate: (value: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">What would make this briefing valuable for you?</h2>
        <p className="text-foreground/70">This helps us design a briefing tailored to your needs.</p>
      </div>

      <textarea
        value={goals}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="For example, alignment across leadership, understanding trade-offs, validating assumptions, or exploring options."
        className="w-full px-4 py-4 border border-border/15 rounded-lg focus:outline-none focus:border-primary min-h-48 resize-none"
      ></textarea>

      <p className="text-xs text-foreground/50">This is an important part of planning your briefing. Share as much context as helpful.</p>
    </div>
  );
}

function Step7Contact({
  name,
  role,
  company,
  email,
  assistant,
  onUpdate,
}: {
  name: string;
  role: string;
  company: string;
  email: string;
  assistant?: string;
  onUpdate: (field: string, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">How can we follow up?</h2>
        <p className="text-foreground/70">Just the essentials so we can confirm your briefing details.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onUpdate("name", e.target.value)}
            className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Role / title</label>
          <input
            type="text"
            value={role}
            onChange={(e) => onUpdate("role", e.target.value)}
            className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => onUpdate("company", e.target.value)}
            className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onUpdate("email", e.target.value)}
            className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Assistant or coordinator contact <span className="text-foreground/50">(optional)</span>
          </label>
          <input
            type="text"
            value={assistant || ""}
            onChange={(e) => onUpdate("assistant", e.target.value)}
            placeholder="Name and email, if applicable"
            className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}
