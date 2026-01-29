import { Request, Response } from "express";
import nodemailer from "nodemailer";

// Partner data for looking up vendor names
const partners = require("../../client/data/partners").partners;

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true" || false,
  auth: {
    user: process.env.SMTP_USER || "test@ethereal.email",
    pass: process.env.SMTP_PASS || "password",
  },
});

interface BriefingFormData {
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

function getVendorNames(vendorIds: string[]): string[] {
  return vendorIds
    .map((id) => {
      const partner = partners.find((p) => p.id === id);
      return partner?.name || id;
    })
    .filter(Boolean);
}

function formatBriefingEmail(data: BriefingFormData): string {
  const vendorNames = getVendorNames(data.vendors);

  return `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0066cc;">New Briefing Request Submission</h2>
      
      <h3 style="margin-top: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Contact Information</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Company:</strong> ${data.company}</p>
      <p><strong>Role/Title:</strong> ${data.role}</p>
      ${data.assistant ? `<p><strong>Assistant/Coordinator:</strong> ${data.assistant}</p>` : ""}

      <h3 style="margin-top: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Briefing Details</h3>
      <p><strong>Areas of Interest:</strong></p>
      <ul style="margin: 5px 0;">
        ${data.interests.map((interest) => `<li>${interest}</li>`).join("")}
        ${data.interestOther ? `<li>Other: ${data.interestOther}</li>` : ""}
      </ul>

      <p style="margin-top: 15px;"><strong>Decision Context:</strong></p>
      <ul style="margin: 5px 0;">
        ${data.decisionContext.map((context) => `<li>${context}</li>`).join("")}
      </ul>

      <p style="margin-top: 15px;"><strong>Technology Perspectives Needed:</strong></p>
      <ul style="margin: 5px 0;">
        ${data.perspectives.map((perspective) => `<li>${perspective}</li>`).join("")}
      </ul>

      ${
        vendorNames.length > 0
          ? `
      <p style="margin-top: 15px;"><strong>Technology Vendors of Interest:</strong></p>
      <ul style="margin: 5px 0;">
        ${vendorNames.map((name) => `<li>${name}</li>`).join("")}
      </ul>
      `
          : ""
      }

      <h3 style="margin-top: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Format & Location</h3>
      <p><strong>Format:</strong> ${data.format}</p>
      <p><strong>Location:</strong> ${data.location}</p>

      <h3 style="margin-top: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Goals & Outcomes</h3>
      <p style="white-space: pre-wrap; background: #f5f5f5; padding: 10px; border-radius: 4px;">${data.goals}</p>

      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #999;">
        This briefing request was submitted on ${new Date().toLocaleString()}
      </p>
    </div>
  </body>
</html>
  `;
}

export async function handleBriefingSubmission(req: Request, res: Response) {
  const data: BriefingFormData = req.body;

  // Validate required fields
  if (!data.name || !data.email || !data.company) {
    return res.status(400).json({
      error: "Missing required fields: name, email, company",
    });
  }

  const internalEmails = [
    "daniel.roberts@itmethods.com",
    "ava.nguyen@itmethods.com",
    "sales@itmethods.com",
  ];

  const emailHtml = formatBriefingEmail(data);

  try {
    // Send to internal team
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@itmethods.com",
      to: internalEmails.join(","),
      subject: `New Briefing Request from ${data.name} (${data.company})`,
      html: emailHtml,
    });

    console.log(
      `Briefing request email sent to internal team for ${data.name} from ${data.company}`
    );

    return res.status(200).json({
      success: true,
      message: "Briefing request submitted successfully",
    });
  } catch (error) {
    console.error("Error sending briefing request email:", error);
    return res.status(500).json({
      error: "Failed to process briefing request",
    });
  }
}
