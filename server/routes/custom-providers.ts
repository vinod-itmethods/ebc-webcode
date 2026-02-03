import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export async function handleGetCustomProviders(req: Request, res: Response) {
  try {
    const { data, error } = await supabase
      .from("custom_providers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching custom providers:", error);
      return res.status(500).json({
        error: "Failed to fetch custom providers",
      });
    }

    return res.status(200).json({
      success: true,
      providers: data || [],
    });
  } catch (error) {
    console.error("Error in handleGetCustomProviders:", error);
    return res.status(500).json({
      error: "An error occurred while fetching custom providers",
    });
  }
}

export async function handleAddCustomProvider(req: Request, res: Response) {
  try {
    const { adminEmail, id, name, tagline, description, logo, domain, categories, topics, benefits } = req.body;

    // Verify admin access
    if (!adminEmail || !adminEmail.endsWith("@itmethods.com")) {
      return res.status(401).json({
        error: "Unauthorized: only @itmethods.com emails can add providers",
      });
    }

    if (!id || !name || !tagline || !description || !categories || categories.length === 0) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Check if provider already exists
    const { data: existing } = await supabase
      .from("custom_providers")
      .select("id")
      .eq("id", id)
      .single();

    if (existing) {
      // Update existing provider
      const { error: updateError } = await supabase
        .from("custom_providers")
        .update({
          name,
          tagline,
          description,
          logo,
          domain,
          categories,
          topics,
          benefits,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating provider:", updateError);
        return res.status(500).json({
          error: "Failed to update provider",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Provider updated successfully",
      });
    } else {
      // Insert new provider
      const { error: insertError } = await supabase
        .from("custom_providers")
        .insert([
          {
            id,
            name,
            tagline,
            description,
            logo: logo || null,
            domain: domain || null,
            categories,
            topics: topics || [],
            benefits: benefits || [],
          },
        ]);

      if (insertError) {
        console.error("Error inserting provider:", insertError);
        return res.status(500).json({
          error: "Failed to add provider",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Provider added successfully",
      });
    }
  } catch (error) {
    console.error("Error in handleAddCustomProvider:", error);
    return res.status(500).json({
      error: "An error occurred while adding the provider",
    });
  }
}

export async function handleDeleteCustomProvider(req: Request, res: Response) {
  try {
    const { adminEmail, id } = req.body;

    // Verify admin access
    if (!adminEmail || !adminEmail.endsWith("@itmethods.com")) {
      return res.status(401).json({
        error: "Unauthorized: only @itmethods.com emails can delete providers",
      });
    }

    if (!id) {
      return res.status(400).json({
        error: "Provider ID is required",
      });
    }

    const { error } = await supabase
      .from("custom_providers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting provider:", error);
      return res.status(500).json({
        error: "Failed to delete provider",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Provider deleted successfully",
    });
  } catch (error) {
    console.error("Error in handleDeleteCustomProvider:", error);
    return res.status(500).json({
      error: "An error occurred while deleting the provider",
    });
  }
}
