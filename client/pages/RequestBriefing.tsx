import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2, X } from "lucide-react";
import { partners } from "@/data/partners";

// Get CAPTCHA token safely (reCAPTCHA is optional)
// Note: reCAPTCHA script must be loaded in index.html with a valid site key
const getCaptchaToken = async (): Promise<string> => {
  try {
    if ((window as any).grecaptcha && typeof (window as any).grecaptcha.execute === 'function') {
      // Only attempt to execute if grecaptcha is properly loaded
      return await (window as any).grecaptcha.execute({
        action: "submit",
      });
    }
  } catch (err) {
    // reCAPTCHA is optional - if it fails, just continue
    console.warn("reCAPTCHA not available, continuing without CAPTCHA token");
  }
  return "";
};

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
  additionalContactName?: string;
  additionalContactEmail?: string;
}

const STEPS = [
  { number: 1, title: "Areas of Interest" },
  { number: 2, title: "Decision Context" },
  { number: 3, title: "Technology Perspectives" },
  { number: 4, title: "Technology Providers" },
  { number: 5, title: "Location & Format" },
  { number: 6, title: "Goals & Outcomes" },
  { number: 7, title: "Contact Details" },
];

export default function RequestBriefing() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [skipContactStep, setSkipContactStep] = useState(false);
  const [totalSteps, setTotalSteps] = useState(7);
  const [attemptedContinue, setAttemptedContinue] = useState(false);
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const [savedFormData, setSavedFormData] = useState<FormData | null>(null);
  const [savedStep, setSavedStep] = useState<number | null>(null);
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
    additionalContactName: "",
    additionalContactEmail: "",
  });

  // Load wishlist and pre-filled customer data on component mount
  useEffect(() => {
    const wishlist = JSON.parse(
      localStorage.getItem("vendor_wishlist") || "[]",
    ) as string[];
    const prefillEmail = localStorage.getItem("prefillCustomerEmail");
    const prefillName = localStorage.getItem("prefillCustomerName");
    const prefillCompany = localStorage.getItem("prefillCustomerCompany");
    const prefillRole = localStorage.getItem("prefillCustomerRole");
    const skip = localStorage.getItem("skipContactStep") === "true";

    // Check for saved form data from previous session
    const savedFormDataStr = localStorage.getItem("briefing_form_data");
    const savedFormStep = localStorage.getItem("briefing_form_step");
    const returnTo = searchParams.get("returnTo");
    const step = searchParams.get("step");

    // Only show continue dialog if there's saved data and they're not coming from vendor selection
    if (savedFormDataStr && !returnTo && !step) {
      try {
        const saved = JSON.parse(savedFormDataStr) as FormData;
        const savedStepNum = savedFormStep ? parseInt(savedFormStep) : 1;
        setSavedFormData(saved);
        setSavedStep(savedStepNum);
        setShowContinueDialog(true);
      } catch (e) {
        console.error("Failed to parse saved form data:", e);
      }
    }

    setFormData((prev) => ({
      ...prev,
      vendors: wishlist,
      ...(prefillEmail && { email: prefillEmail }),
      ...(prefillName && { name: prefillName }),
      ...(prefillCompany && { company: prefillCompany }),
      ...(prefillRole && { role: prefillRole }),
    }));

    // If coming from portal with customer info, skip step 7 (contact details)
    if (skip) {
      setSkipContactStep(true);
      setTotalSteps(6);
    }

    // Check if returning from vendor selection
    if (step) {
      const stepNum = parseInt(step);
      if (stepNum >= 1 && stepNum <= 7) {
        setCurrentStep(stepNum);
      }
    }

    // Clean up the prefill flags
    if (skip) {
      localStorage.removeItem("prefillCustomerEmail");
      localStorage.removeItem("prefillCustomerName");
      localStorage.removeItem("prefillCustomerCompany");
      localStorage.removeItem("prefillCustomerRole");
      localStorage.removeItem("skipContactStep");
    }
  }, [searchParams]);

  // Save form data to localStorage
  useEffect(() => {
    localStorage.setItem("briefing_form_data", JSON.stringify(formData));
    localStorage.setItem("briefing_form_step", currentStep.toString());
  }, [formData, currentStep]);

  // Auto-save progress whenever form data changes
  useEffect(() => {
    const saveProgress = async () => {
      // For auto-save, we use a temporary ID based on form data
      // Only save if we have at least some data to track
      const email = formData.email || `temp_${Date.now()}`;
      const company = formData.company || "Unknown Company";

      setIsSaving(true);
      try {
        const response = await fetch("/api/save-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            company,
            stepNumber: currentStep,
            stepData: getStepData(currentStep),
            isCompleted: false,
            fullData: formData,
          }),
        });

        if (!response.ok) {
          try {
            const errorData = await response.json();
            console.warn(
              "Save progress responded with error:",
              JSON.stringify(errorData),
            );
          } catch (e) {
            console.warn(
              `Save progress failed with status ${response.status}:`,
              response.statusText,
            );
          }
        } else {
          // Successfully saved
          const data = await response.json();
          console.log("Progress saved successfully at step", currentStep);
        }
      } catch (error) {
        console.error(
          "Network error saving progress:",
          error instanceof Error ? error.message : String(error),
        );
      } finally {
        setIsSaving(false);
      }
    };

    // Debounce the save by waiting a moment after user interaction
    const timer = setTimeout(saveProgress, 800);
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

  const getStepData = (step: number) => {
    switch (step) {
      case 1:
        return {
          interests: formData.interests,
          interestOther: formData.interestOther,
        };
      case 2:
        return { decisionContext: formData.decisionContext };
      case 3:
        return { perspectives: formData.perspectives };
      case 4:
        return { vendors: formData.vendors };
      case 5:
        return { location: formData.location, format: formData.format };
      case 6:
        return { goals: formData.goals };
      case 7:
        return {
          name: formData.name,
          role: formData.role,
          company: formData.company,
          email: formData.email,
          assistant: formData.assistant,
        };
      default:
        return {};
    }
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.interests.length > 0 || !!formData.interestOther;
      case 2:
        return formData.decisionContext.length > 0;
      case 3:
        return formData.perspectives.length > 0;
      case 4:
        // Step 4 is optional - vendors can be added later from partners page
        return true;
      case 5:
        return !!formData.location && !!formData.format;
      case 6:
        // Step 6 is last for returning customers (step 7 skipped)
        // If skipping, this is goals. If not skipping, this is also goals.
        return !!formData.goals.trim();
      case 7:
        // Step 7 only shown for new customers
        return (
          !!formData.name.trim() &&
          !!formData.role.trim() &&
          !!formData.company.trim() &&
          !!formData.email.trim() &&
          !emailError
        );
      default:
        return false;
    }
  };

  const validateEmailDomain = async (email: string) => {
    if (!email) {
      setEmailError(null);
      return;
    }

    try {
      const response = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || data.isPersonalEmail) {
        setEmailError(
          "Please use your work email address, not a personal email (gmail, yahoo, outlook, etc.)",
        );
      } else {
        setEmailError(null);
      }
    } catch (error) {
      console.error("Error validating email:", error);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setAttemptedContinue(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setAttemptedContinue(false);
    }
  };

  const handleContinueClick = () => {
    if (!isStepValid()) {
      setAttemptedContinue(true);
      return;
    }
    handleNext();
  };

  const handleSubmit = async () => {
    try {
      // Only validate email for new customers (not pre-filled from portal)
      if (!skipContactStep && !isValidWorkEmail(formData.email)) {
        setEmailError(
          "Please use your work email address, not a personal email (gmail, yahoo, outlook, etc.)",
        );
        return;
      }

      // Get CAPTCHA token (if available)
      let captchaToken = "";
      captchaToken = await getCaptchaToken();

      // Only create customer profile for new customers (not returning from portal)
      if (!skipContactStep) {
        const registerResponse = await fetch("/api/register-customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            role: formData.role,
            company: formData.company,
            briefingData: formData,
          }),
        });

        if (!registerResponse.ok) {
          const errorData = await registerResponse.json();
          setEmailError(errorData.error || "Failed to create customer profile");
          return;
        }

        console.log("Customer profile created successfully");
      } else {
        // For returning customers, just update their profile with new briefing data
        await fetch("/api/register-customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            role: formData.role,
            company: formData.company,
            briefingData: formData,
          }),
        }).catch(console.error);
      }

      // Save final completion status
      const finalStep = skipContactStep ? 6 : 7;
      await fetch("/api/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          company: formData.company,
          stepNumber: finalStep,
          stepData: getStepData(finalStep),
          isCompleted: true,
          fullData: formData,
        }),
      });

      // Send briefing data to server (email to internal team)
      const response = await fetch("/api/briefing-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          captchaToken, // Include CAPTCHA token
        }),
      });

      if (!response.ok) {
        console.error("Failed to submit briefing request");
      } else {
        console.log("Briefing request submitted successfully");
      }

      setEmailError(null);
    } catch (error) {
      console.error("Error submitting briefing request:", error);
      setEmailError(
        "An error occurred while submitting your request. Please try again.",
      );
      return;
    }

    // Clear saved form data on successful submission
    localStorage.removeItem("briefing_form_data");
    localStorage.removeItem("briefing_form_step");
    setSubmitted(true);
  };

  const handleContinuePreviousSession = () => {
    if (savedFormData && savedStep) {
      setFormData(savedFormData);
      setCurrentStep(savedStep);
      setShowContinueDialog(false);
    }
  };

  const handleStartFresh = () => {
    localStorage.removeItem("briefing_form_data");
    localStorage.removeItem("briefing_form_step");

    // Load vendors from wishlist to preserve selected vendors
    const wishlist = JSON.parse(
      localStorage.getItem("vendor_wishlist") || "[]",
    ) as string[];

    setFormData({
      interests: [],
      decisionContext: [],
      perspectives: [],
      vendors: wishlist,
      location: "",
      format: "",
      goals: "",
      name: "",
      role: "",
      company: "",
      email: "",
      additionalContactName: "",
      additionalContactEmail: "",
    });
    setCurrentStep(1);
    setShowContinueDialog(false);
  };

  const isValidWorkEmail = (email: string): boolean => {
    const personalDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "aol.com",
      "protonmail.com",
      "icloud.com",
      "mail.com",
      "zoho.com",
      "yandex.com",
      "163.com",
      "qq.com",
      "gmx.com",
      "test.com",
      "example.com",
    ];

    const domain = email.split("@")[1]?.toLowerCase();
    return domain ? !personalDomains.includes(domain) : false;
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
                  <CheckCircle2
                    className="w-8 h-8 icon-neutral"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Thank you for your briefing request
                </h2>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  We've received your briefing request and our team is reviewing
                  your organization's needs. You'll receive an email shortly
                  with your secure login credentials to access the customer
                  portal and track your briefing status.
                </p>
              </div>

              <div className="bg-slate-50/50 rounded-lg p-6 space-y-3">
                <p className="text-sm font-semibold text-foreground/60 uppercase tracking-wide">
                  What happens next
                </p>
                <ul className="space-y-2 text-left text-foreground/70">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">1</span>
                    <span>Our team reviews your briefing plan</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">2</span>
                    <span>
                      We confirm timing and select relevant technology partners
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">3</span>
                    <span>
                      You'll receive a confirmed briefing date and agenda
                    </span>
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

      {/* Continue Previous Session Modal */}
      {showContinueDialog && savedFormData && savedStep && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Welcome back!
                </h2>
                <p className="text-foreground/70">
                  We found your previous briefing request. Would you like to
                  continue where you left off or start a new one?
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Previous progress:
                </p>
                <p className="text-sm text-foreground/70">
                  Step {savedStep} of {totalSteps}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleContinuePreviousSession}
                  className="flex-1 font-semibold rounded-lg"
                >
                  Continue
                </Button>
                <Button
                  onClick={handleStartFresh}
                  variant="secondary-outline"
                  className="flex-1 font-semibold rounded-lg"
                >
                  Start fresh
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 overflow-hidden bg-gradient-to-b from-white to-blue-50/40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-slate-50/50"></div>
        </div>

        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Request a briefing
            </h1>
            <p className="text-base lg:text-lg text-foreground/70 max-w-2xl mx-auto">
              Tell us about your organization's technology priorities and
              strategic decisions. Our team will curate a briefing tailored to
              your needs, bringing together perspectives from relevant
              technology partners.
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
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(currentStep / totalSteps) * 100}%`,
                  background:
                    "linear-gradient(90deg, hsl(45 82% 52%), hsl(38 92% 50%))",
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
                vendors={formData.vendors}
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

            {/* Step 4: Technology Providers */}
            {currentStep === 4 && (
              <Step4Vendors
                vendors={formData.vendors}
                onToggle={(value) => toggleCheckbox("vendors", value)}
                currentStep={currentStep}
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
              <Step6Goals
                goals={formData.goals}
                onUpdate={(value) => updateFormData("goals", value)}
              />
            )}

            {/* Step 7: Contact Details (only shown for new customers) */}
            {!skipContactStep && currentStep === 7 && (
              <Step7Contact
                name={formData.name}
                role={formData.role}
                company={formData.company}
                email={formData.email}
                assistant={formData.assistant}
                additionalContactName={formData.additionalContactName}
                additionalContactEmail={formData.additionalContactEmail}
                onUpdate={(field, value) => updateFormData(field, value)}
                emailError={emailError}
                onEmailValidate={validateEmailDomain}
              />
            )}

            {/* Navigation Buttons */}
            <div className="space-y-4">
              {!isStepValid() && attemptedContinue && currentStep !== 7 && (
                <div className="text-sm text-orange-600 font-medium">
                  Please complete this step before continuing
                </div>
              )}
              <div className="flex items-center justify-between gap-4 pt-8 border-t border-border/10">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 text-foreground/60 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="flex gap-2 items-center">
                  {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
                    (step) => (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          step <= currentStep
                            ? "bg-[hsl(45_82%_52%)]"
                            : "bg-slate-200"
                        }`}
                      ></div>
                    ),
                  )}
                </div>

                <Button
                  onClick={
                    (skipContactStep && currentStep === totalSteps) ||
                    (!skipContactStep && currentStep === 7)
                      ? handleSubmit
                      : handleContinueClick
                  }
                  className={`font-semibold rounded-lg transition-all ${!isStepValid() ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {(skipContactStep && currentStep === totalSteps) ||
                  (!skipContactStep && currentStep === 7)
                    ? "Request briefing"
                    : "Continue"}
                </Button>
              </div>
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
  vendors,
  onUpdate,
  onToggle,
}: {
  interests: string[];
  interestOther?: string;
  vendors: string[];
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
      {/* Vendors Reminder */}
      {vendors.length > 0 && (
        <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-foreground mb-2">
            Selected vendors:
          </p>
          <div className="flex flex-wrap gap-2">
            {vendors.map((vendorId) => {
              const vendor = partners.find((p) => p.id === vendorId);
              return vendor ? (
                <span
                  key={vendorId}
                  className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium"
                >
                  {vendor.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          What would you like to explore?
        </h2>
        <p className="text-foreground/70">
          Select the topics most relevant to your current priorities.
        </p>
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
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          What best describes your current context?
        </h2>
        <p className="text-sm text-foreground/60">
          This helps us tailor the discussion to where you are today.
        </p>
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
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          What perspectives would be most helpful?
        </h2>
        <p className="text-foreground/70">
          Select the types of technology perspectives you would like included.
        </p>
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
  currentStep,
}: {
  vendors: string[];
  onToggle: (value: string) => void;
  currentStep: number;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          Which technology providers interest you?
        </h2>
        <p className="text-foreground/70">
          Add technology providers to your wishlist or explore additional options.
        </p>
      </div>

      {vendors.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Your wishlist ({vendors.length})
            </h3>
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
            <a href={`/partners?returnTo=briefing&step=${currentStep}`}>
              Browse more vendors
            </a>
          </Button>
        </div>
      )}

      {vendors.length === 0 && (
        <div className="text-center space-y-4 py-8">
          <p className="text-foreground/70">No vendors added yet.</p>
          <Button asChild className="font-semibold rounded-lg">
            <a href="/partners?returnTo=briefing">
              Browse and add technology vendors
            </a>
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
  const locations = [
    "New York",
    "San Francisco",
    "London",
    "Toronto",
    "Austin",
    "Open to other locations",
  ];
  const formats = [
    "In person",
    "Private session aligned to an industry event",
    "Open to recommendations",
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          Preferred briefing format
        </h2>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground/80">
            Location
          </label>
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
        <label className="block text-sm font-semibold text-foreground/80">
          Format
        </label>
        {formats.map((fmt) => (
          <label
            key={fmt}
            className="flex items-center gap-3 p-4 border border-border/15 rounded-lg hover:border-primary/30 hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
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

function Step6Goals({
  goals,
  onUpdate,
}: {
  goals: string;
  onUpdate: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          What would make this briefing valuable for you?
        </h2>
        <p className="text-foreground/70">
          This helps us design a briefing tailored to your needs.
        </p>
      </div>

      <textarea
        value={goals}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="For example, alignment across leadership, understanding trade-offs, validating assumptions, or exploring options."
        className="w-full px-4 py-4 border border-border/15 rounded-lg focus:outline-none focus:border-primary min-h-48 resize-none"
      ></textarea>

      <p className="text-xs text-foreground/50">
        This is an important part of planning your briefing. Share as much
        context as helpful.
      </p>
    </div>
  );
}

function Step7Contact({
  name,
  role,
  company,
  email,
  assistant,
  additionalContactName,
  additionalContactEmail,
  onUpdate,
  emailError,
  onEmailValidate,
}: {
  name: string;
  role: string;
  company: string;
  email: string;
  assistant?: string;
  additionalContactName?: string;
  additionalContactEmail?: string;
  onUpdate: (field: string, value: string) => void;
  emailError: string | null;
  onEmailValidate: (email: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          How can we follow up?
        </h2>
        <p className="text-foreground/70">
          Just the essentials so we can confirm your briefing details.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onUpdate("name", e.target.value)}
            className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Role / title
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => onUpdate("role", e.target.value)}
            className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Company
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => onUpdate("company", e.target.value)}
            className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              onUpdate("email", e.target.value);
              onEmailValidate(e.target.value);
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
              emailError
                ? "border-red-300 focus:border-red-400 bg-red-50/30"
                : "border-border/15 focus:border-primary"
            }`}
          />
          {emailError && (
            <p className="text-sm text-red-600 mt-2">{emailError}</p>
          )}
          <p className="text-xs text-foreground/50 mt-2">
            We accept work email addresses only (not gmail, yahoo, outlook,
            etc.)
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Assistant or coordinator contact{" "}
            <span className="text-foreground/50">(optional)</span>
          </label>
          <input
            type="text"
            value={assistant || ""}
            onChange={(e) => onUpdate("assistant", e.target.value)}
            placeholder="Name and email, if applicable"
            className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        {/* Additional Contact */}
        <div className="border-t border-border/10 pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-foreground">
              Additional attendee{" "}
              <span className="text-foreground/50">(optional)</span>
            </label>
            <span className="text-xs text-foreground/50 font-medium">
              Max 1 additional contact
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Name
              </label>
              <input
                type="text"
                value={additionalContactName || ""}
                onChange={(e) =>
                  onUpdate("additionalContactName", e.target.value)
                }
                placeholder="Full name"
                className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email address
              </label>
              <input
                type="email"
                value={additionalContactEmail || ""}
                onChange={(e) =>
                  onUpdate("additionalContactEmail", e.target.value)
                }
                placeholder="work@company.com"
                className="w-full px-4 py-3 border border-border/15 rounded-lg focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-foreground/50 mt-2">
                This person will receive the same portal access as the primary
                contact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
