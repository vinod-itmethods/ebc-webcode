import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const CUSTOMERS_FILE = join(process.cwd(), "data", "customers.json");

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
}

function ensureDataDir() {
  const dir = join(process.cwd(), "data");
  if (!existsSync(dir)) {
    try {
      readFileSync(dir);
    } catch {
      writeFileSync(CUSTOMERS_FILE, JSON.stringify([]));
    }
  }
}

function loadCustomers(): CustomerProfile[] {
  ensureDataDir();
  try {
    if (existsSync(CUSTOMERS_FILE)) {
      const data = readFileSync(CUSTOMERS_FILE, "utf-8");
      return JSON.parse(data || "[]");
    }
  } catch (error) {
    console.error("Error loading customers:", error);
  }
  return [];
}

function saveCustomers(customers: CustomerProfile[]) {
  ensureDataDir();
  try {
    writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2));
  } catch (error) {
    console.error("Error saving customers:", error);
    throw error;
  }
}

export function isValidWorkEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return !PERSONAL_EMAIL_DOMAINS.includes(domain);
}

export function createCustomerProfile(
  email: string,
  name: string,
  role: string,
  company: string,
  briefingData: any
): CustomerProfile | null {
  // Validate email domain
  if (!isValidWorkEmail(email)) {
    return null;
  }

  const customers = loadCustomers();
  const now = new Date().toISOString();

  // Check if customer already exists
  let customer = customers.find((c) => c.email.toLowerCase() === email.toLowerCase());

  if (customer) {
    // Update existing customer
    customer.updatedAt = now;
    customer.briefingData = briefingData;
    customer.status = "active";
  } else {
    // Create new customer
    customer = {
      id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase(),
      name,
      role,
      company,
      createdAt: now,
      updatedAt: now,
      briefingData,
      status: "active",
    };
    customers.push(customer);
  }

  saveCustomers(customers);
  return customer;
}

export function getCustomerByEmail(email: string): CustomerProfile | undefined {
  const customers = loadCustomers();
  return customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export function getAllCustomers(): CustomerProfile[] {
  return loadCustomers();
}

export function getPersonalEmailDomains(): string[] {
  return PERSONAL_EMAIL_DOMAINS;
}
