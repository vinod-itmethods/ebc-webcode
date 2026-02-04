import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown } from "lucide-react";

interface SubmissionStep {
  stepNumber: number;
  data: any;
  timestamp: string;
}

interface BriefingSubmission {
  id: string;
  email: string;
  company: string;
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  isCompleted: boolean;
  steps: SubmissionStep[];
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

export default function AdminSubmissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<BriefingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "partial">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("");

  // Check admin access on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    if (!storedEmail || !storedEmail.endsWith("@itmethods.com")) {
      navigate("/admin");
      return;
    }
    setAdminEmail(storedEmail);
    fetchSubmissions(storedEmail);
  }, [navigate]);

  const fetchSubmissions = async (email: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/submissions?adminEmail=${encodeURIComponent(email)}`,
      );

      if (!response.ok) {
        throw new Error("Unauthorized or failed to fetch submissions");
      }

      const data = await response.json();
      setSubmissions(data.submissions || []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load submissions",
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions
    .filter((s) => {
      if (filter === "completed") return s.isCompleted;
      if (filter === "partial") return !s.isCompleted;
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Admin Header */}
      <section className="border-b border-border/10 bg-gradient-to-r from-slate-50 to-blue-50/30 px-4 py-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">
              Submission History
            </h2>
            <div className="flex gap-3">
              <a
                href="/admin/requests"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                → Manage Requests
              </a>
              <span className="text-foreground/30">|</span>
              <a
                href="/admin/portal-logins"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                → Manage Portal Logins
              </a>
              <span className="text-foreground/30">|</span>
              <a
                href="/admin/new-providers"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                → Add Technology Providers
              </a>
              <span className="text-foreground/30">|</span>
              <a
                href="/admin/documents"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                → Manage Documents
              </a>
            </div>
          </div>
          <p className="text-sm text-foreground/60">
            View all briefing request submissions
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Total Submissions</p>
              <p className="text-3xl font-bold text-foreground">
                {submissions.length}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {submissions.filter((s) => s.isCompleted).length}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-foreground/70">Abandoned</p>
              <p className="text-3xl font-bold text-yellow-600">
                {submissions.filter((s) => !s.isCompleted).length}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border/10">
            {["all", "completed", "partial"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  filter === tab
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab === "all"
                  ? "All Submissions"
                  : tab === "completed"
                    ? "Completed"
                    : "Abandoned"}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-foreground/60">Loading submissions...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Submissions List */}
          {!loading && !error && filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60">
                No {filter === "all" ? "" : filter} submissions yet
              </p>
            </div>
          )}

          {!loading && !error && filteredSubmissions.length > 0 && (
            <div className="space-y-3">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border border-border/10 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Summary Row */}
                  <button
                    onClick={() =>
                      setExpandedId(
                        expandedId === submission.id ? null : submission.id,
                      )
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex-grow text-left">
                      <div className="flex items-start justify-between gap-4 w-full">
                        <div className="flex-grow">
                          <h3 className="font-semibold text-foreground">
                            {submission.company}
                          </h3>
                          <p className="text-sm text-foreground/70 mt-1">
                            {submission.email}
                          </p>
                          <p className="text-xs text-foreground/50 mt-1">
                            Submitted{" "}
                            {new Date(submission.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {submission.isCompleted ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Completed
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                              Step {submission.currentStep}/7
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-foreground/60 transition-transform ${
                        expandedId === submission.id
                          ? "transform rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Expanded Details */}
                  {expandedId === submission.id && (
                    <div className="border-t border-border/10 bg-slate-50/30 px-6 py-4 space-y-6">
                      {!submission.isCompleted && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-yellow-900 mb-2">
                            ⚠️ Abandoned Submission
                          </p>
                          <p className="text-sm text-yellow-800">
                            User completed steps 1-{submission.currentStep - 1}{" "}
                            and abandoned at{" "}
                            <strong>Step {submission.currentStep}</strong>
                          </p>
                        </div>
                      )}

                      {/* Progress Indicator */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground text-sm">
                          Form Progress
                        </h4>
                        <div className="flex gap-2 flex-wrap">
                          {Array.from({ length: 7 }, (_, i) => i + 1).map(
                            (step) => {
                              const isCompleted = step < submission.currentStep;
                              const isAbandoned =
                                step === submission.currentStep &&
                                !submission.isCompleted;
                              const isFuture = step > submission.currentStep;

                              return (
                                <div
                                  key={step}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                                    isCompleted
                                      ? "bg-green-100 text-green-700 border border-green-300"
                                      : isAbandoned
                                        ? "bg-red-100 text-red-700 border border-red-300"
                                        : "bg-slate-100 text-slate-400 border border-slate-200"
                                  }`}
                                >
                                  {isCompleted ? "✓" : step}
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>

                      {/* Collected Data Timeline */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground text-sm">
                          Collected Data
                        </h4>
                        <div className="space-y-3">
                          {submission.steps.map((step) => {
                            const isAbandoned =
                              step.stepNumber === submission.currentStep &&
                              !submission.isCompleted;

                            return (
                              <div
                                key={step.stepNumber}
                                className={`rounded-lg border p-4 transition-colors ${
                                  isAbandoned
                                    ? "bg-red-50 border-red-200"
                                    : "bg-white border-border/10"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                                        isAbandoned
                                          ? "bg-red-100 text-red-700"
                                          : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      {isAbandoned ? "⚠" : "✓"}
                                    </span>
                                    <div>
                                      <span className="font-semibold text-foreground text-sm">
                                        Step {step.stepNumber}:{" "}
                                        {STEP_NAMES[step.stepNumber - 1]}
                                      </span>
                                      {isAbandoned && (
                                        <span className="ml-3 text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                                          ABANDONED HERE
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-xs text-foreground/50">
                                    {new Date(step.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-sm text-foreground/70 bg-white/50 rounded p-3 border border-border/5">
                                  {renderStepData(step.stepNumber, step.data)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm border-t border-border/10 pt-4">
                        <div>
                          <p className="text-foreground/60">Started</p>
                          <p className="font-medium text-foreground">
                            {new Date(submission.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-foreground/60">Last Activity</p>
                          <p className="font-medium text-foreground">
                            {new Date(submission.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
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

function renderStepData(stepNumber: number, data: any): React.ReactNode {
  if (!data) return "No data";

  switch (stepNumber) {
    case 1:
      return (
        <div>
          <p>
            <strong>Interests:</strong>{" "}
            {(data.interests || []).join(", ") || "None selected"}
          </p>
          {data.interestOther && (
            <p>
              <strong>Other:</strong> {data.interestOther}
            </p>
          )}
        </div>
      );
    case 2:
      return (
        <p>
          <strong>Decision Context:</strong>{" "}
          {(data.decisionContext || []).join(", ") || "None selected"}
        </p>
      );
    case 3:
      return (
        <p>
          <strong>Perspectives:</strong>{" "}
          {(data.perspectives || []).join(", ") || "None selected"}
        </p>
      );
    case 4:
      return (
        <p>
          <strong>Vendors:</strong>{" "}
          {(data.vendors || []).join(", ") || "None selected"}
        </p>
      );
    case 5:
      return (
        <div>
          <p>
            <strong>Location:</strong> {data.location || "Not specified"}
          </p>
          <p>
            <strong>Format:</strong> {data.format || "Not specified"}
          </p>
        </div>
      );
    case 6:
      return (
        <p>
          <strong>Goals:</strong> {data.goals || "Not specified"}
        </p>
      );
    case 7:
      return (
        <div>
          <p>
            <strong>Name:</strong> {data.name || "Not specified"}
          </p>
          <p>
            <strong>Role:</strong> {data.role || "Not specified"}
          </p>
          <p>
            <strong>Company:</strong> {data.company || "Not specified"}
          </p>
          <p>
            <strong>Email:</strong> {data.email || "Not specified"}
          </p>
          {data.assistant && (
            <p>
              <strong>Assistant:</strong> {data.assistant}
            </p>
          )}
        </div>
      );
    default:
      return JSON.stringify(data);
  }
}
