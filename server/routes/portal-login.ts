import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

// Initialize portal tables on first request
let tablesInitialized = false;

async function ensureTablesExist() {
  if (tablesInitialized) return;

  try {
    // Try to query the tables to see if they exist
    const { error: customerError } = await supabase
      .from("portal_customer_logins")
      .select("id")
      .limit(1);

    const { error: providerError } = await supabase
      .from("portal_provider_logins")
      .select("id")
      .limit(1);

    // If either table doesn't exist, create both
    if (customerError?.code === "42P01" || providerError?.code === "42P01") {
      // Create portal_customer_logins table
      await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS portal_customer_logins (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'customer',
            company_id VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE INDEX IF NOT EXISTS idx_portal_customer_logins_email ON portal_customer_logins(email);
          
          CREATE TABLE IF NOT EXISTS portal_provider_logins (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'provider',
            company_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE INDEX IF NOT EXISTS idx_portal_provider_logins_email ON portal_provider_logins(email);
          
          INSERT INTO portal_customer_logins (email, password_hash, role, company_id)
          VALUES ('ava@tiaa.com', 'executive2024', 'customer', NULL)
          ON CONFLICT (email) DO NOTHING;
          
          INSERT INTO portal_provider_logins (email, password_hash, role, company_id)
          VALUES ('contact@google.com', 'executive2024', 'provider', 'google')
          ON CONFLICT (email) DO NOTHING;
          
          INSERT INTO portal_provider_logins (email, password_hash, role, company_id)
          VALUES ('contact@microsoft.com', 'executive2024', 'provider', 'microsoft')
          ON CONFLICT (email) DO NOTHING;
        `,
      });
    }

    tablesInitialized = true;
  } catch (error) {
    console.error("Error ensuring tables exist:", error);
  }
}

export async function handlePortalLogin(req: Request, res: Response) {
  try {
    // Ensure tables exist
    await ensureTablesExist();

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
