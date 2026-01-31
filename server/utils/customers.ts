import { supabase } from "../lib/supabase";

// Note: JSON file support removed in favor of Supabase

// Personal email domains to reject
const PERSONAL_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "aol.com",
  "protonmail.com",
  "icloud.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "163.com",
  "qq.com",
  "gmx.com",
  "test.com",
  "example.com",
];

export interface AdditionalContact {
  name: string;
  email: string;
}

export interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  company: string;
  createdAt: string;
  updatedAt: string;
  briefingData: any;
  status: "active" | "inactive";
  approvalStatus: "pending" | "approved" | "rejected";
  approvedAt?: string;
  approvedBy?: string;
  additionalContact?: AdditionalContact;
}

export function isValidWorkEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return !PERSONAL_EMAIL_DOMAINS.includes(domain);
}

export async function createCustomerProfile(
  email: string,
  name: string,
  role: string,
  company: string,
  briefingData: any,
  additionalContact?: AdditionalContact
): Promise<CustomerProfile | null> {
  // Validate email domain
  if (!isValidWorkEmail(email)) {
    return null;
  }

  const now = new Date().toISOString();
  const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Check if customer already exists
  const { data: existing } = await supabase
    .from("customers")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (existing) {
    // Update existing customer
    const { data: updated } = await supabase
      .from("customers")
      .update({
        updated_at: now,
        briefing_data: briefingData,
        additional_contact: additionalContact || null,
      })
      .eq("email", email.toLowerCase())
      .select()
      .single();

    return formatCustomerResponse(updated);
  } else {
    // Create new customer
    const { data: created } = await supabase
      .from("customers")
      .insert({
        id: customerId,
        email: email.toLowerCase(),
        name,
        role,
        company,
        created_at: now,
        updated_at: now,
        briefing_data: briefingData,
        status: "active",
        approval_status: "pending",
        additional_contact: additionalContact || null,
      })
      .select()
      .single();

    return formatCustomerResponse(created);
  }
}

export async function getCustomerByEmail(email: string): Promise<CustomerProfile | undefined> {
  try {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    return formatCustomerResponse(data);
  } catch (error) {
    return undefined;
  }
}

export async function getAllCustomers(): Promise<CustomerProfile[]> {
  const { data } = await supabase.from("customers").select("*");
  return data ? data.map(formatCustomerResponse).filter(Boolean) : [];
}

export function getPersonalEmailDomains(): string[] {
  return PERSONAL_EMAIL_DOMAINS;
}

export async function approveCustomer(
  email: string,
  approvedBy: string
): Promise<CustomerProfile | null> {
  const now = new Date().toISOString();

  const { data } = await supabase
    .from("customers")
    .update({
      approval_status: "approved",
      approved_at: now,
      approved_by: approvedBy,
      updated_at: now,
    })
    .eq("email", email.toLowerCase())
    .select()
    .single();

  return formatCustomerResponse(data);
}

export async function rejectCustomer(email: string): Promise<CustomerProfile | null> {
  const now = new Date().toISOString();

  const { data } = await supabase
    .from("customers")
    .update({
      approval_status: "rejected",
      updated_at: now,
    })
    .eq("email", email.toLowerCase())
    .select()
    .single();

  return formatCustomerResponse(data);
}

export async function removeCustomer(email: string): Promise<boolean> {
  const { error } = await supabase.from("customers").delete().eq("email", email.toLowerCase());

  return !error;
}

// Helper function to format Supabase response to CustomerProfile
function formatCustomerResponse(data: any): CustomerProfile | null {
  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role,
    company: data.company,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    briefingData: data.briefing_data,
    status: data.status,
    approvalStatus: data.approval_status,
    approvedAt: data.approved_at,
    approvedBy: data.approved_by,
    additionalContact: data.additional_contact,
  };
}
