import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleBriefingSubmission } from "./routes/briefing";
import {
  handleSaveProgress,
  handleGetSubmissions,
  handleApproveCustomer,
  handleRejectCustomer,
  handleRemoveCustomer,
  handleGetAllCustomers,
} from "./routes/submissions";
import {
  handleValidateEmail,
  handleRegisterCustomer,
  handleGetPersonalDomains,
  handleGetCustomerProfile,
} from "./routes/customers";
import { rateLimit } from "./lib/rate-limit";
import { verifyCaptcha } from "./lib/captcha";
import { getAuditLogs, logFormSubmission } from "./lib/audit-log";
import { supabase } from "./lib/supabase";
import {
  handlePortalLogin,
  handleAddPortalLogin,
  handleChangePassword,
  handleForgotPassword,
  handleGetResetRequests,
  handleClearResetRequest,
} from "./routes/portal-login";
import {
  handleGetCustomProviders,
  handleAddCustomProvider,
  handleDeleteCustomProvider,
} from "./routes/custom-providers";
import {
  handleGetTimelineEvents,
  handleAddTimelineEvent,
  handleUpdateTimelineEvent,
  handleDeleteTimelineEvent,
} from "./routes/timeline";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Security: Rate limiting for form submissions (5 per hour per IP)
  const formRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per hour
    message: "Too many briefing submissions. Please try again later.",
  });

  // Security: Rate limiting for login attempts (10 per 15 minutes per IP)
  const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per 15 minutes
    message: "Too many login attempts. Please try again later.",
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Briefing submission endpoint (with rate limiting)
  app.post("/api/briefing-submission", formRateLimit, handleBriefingSubmission);

  // Form progress tracking endpoints
  app.post("/api/save-progress", handleSaveProgress);
  app.get("/api/submissions", handleGetSubmissions);

  // Customer registration endpoints
  app.post("/api/validate-email", handleValidateEmail);
  app.post("/api/register-customer", handleRegisterCustomer);
  app.get("/api/personal-domains", handleGetPersonalDomains);
  app.get("/api/customer-profile", handleGetCustomerProfile);

  // Portal login endpoints
  app.post("/api/portal-login", loginRateLimit, handlePortalLogin);
  app.post("/api/portal-login/change-password", handleChangePassword);
  app.post("/api/portal-login/forgot-password", handleForgotPassword);
  app.get("/api/portal-login/reset-requests", handleGetResetRequests);
  app.post("/api/portal-login/clear-reset-request", handleClearResetRequest);
  app.post("/api/admin/portal-login", handleAddPortalLogin);

  // Admin customer management endpoints
  app.get("/api/admin/customers", handleGetAllCustomers);
  app.post("/api/admin/customers/approve", handleApproveCustomer);
  app.post("/api/admin/customers/reject", handleRejectCustomer);
  app.post("/api/admin/customers/remove", handleRemoveCustomer);

  // Custom providers endpoints
  app.get("/api/custom-providers", handleGetCustomProviders);
  app.post("/api/custom-providers", handleAddCustomProvider);
  app.post("/api/custom-providers/delete", handleDeleteCustomProvider);

  // Timeline management endpoints
  app.get("/api/timeline-events", handleGetTimelineEvents);
  app.post("/api/admin/timeline-events", handleAddTimelineEvent);
  app.post("/api/admin/timeline-events/update", handleUpdateTimelineEvent);
  app.post("/api/admin/timeline-events/delete", handleDeleteTimelineEvent);

  // Audit logs endpoint (admin only)
  app.get("/api/admin/audit-logs", async (req, res) => {
    try {
      const { adminEmail } = req.query;

      // Verify admin access
      if (!adminEmail || !adminEmail.toString().endsWith("@itmethods.com")) {
        return res.status(403).json({
          error: "Unauthorized: only @itmethods.com emails can view audit logs",
        });
      }

      const limit = parseInt((req.query.limit as string) || "100");
      const offset = parseInt((req.query.offset as string) || "0");

      const logs = await getAuditLogs(limit, offset);

      return res.status(200).json({
        success: true,
        logs,
        count: logs.length,
      });
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      return res.status(500).json({
        error: "Failed to fetch audit logs",
      });
    }
  });

  // CAPTCHA verification endpoint
  app.post("/api/verify-captcha", async (req, res) => {
    try {
      const { captchaToken } = req.body;

      if (!captchaToken) {
        return res.status(400).json({
          error: "CAPTCHA token is required",
        });
      }

      const result = await verifyCaptcha(captchaToken);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error verifying CAPTCHA:", error);
      return res.status(500).json({
        error: "Failed to verify CAPTCHA",
      });
    }
  });

  // Partner access request endpoint
  app.post("/api/partner-access-request", async (req, res) => {
    try {
      const { companyName, contactName, contactEmail, contactPhone, expertise, description } = req.body;

      // Validate required fields
      if (!companyName || !contactName || !contactEmail || !description) {
        return res.status(400).json({
          error: "Missing required fields",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      }

      // Log the partner access request
      await logFormSubmission(contactEmail, companyName, req);

      console.log("Partner access request received:", {
        companyName,
        contactName,
        contactEmail,
        contactPhone,
        expertise,
        description,
        timestamp: new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        message: "Partner access request submitted successfully",
      });
    } catch (error) {
      console.error("Error processing partner access request:", error);
      return res.status(500).json({
        error: "Failed to process request",
      });
    }
  });

  return app;
}
