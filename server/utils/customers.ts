import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
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

function ensureDataDir() {
  const dir = join(process.cwd(), "data");
  if (!existsSync(dir)) {
    try {
      mkdirSync(dir, { recursive: true });
    } catch (error) {
      console.error("Error creating data directory:", error);
    }
  }

  // Ensure the customers file exists
  if (!existsSync(CUSTOMERS_FILE)) {
    try {
      writeFileSync(CUSTOMERS_FILE, JSON.stringify([]));
    } catch (error) {
      console.error("Error creating customers file:", error);
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
  try {
    ensureDataDir();
    writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2));
    console.log(`Customers saved to ${CUSTOMERS_FILE}`);
  } catch (error) {
    console.error("Error saving customers to file:", error);
    console.error("File path:", CUSTOMERS_FILE);
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
    // Don't change approvalStatus if already set
    if (!customer.approvalStatus) {
      customer.approvalStatus = "pending";
    }
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
      approvalStatus: "pending",
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

export function approveCustomer(
  email: string,
  approvedBy: string
): CustomerProfile | null {
  const customers = loadCustomers();
  const customer = customers.find((c) => c.email.toLowerCase() === email.toLowerCase());

  if (customer) {
    customer.approvalStatus = "approved";
    customer.approvedAt = new Date().toISOString();
    customer.approvedBy = approvedBy;
    customer.updatedAt = new Date().toISOString();
    saveCustomers(customers);
    return customer;
  }

  return null;
}

export function rejectCustomer(email: string): CustomerProfile | null {
  const customers = loadCustomers();
  const customer = customers.find((c) => c.email.toLowerCase() === email.toLowerCase());

  if (customer) {
    customer.approvalStatus = "rejected";
    customer.updatedAt = new Date().toISOString();
    saveCustomers(customers);
    return customer;
  }

  return null;
}

export function removeCustomer(email: string): boolean {
  const customers = loadCustomers();
  const index = customers.findIndex((c) => c.email.toLowerCase() === email.toLowerCase());

  if (index !== -1) {
    customers.splice(index, 1);
    saveCustomers(customers);
    return true;
  }

  return false;
}
