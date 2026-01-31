import { supabase } from "../lib/supabase";

export interface SubmissionStep {
  stepNumber: number;
  data: any;
  timestamp: string;
}

export interface BriefingSubmission {
  id: string;
  email: string;
  company: string;
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  isCompleted: boolean;
  steps: SubmissionStep[];
  fullData?: any;
}

export async function saveFormProgress(
  email: string,
  company: string,
  stepNumber: number,
  stepData: any,
  isCompleted: boolean = false,
  fullData?: any,
): Promise<BriefingSubmission> {
  const now = new Date().toISOString();
  const id = `${email}-${Date.now()}`;

  // Try to find existing submission
  const { data: existing } = await supabase
    .from("briefing_submissions")
    .select("*")
    .eq("email", email)
    .eq("company", company)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let submission: any;

  if (existing) {
    // Update existing submission
    const steps = existing.steps || [];
    const existingStepIndex = steps.findIndex(
      (s: any) => s.stepNumber === stepNumber,
    );

    if (existingStepIndex >= 0) {
      steps[existingStepIndex] = {
        stepNumber,
        data: stepData,
        timestamp: now,
      };
    } else {
      steps.push({
        stepNumber,
        data: stepData,
        timestamp: now,
      });
    }

    steps.sort((a: any, b: any) => a.stepNumber - b.stepNumber);

    const { data: updated } = await supabase
      .from("briefing_submissions")
      .update({
        updated_at: now,
        current_step: stepNumber,
        is_completed: isCompleted,
        steps,
        full_data: fullData || existing.full_data,
      })
      .eq("id", existing.id)
      .select()
      .single();

    submission = updated;
  } else {
    // Create new submission
    const { data: created } = await supabase
      .from("briefing_submissions")
      .insert({
        id,
        email,
        company,
        created_at: now,
        updated_at: now,
        current_step: stepNumber,
        is_completed: isCompleted,
        steps: [
          {
            stepNumber,
            data: stepData,
            timestamp: now,
          },
        ],
        full_data: fullData,
      })
      .select()
      .single();

    submission = created;
  }

  return formatSubmissionResponse(submission);
}

export async function getAllSubmissions(): Promise<BriefingSubmission[]> {
  const { data } = await supabase
    .from("briefing_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return data ? data.map(formatSubmissionResponse) : [];
}

export async function getSubmissionsByEmail(
  email: string,
): Promise<BriefingSubmission[]> {
  const { data } = await supabase
    .from("briefing_submissions")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false });

  return data ? data.map(formatSubmissionResponse) : [];
}

// Helper function to format Supabase response
function formatSubmissionResponse(data: any): BriefingSubmission {
  return {
    id: data.id,
    email: data.email,
    company: data.company,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    currentStep: data.current_step,
    isCompleted: data.is_completed,
    steps: data.steps || [],
    fullData: data.full_data,
  };
}
