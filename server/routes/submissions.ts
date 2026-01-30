import { Request, Response } from "express";
import { saveFormProgress, getAllSubmissions } from "../utils/submissions";

// Middleware to check if user is admin
export function isAdminEmail(email: string): boolean {
  return email.endsWith("@itmethods.com");
}

export async function handleSaveProgress(req: Request, res: Response) {
  try {
    const { email, company, stepNumber, stepData, isCompleted, fullData } = req.body;

    if (!email || !company || stepNumber === undefined) {
      return res.status(400).json({
        error: "Missing required fields: email, company, stepNumber",
      });
    }

    if (!isAdminEmail(email) && !email.match(/^[\w.-]+@[\w.-]+\.\w+$/)) {
      // Basic email validation
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    const submission = saveFormProgress(
      email,
      company,
      stepNumber,
      stepData,
      isCompleted,
      fullData
    );

    return res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error("Error saving form progress:", error);
    return res.status(500).json({
      error: "Failed to save form progress",
    });
  }
}

export async function handleGetSubmissions(req: Request, res: Response) {
  try {
    const { adminEmail } = req.query;

    // Verify admin access
    if (!adminEmail || !isAdminEmail(String(adminEmail))) {
      return res.status(403).json({
        error: "Unauthorized: only @itmethods.com emails can view submissions",
      });
    }

    const submissions = getAllSubmissions();

    return res.status(200).json({
      success: true,
      submissions,
      count: submissions.length,
      completed: submissions.filter((s) => s.isCompleted).length,
      partial: submissions.filter((s) => !s.isCompleted).length,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({
      error: "Failed to fetch submissions",
    });
  }
}
