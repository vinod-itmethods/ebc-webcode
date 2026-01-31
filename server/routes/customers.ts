import { Request, Response } from "express";
import {
  createCustomerProfile,
  isValidWorkEmail,
  getCustomerByEmail,
  getPersonalEmailDomains,
} from "../utils/customers";

export async function handleValidateEmail(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const isValid = isValidWorkEmail(email);

    if (!isValid) {
      const domain = email.split("@")[1];
      return res.status(400).json({
        error:
          "Personal email domains are not allowed. Please use your work email address.",
        domain,
        isPersonalEmail: true,
      });
    }

    // Check if customer already exists
    const existingCustomer = getCustomerByEmail(email);

    return res.status(200).json({
      success: true,
      isValid: true,
      isNewCustomer: !existingCustomer,
      message: existingCustomer
        ? "Customer profile exists. Updating with new briefing data."
        : "Valid work email. New customer profile will be created.",
    });
  } catch (error) {
    console.error("Error validating email:", error);
    return res.status(500).json({
      error: "Failed to validate email",
    });
  }
}

export async function handleRegisterCustomer(req: Request, res: Response) {
  try {
    const {
      email,
      name,
      role,
      company,
      briefingData,
      additionalContactName,
      additionalContactEmail,
    } = req.body;

    if (!email || !name || !role || !company) {
      return res.status(400).json({
        error: "Missing required fields: email, name, role, company",
      });
    }

    // Validate work email
    if (!isValidWorkEmail(email)) {
      const domain = email.split("@")[1];
      return res.status(400).json({
        error:
          "Personal email domains are not allowed. Please use your work email address.",
        domain,
        isPersonalEmail: true,
      });
    }

    // Validate additional contact email if provided
    let additionalContact = undefined;
    if (additionalContactName || additionalContactEmail) {
      if (!additionalContactName || !additionalContactEmail) {
        return res.status(400).json({
          error: "Both name and email required for additional contact",
        });
      }
      if (!isValidWorkEmail(additionalContactEmail)) {
        return res.status(400).json({
          error: "Additional contact must use a work email address",
          isPersonalEmail: true,
        });
      }
      additionalContact = {
        name: additionalContactName,
        email: additionalContactEmail,
      };
    }

    // Create customer profile
    const customer = await createCustomerProfile(
      email,
      name,
      role,
      company,
      briefingData,
      additionalContact,
    );

    if (!customer) {
      return res.status(400).json({
        error: "Failed to create customer profile",
      });
    }

    return res.status(201).json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        company: customer.company,
        additionalContact: customer.additionalContact,
        createdAt: customer.createdAt,
      },
      message: "Customer profile created successfully",
    });
  } catch (error) {
    console.error("Error registering customer:", error);
    return res.status(500).json({
      error: "Failed to register customer",
    });
  }
}

export async function handleGetPersonalDomains(req: Request, res: Response) {
  try {
    const domains = getPersonalEmailDomains();
    return res.status(200).json({
      success: true,
      personalDomains: domains,
    });
  } catch (error) {
    console.error("Error fetching personal domains:", error);
    return res.status(500).json({
      error: "Failed to fetch personal domains",
    });
  }
}

export async function handleGetCustomerProfile(req: Request, res: Response) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const customer = await getCustomerByEmail(String(email));

    if (!customer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    return res.status(500).json({
      error: "Failed to fetch customer profile",
    });
  }
}
