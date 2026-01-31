import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleBriefingSubmission } from "./routes/briefing";
import { handleSaveProgress, handleGetSubmissions, handleApproveCustomer, handleRejectCustomer, handleRemoveCustomer, handleGetAllCustomers } from "./routes/submissions";
import { handleValidateEmail, handleRegisterCustomer, handleGetPersonalDomains, handleGetCustomerProfile } from "./routes/customers";
import { rateLimit } from "./lib/rate-limit";
import { verifyCaptcha } from "./lib/captcha";
import { getAuditLogs, isAdminEmail } from "./lib/audit-log";

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

  // Briefing submission endpoint
  app.post("/api/briefing-submission", handleBriefingSubmission);

  // Form progress tracking endpoints
  app.post("/api/save-progress", handleSaveProgress);
  app.get("/api/submissions", handleGetSubmissions);

  // Customer registration endpoints
  app.post("/api/validate-email", handleValidateEmail);
  app.post("/api/register-customer", handleRegisterCustomer);
  app.get("/api/personal-domains", handleGetPersonalDomains);
  app.get("/api/customer-profile", handleGetCustomerProfile);

  // Admin customer management endpoints
  app.get("/api/admin/customers", handleGetAllCustomers);
  app.post("/api/admin/customers/approve", handleApproveCustomer);
  app.post("/api/admin/customers/reject", handleRejectCustomer);
  app.post("/api/admin/customers/remove", handleRemoveCustomer);

  return app;
}
