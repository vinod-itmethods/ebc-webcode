import { supabase } from "./supabase";
import { Request } from "express";

export interface AuditLogEntry {
  action: string;
  actorEmail: string;
  targetEmail?: string;
  targetType: "customer" | "submission" | "form" | "admin" | "auth";
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an action for audit trail
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const { error } = await supabase.from("audit_logs").insert({
      id,
      action: entry.action,
      actor_email: entry.actorEmail,
      target_email: entry.targetEmail || null,
      target_type: entry.targetType,
      details: entry.details,
      created_at: now,
    });

    if (error) {
      console.error("Error logging audit entry:", error);
    }
  } catch (error) {
    console.error("Error in logAudit:", error);
  }
}

/**
 * Helper function to log customer approval
 */
export async function logCustomerApproval(
  approverEmail: string,
  customerEmail: string,
  request?: Request,
): Promise<void> {
  await logAudit({
    action: "customer_approved",
    actorEmail: approverEmail,
    targetEmail: customerEmail,
    targetType: "customer",
    details: {
      approvedAt: new Date().toISOString(),
      ipAddress: request?.ip || "unknown",
      userAgent: request?.get("user-agent") || "unknown",
    },
    ipAddress: request?.ip,
    userAgent: request?.get("user-agent"),
  });
}

/**
 * Helper function to log customer rejection
 */
export async function logCustomerRejection(
  approverEmail: string,
  customerEmail: string,
  request?: Request,
): Promise<void> {
  await logAudit({
    action: "customer_rejected",
    actorEmail: approverEmail,
    targetEmail: customerEmail,
    targetType: "customer",
    details: {
      rejectedAt: new Date().toISOString(),
      ipAddress: request?.ip || "unknown",
      userAgent: request?.get("user-agent") || "unknown",
    },
    ipAddress: request?.ip,
    userAgent: request?.get("user-agent"),
  });
}

/**
 * Helper function to log form submission
 */
export async function logFormSubmission(
  customerEmail: string,
  company: string,
  request?: Request,
): Promise<void> {
  await logAudit({
    action: "form_submitted",
    actorEmail: customerEmail,
    targetEmail: customerEmail,
    targetType: "form",
    details: {
      company,
      submittedAt: new Date().toISOString(),
      ipAddress: request?.ip || "unknown",
      userAgent: request?.get("user-agent") || "unknown",
    },
    ipAddress: request?.ip,
    userAgent: request?.get("user-agent"),
  });
}

/**
 * Helper function to log admin login
 */
export async function logAdminLogin(
  adminEmail: string,
  request?: Request,
): Promise<void> {
  await logAudit({
    action: "admin_login",
    actorEmail: adminEmail,
    targetType: "auth",
    details: {
      loginAt: new Date().toISOString(),
      ipAddress: request?.ip || "unknown",
      userAgent: request?.get("user-agent") || "unknown",
    },
    ipAddress: request?.ip,
    userAgent: request?.get("user-agent"),
  });
}

/**
 * Helper function to log failed login attempt
 */
export async function logFailedLogin(
  email: string,
  request?: Request,
): Promise<void> {
  await logAudit({
    action: "login_failed",
    actorEmail: email,
    targetType: "auth",
    details: {
      attemptAt: new Date().toISOString(),
      ipAddress: request?.ip || "unknown",
      userAgent: request?.get("user-agent") || "unknown",
    },
    ipAddress: request?.ip,
    userAgent: request?.get("user-agent"),
  });
}

/**
 * Get audit logs (admin only)
 */
export async function getAuditLogs(
  limit: number = 100,
  offset: number = 0,
): Promise<any[]> {
  const { data } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return data || [];
}

/**
 * Get audit logs for specific email
 */
export async function getAuditLogsForEmail(
  email: string,
  limit: number = 50,
): Promise<any[]> {
  const { data } = await supabase
    .from("audit_logs")
    .select("*")
    .or(`actor_email.eq.${email},target_email.eq.${email}`)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data || [];
}
