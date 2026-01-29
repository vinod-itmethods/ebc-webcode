import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Configure your email service here
// For development, you can use Ethereal Email (free test service)
// For production, update with your email service credentials

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: {
    user: process.env.SMTP_USER || 'test@ethereal.email',
    pass: process.env.SMTP_PASS || 'password',
  },
});

interface EmailTemplate {
  to: string | string[];
  subject: string;
  html: string;
}

function renderTemplate(templateName: string, variables: Record<string, any>): string {
  const templatePath = path.join(process.cwd(), 'server', 'templates', `${templateName}.html`);
  let template = fs.readFileSync(templatePath, 'utf-8');

  // Simple template variable replacement
  Object.entries(variables).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // For arrays, render each item
      const rendered = value.map(item => `<span class="badge">${item}</span>`).join('');
      template = template.replace(new RegExp(`{{#each ${key}}}.*?{{/each}}`, 's'), rendered);
    } else if (typeof value === 'boolean') {
      // Handle if statements
      if (value) {
        template = template.replace(new RegExp(`{{#if ${key}}}`, 'g'), '');
        template = template.replace(new RegExp(`{{/if}}`, 'g'), '');
      } else {
        template = template.replace(new RegExp(`{{#if ${key}}}.*?{{/if}}`, 's'), '');
      }
    } else {
      // Regular variable replacement
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), String(value || ''));
    }
  });

  return template;
}

export async function sendInternalBriefingEmail(briefingData: Record<string, any>) {
  const internalEmails = [
    'partners@itmethods.com',
    'ava.nguyen@itmethods.com',
    'daniel.roberts@itmethods.com',
    'rob.stevens@itmethods.com'
  ];

  const html = renderTemplate('internal-team-email', {
    userType: 'Customer',
    submissionDate: new Date().toLocaleDateString(),
    ...briefingData,
  });

  const emailTemplate: EmailTemplate = {
    to: internalEmails,
    subject: `New Briefing Request from ${briefingData.name || 'Unknown'}`,
    html,
  };

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@itmethods.com',
      ...emailTemplate,
    });
    console.log('Internal email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending internal email:', error);
    throw error;
  }
}

export async function sendCustomerConfirmationEmail(
  customerEmail: string,
  customerName: string,
  loginCredentials: {
    email: string;
    password: string;
    portalUrl: string;
  }
) {
  const html = renderTemplate('customer-confirmation-email', {
    customerName,
    customerEmail: loginCredentials.email,
    temporaryPassword: loginCredentials.password,
    portalUrl: loginCredentials.portalUrl,
    supportEmail: 'partners@itmethods.com',
    supportPhone: '+1 (555) 000-0000',
  });

  const emailTemplate: EmailTemplate = {
    to: customerEmail,
    subject: 'Your Briefing Request Confirmation - Login Credentials',
    html,
  };

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@itmethods.com',
      ...emailTemplate,
    });
    console.log('Customer confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
    throw error;
  }
}

export async function sendPartnerAccessRequestEmail(accessRequestData: Record<string, any>) {
  const internalEmails = [
    'partners@itmethods.com',
    'ava.nguyen@itmethods.com',
    'daniel.roberts@itmethods.com',
    'rob.stevens@itmethods.com'
  ];

  // Create a simple text email for partner access requests
  const emailContent = `
New Partner Access Request

Company: ${accessRequestData.companyName}
Contact: ${accessRequestData.contactName}
Email: ${accessRequestData.contactEmail}
Phone: ${accessRequestData.contactPhone}
Website: ${accessRequestData.companyWebsite || 'N/A'}

Areas of Expertise:
${accessRequestData.expertise?.map((area: string) => `- ${area}`).join('\n') || 'None specified'}

Description:
${accessRequestData.description}

---
Submitted: ${new Date().toLocaleString()}
  `;

  const emailTemplate: EmailTemplate = {
    to: internalEmails,
    subject: `New Partner Access Request from ${accessRequestData.companyName}`,
    html: `<pre style="white-space: pre-wrap; word-wrap: break-word;">${emailContent}</pre>`,
  };

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@itmethods.com',
      ...emailTemplate,
    });
    console.log('Partner access request email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending partner access request email:', error);
    throw error;
  }
}

export function generateCredentials() {
  // Generate a random password (14 characters)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 14; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return {
    password,
    portalUrl: process.env.PORTAL_URL || 'https://example.com/portal',
  };
}
