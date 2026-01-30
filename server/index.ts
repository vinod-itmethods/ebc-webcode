import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleBriefingSubmission } from "./routes/briefing";
import { handleSaveProgress, handleGetSubmissions } from "./routes/submissions";
import { handleValidateEmail, handleRegisterCustomer, handleGetPersonalDomains } from "./routes/customers";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  return app;
}
