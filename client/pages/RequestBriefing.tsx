import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2 } from "lucide-react";

interface FormData {
  interests: string[];
  interestOther?: string;
  decisionContext: string[];
  perspectives: string[];
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
  { number: 4, title: "Location & Format" },
  { number: 5, title: "Goals & Outcomes" },
  { number: 6, title: "Contact Details" },
];

export default function RequestBriefing() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    interests: [],
    decisionContext: [],
    perspectives: [],
    location: "",
    format: "",
    goals: "",
    name: "",
    role: "",
    company: "",
    email: "",
  });

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
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <section className="relative py-20 lg:py-28 overflow-hidden flex-grow flex items-center">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-slate-50/50"></div>
          </div>

          <div className="container max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg border border-border/30 p-8 lg:p-12 space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Thank you for your request</h2>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  A member of our team will review your input and follow up to confirm relevance, alignment, and next
                  steps. Briefings are curated based on active decision areas and availability.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg border border-border/30 p-6 space-y-3">
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
      <section className="relative py-12 lg:py-16 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-slate-50/50"></div>
        </div>

        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Request an executive briefing</h1>
            <p className="text-base lg:text-lg text-foreground/70 max-w-2xl mx-auto">
              Use this form to outline your areas of interest and briefing preferences. A member of our team will
              follow up to confirm alignment and next steps.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 lg:py-20">
        <div className="container max-w-2xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-12 space-y-4">
            <div className="flex items-center justify-between text-xs font-medium text-foreground/60">
              <span>
                Step {currentStep} of {STEPS.length}
              </span>
              <span>{Math.round((currentStep / STEPS.length) * 100)}%</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-border/30 rounded-lg p-8 lg:p-10">
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

            {/* Step 4: Location and Format */}
            {currentStep === 4 && (
              <Step4
                location={formData.location}
                format={formData.format}
                onUpdate={(field, value) => updateFormData(field, value)}
              />
            )}

            {/* Step 5: Goals and Outcomes */}
            {currentStep === 5 && (
              <Step5 goals={formData.goals} onUpdate={(value) => updateFormData("goals", value)} />
            )}

            {/* Step 6: Contact Details */}
            {currentStep === 6 && (
              <Step6
                name={formData.name}
                role={formData.role}
                company={formData.company}
                email={formData.email}
                assistant={formData.assistant}
                onUpdate={(field, value) => updateFormData(field, value)}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 mt-10 pt-8 border-t border-border/30">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 text-foreground/60 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <div className="flex gap-2 items-center">
                {STEPS.map((step) => (
                  <div
                    key={step.number}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step.number <= currentStep ? "bg-primary" : "bg-slate-200"
                    }`}
                  ></div>
                ))}
              </div>

              <Button
                onClick={currentStep === 6 ? handleSubmit : handleNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg"
              >
                {currentStep === 6 ? "Request briefing" : "Continue"}
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
            className="flex items-center gap-3 p-4 border border-border/30 rounded-lg hover:border-primary/30 hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              checked={interests.includes(option)}
              onChange={() => onToggle(option)}
              className="w-5 h-5 rounded border-border"
            />
            <span className="font-medium text-foreground">{option}</span>
          </label>
        ))}

        {/* Other Option */}
        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-3 p-4 border border-border/30 rounded-lg hover:border-primary/30 hover:bg-blue-50/50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={interests.includes("Other")}
              onChange={() => onToggle("Other")}
              className="w-5 h-5 rounded border-border"
            />
            <span className="font-medium text-foreground">Other</span>
          </label>

          {interests.includes("Other") && (
            <input
              type="text"
              placeholder="Please describe..."
              value={interestOther || ""}
              onChange={(e) => onUpdate("interestOther", e.target.value)}
              className="w-full px-4 py-3 border border-border/30 rounded-lg focus:outline-none focus:border-primary"
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
            className="flex items-center gap-3 p-4 border border-border/30 rounded-lg hover:border-primary/30 hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              checked={decisionContext.includes(option)}
              onChange={() => onToggle(option)}
              className="w-5 h-5 rounded border-border"
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
            className="flex items-center gap-3 p-4 border border-border/30 rounded-lg hover:border-primary/30 hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              checked={perspectives.includes(option)}
              onChange={() => onToggle(option)}
              className="w-5 h-5 rounded border-border"
            />
            <span className="font-medium text-foreground">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Step4({
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
            className="w-full px-4 py-3 border border-border/30 rounded-lg focus:outline-none focus:border-primary bg-white"
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
          <label key={fmt} className="flex items-center gap-3 p-4 border border-border/30 rounded-lg hover:border-primary/30 hover:bg-blue-50/50 transition-colors cursor-pointer">
            <input
              type="radio"
              name="format"
              value={fmt}
              checked={format === fmt}
              onChange={(e) => onUpdate("format", e.target.value)}
              className="w-5 h-5 rounded-full border-border"
            />
            <span className="font-medium text-foreground">{fmt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Step5({ goals, onUpdate }: { goals: string; onUpdate: (value: string) => void }) {
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
        className="w-full px-4 py-4 border border-border/30 rounded-lg focus:outline-none focus:border-primary min-h-48 resize-none"
      ></textarea>

      <p className="text-xs text-foreground/50">This is an important part of planning your briefing. Share as much context as helpful.</p>
    </div>
  );
}

function Step6({
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
            className="w-full px-4 py-3 border border-border/30 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Role / title</label>
          <input
            type="text"
            value={role}
            onChange={(e) => onUpdate("role", e.target.value)}
            className="w-full px-4 py-3 border border-border/30 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => onUpdate("company", e.target.value)}
            className="w-full px-4 py-3 border border-border/30 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onUpdate("email", e.target.value)}
            className="w-full px-4 py-3 border border-border/30 rounded-lg focus:outline-none focus:border-primary"
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
            className="w-full px-4 py-3 border border-border/30 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}
