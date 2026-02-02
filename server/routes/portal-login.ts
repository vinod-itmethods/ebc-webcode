import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export async function handlePortalLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const emailLower = email.toLowerCase();

    // Try customer login first
    const { data: customerData, error: customerError } = await supabase
      .from("portal_customer_logins")
      .select("id, email, password_hash, role, company_id, created_at")
      .eq("email", emailLower)
      .single();

    if (!customerError && customerData && customerData.password_hash === password) {
      return res.status(200).json({
        success: true,
        user: {
          id: customerData.id,
          email: customerData.email,
          role: "customer",
          companyId: customerData.company_id,
        },
      });
    }

    // Try provider login
    const { data: providerData, error: providerError } = await supabase
      .from("portal_provider_logins")
      .select("id, email, password_hash, role, company_id, created_at")
      .eq("email", emailLower)
      .single();

    if (!providerError && providerData && providerData.password_hash === password) {
      return res.status(200).json({
        success: true,
        user: {
          id: providerData.id,
          email: providerData.email,
          role: "provider",
          companyId: providerData.company_id,
        },
      });
    }

    // No user found or password incorrect
    return res.status(401).json({
      error: "Invalid email or password",
    });
  } catch (error) {
    console.error("Error in portal login:", error);
    return res.status(500).json({
      error: "An error occurred during login",
    });
  }
}

// Store password reset requests in memory (in production, use database)
const passwordResetRequests: Map<string, { email: string; requestedAt: Date }> = new Map();

// Endpoint for forgot password requests
export async function handleForgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const emailLower = email.toLowerCase();

    // Check if user exists in either table
    const { data: customerData } = await supabase
      .from("portal_customer_logins")
      .select("id")
      .eq("email", emailLower)
      .single();

    const { data: providerData } = await supabase
      .from("portal_provider_logins")
      .select("id")
      .eq("email", emailLower)
      .single();

    if (!customerData && !providerData) {
      // For security, don't reveal if email exists or not
      // Always return success message
      return res.status(200).json({
        success: true,
        message: "If an account exists with this email, a password reset request has been sent",
      });
    }

    // Store reset request
    passwordResetRequests.set(emailLower, {
      email: emailLower,
      requestedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Password reset request submitted successfully",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return res.status(500).json({
      error: "An error occurred while processing your request",
    });
  }
}

// Get pending password reset requests (admin only)
export async function handleGetResetRequests(req: Request, res: Response) {
  try {
    const { adminEmail } = req.query;

    // Verify admin access
    if (!adminEmail || !adminEmail.toString().endsWith("@itmethods.com")) {
      return res.status(403).json({
        error: "Unauthorized: only @itmethods.com emails can view reset requests",
      });
    }

    const requests = Array.from(passwordResetRequests.values()).map((req) => ({
      email: req.email,
      requestedAt: req.requestedAt.toISOString(),
    }));

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error getting reset requests:", error);
    return res.status(500).json({
      error: "An error occurred while fetching reset requests",
    });
  }
}

// Clear a password reset request (admin calls this after resetting password)
export async function handleClearResetRequest(req: Request, res: Response) {
  try {
    const { adminEmail, email } = req.body;

    // Verify admin access
    if (!adminEmail || !adminEmail.endsWith("@itmethods.com")) {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    passwordResetRequests.delete(email.toLowerCase());

    return res.status(200).json({
      success: true,
      message: "Reset request cleared",
    });
  } catch (error) {
    console.error("Error clearing reset request:", error);
    return res.status(500).json({
      error: "An error occurred",
    });
  }
}

// Endpoint to change user password (authenticated users)
export async function handleChangePassword(req: Request, res: Response) {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Email, current password, and new password are required",
      });
    }

    const emailLower = email.toLowerCase();

    // Try customer login first
    const { data: customerData, error: customerError } = await supabase
      .from("portal_customer_logins")
      .select("id, email, password_hash, role")
      .eq("email", emailLower)
      .single();

    if (!customerError && customerData && customerData.password_hash === currentPassword) {
      // Update customer password
      const { error: updateError } = await supabase
        .from("portal_customer_logins")
        .update({ password_hash: newPassword })
        .eq("email", emailLower);

      if (updateError) {
        throw updateError;
      }

      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    }

    // Try provider login
    const { data: providerData, error: providerError } = await supabase
      .from("portal_provider_logins")
      .select("id, email, password_hash, role")
      .eq("email", emailLower)
      .single();

    if (!providerError && providerData && providerData.password_hash === currentPassword) {
      // Update provider password
      const { error: updateError } = await supabase
        .from("portal_provider_logins")
        .update({ password_hash: newPassword })
        .eq("email", emailLower);

      if (updateError) {
        throw updateError;
      }

      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    }

    // Current password is incorrect
    return res.status(401).json({
      error: "Current password is incorrect",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      error: "An error occurred while changing password",
    });
  }
}

// Endpoint to manage portal logins (admin only)
export async function handleAddPortalLogin(req: Request, res: Response) {
  try {
    const { adminEmail, email, password, role, companyId } = req.body;

    // Verify admin access
    if (!adminEmail || !adminEmail.endsWith("@itmethods.com")) {
      return res.status(403).json({
        error: "Unauthorized: only @itmethods.com emails can manage portal logins",
      });
    }

    if (!email || !password || !role) {
      return res.status(400).json({
        error: "Email, password, and role are required",
      });
    }

    if (role !== "customer" && role !== "provider") {
      return res.status(400).json({
        error: "Role must be either 'customer' or 'provider'",
      });
    }

    const emailLower = email.toLowerCase();
    const table = role === "customer" ? "portal_customer_logins" : "portal_provider_logins";

    const { data, error } = await supabase
      .from(table)
      .insert([
        {
          email: emailLower,
          password_hash: password,
          role,
          company_id: companyId || null,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          error: "Email already exists in portal logins",
        });
      }
      throw error;
    }

    return res.status(201).json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.error("Error adding portal login:", error);
    return res.status(500).json({
      error: "An error occurred while adding portal login",
    });
  }
}
