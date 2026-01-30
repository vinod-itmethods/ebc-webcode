import { Request, Response } from "express";
import nodemailer from "nodemailer";

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


function formatBriefingEmail(data: BriefingFormData): string {

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
        data.vendors.length > 0
          ? `
      <p style="margin-top: 15px;"><strong>Technology Vendors of Interest:</strong></p>
      <ul style="margin: 5px 0;">
        ${data.vendors.map((vendor) => `<li>${vendor}</li>`).join("")}
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

function formatCustomerConfirmationEmail(data: BriefingFormData): string {
  const portalUrl = process.env.PORTAL_URL || "https://briefing.example.com/portal";

  return `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to Executive Briefing Council</h1>
      </div>

      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
        <p>Hi ${data.name},</p>

        <p style="font-size: 16px; margin-bottom: 20px;">
          Thank you for submitting your briefing request! We've received your organization's technology priorities and strategic needs.
        </p>

        <div style="background: white; border: 2px solid #0066cc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin-top: 0; font-weight: bold; color: #0066cc;">What happens next?</p>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li>Our team reviews your briefing plan</li>
            <li>We confirm timing and select relevant technology partners</li>
            <li>Your secure portal will be updated with the briefing agenda</li>
            <li>You'll receive email notifications of all updates</li>
          </ol>
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
          <a href="${portalUrl}" style="display: inline-block; background: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Access Your Customer Portal
          </a>
        </div>

        <div style="background: #f0f7ff; padding: 15px; border-radius: 6px; border-left: 4px solid #0066cc; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px;">
            <strong>Your Portal Login:</strong><br/>
            Email: ${data.email}<br/>
            You can set up your password on your first visit to the portal.
          </p>
        </div>

        <p style="margin-bottom: 30px;">
          For any questions or updates to your request, please reply to this email or contact our team at <a href="mailto:briefings@itmethods.com">briefings@itmethods.com</a>.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

        <p style="font-size: 12px; color: #999; text-align: center;">
          Executive Briefing Council - Confidential<br/>
          You're receiving this because you submitted a briefing request to the Executive Briefing Council.
        </p>
      </div>
    </div>
  </body>
</html>
  `;
}

export async function sendCustomerConfirmationEmail(email: string, name: string, company: string): Promise<boolean> {
  const data = { name, email, company } as BriefingFormData;
  const customerEmailHtml = formatCustomerConfirmationEmail(data);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@itmethods.com",
      to: email,
      subject: `Briefing Request Approved - Welcome to Executive Briefing Council`,
      html: customerEmailHtml,
    });

    console.log(`Confirmation email sent to customer ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending confirmation email to customer:", error);
    return false;
  }
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

  const internalEmailHtml = formatBriefingEmail(data);

  try {
    // Send notification to internal team
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@itmethods.com",
      to: internalEmails.join(","),
      subject: `New Briefing Request Pending Approval from ${data.name} (${data.company})`,
      html: internalEmailHtml,
    });

    console.log(
      `Briefing request notification sent to internal team for ${data.name} from ${data.company}`
    );

    return res.status(200).json({
      success: true,
      message: "Briefing request submitted successfully. Awaiting admin approval.",
    });
  } catch (error) {
    console.error("Error sending briefing request notification:", error);
    return res.status(500).json({
      error: "Failed to process briefing request",
    });
  }
}
