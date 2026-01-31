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

export function saveFormProgress(
  email: string,
  company: string,
  stepNumber: number,
  stepData: any,
  isCompleted: boolean = false,
  fullData?: any
): BriefingSubmission {
  const submissions = loadSubmissions();
  const id = `${email}-${Date.now()}`;
  
  // Find existing submission for this email/company combo from today
  const today = new Date().toDateString();
  let submission = submissions.find(
    (s) => s.email === email && s.company === company && s.createdAt.startsWith(today)
  );

  const now = new Date().toISOString();

  if (!submission) {
    submission = {
      id,
      email,
      company,
      createdAt: now,
      updatedAt: now,
      currentStep: stepNumber,
      isCompleted,
      steps: [],
      fullData,
    };
    submissions.push(submission);
  } else {
    submission.updatedAt = now;
    submission.currentStep = stepNumber;
    submission.isCompleted = isCompleted;
    if (fullData) {
      submission.fullData = fullData;
    }
  }

  // Add or update step
  const existingStepIndex = submission.steps.findIndex(
    (s) => s.stepNumber === stepNumber
  );

  if (existingStepIndex >= 0) {
    submission.steps[existingStepIndex] = {
      stepNumber,
      data: stepData,
      timestamp: now,
    };
  } else {
    submission.steps.push({
      stepNumber,
      data: stepData,
      timestamp: now,
    });
  }

  // Sort steps by step number
  submission.steps.sort((a, b) => a.stepNumber - b.stepNumber);

  saveSubmissions(submissions);
  return submission;
}

export function getAllSubmissions(): BriefingSubmission[] {
  return loadSubmissions();
}

export function getSubmissionsByEmail(email: string): BriefingSubmission[] {
  const submissions = loadSubmissions();
  return submissions.filter((s) => s.email === email);
}
