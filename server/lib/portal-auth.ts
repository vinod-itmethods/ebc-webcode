import { supabase } from "./supabase";

export type PortalRole = "customer" | "provider";

interface PortalUser {
  id: string;
  email: string;
  role: PortalRole;
  companyId?: string;
  createdAt: string;
}

// Initialize portal auth tables if they don't exist
export async function initializePortalAuth() {
  try {
    // Check if tables exist by attempting to query them
    const { error: customerError } = await supabase
      .from("portal_customer_logins")
      .select("id")
      .limit(1);

    const { error: providerError } = await supabase
      .from("portal_provider_logins")
      .select("id")
      .limit(1);

    // If tables don't exist, create them
    if (customerError?.code === "42P01") {
      // Create customer logins table
      const { error } = await supabase.rpc("create_portal_tables");
      if (error && error.code !== "42P01") {
        console.error("Error creating customer logins table:", error);
      }
    }

    if (providerError?.code === "42P01") {
      const { error } = await supabase.rpc("create_portal_tables");
      if (error && error.code !== "42P01") {
        console.error("Error creating provider logins table:", error);
      }
    }
  } catch (error) {
    console.error("Error initializing portal auth:", error);
  }
}

// Verify portal login
export async function verifyPortalLogin(
  email: string,
  password: string,
): Promise<{ user: PortalUser | null; error: string | null }> {
  try {
    // Try customer login first
    const { data: customerData, error: customerError } = await supabase
      .from("portal_customer_logins")
      .select("id, email, password_hash, role, company_id, created_at")
      .eq("email", email.toLowerCase())
      .single();

    if (!customerError && customerData) {
      // Verify password (in production, use bcrypt)
      if (customerData.password_hash === password) {
        return {
          user: {
            id: customerData.id,
            email: customerData.email,
            role: "customer",
            companyId: customerData.company_id,
            createdAt: customerData.created_at,
          },
          error: null,
        };
      }
    }

    // Try provider login
    const { data: providerData, error: providerError } = await supabase
      .from("portal_provider_logins")
      .select("id, email, password_hash, role, company_id, created_at")
      .eq("email", email.toLowerCase())
      .single();

    if (!providerError && providerData) {
      // Verify password (in production, use bcrypt)
      if (providerData.password_hash === password) {
        return {
          user: {
            id: providerData.id,
            email: providerData.email,
            role: "provider",
            companyId: providerData.company_id,
            createdAt: providerData.created_at,
          },
          error: null,
        };
      }
    }

    // No user found or password incorrect
    return {
      user: null,
      error: "Invalid email or password",
    };
  } catch (error) {
    console.error("Error verifying portal login:", error);
    return {
      user: null,
      error: "An error occurred during login",
    };
  }
}

// Add a new customer login
export async function addCustomerLogin(
  email: string,
  passwordHash: string,
  companyId?: string,
) {
  const { data, error } = await supabase
    .from("portal_customer_logins")
    .insert([
      {
        email: email.toLowerCase(),
        password_hash: passwordHash,
        role: "customer",
        company_id: companyId,
      },
    ])
    .select()
    .single();

  return { data, error };
}

// Add a new provider login
export async function addProviderLogin(
  email: string,
  passwordHash: string,
  companyId: string,
) {
  const { data, error } = await supabase
    .from("portal_provider_logins")
    .insert([
      {
        email: email.toLowerCase(),
        password_hash: passwordHash,
        role: "provider",
        company_id: companyId,
      },
    ])
    .select()
    .single();

  return { data, error };
}

// Get user role for authorization checks
export async function getUserRole(email: string): Promise<PortalRole | null> {
  // Check customer table
  const { data: customerData } = await supabase
    .from("portal_customer_logins")
    .select("role")
    .eq("email", email.toLowerCase())
    .single();

  if (customerData) {
    return "customer";
  }

  // Check provider table
  const { data: providerData } = await supabase
    .from("portal_provider_logins")
    .select("role")
    .eq("email", email.toLowerCase())
    .single();

  if (providerData) {
    return "provider";
  }

  return null;
}
