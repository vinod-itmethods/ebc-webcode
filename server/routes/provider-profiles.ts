import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export async function handleSaveProviderProfile(req: Request, res: Response) {
  try {
    const {
      providerId,
      speakerName,
      speakerTitle,
      speakerBio,
      speakerQuote,
      speakerImage,
    } = req.body;

    if (!providerId) {
      return res.status(400).json({
        error: "Provider ID is required",
      });
    }

    // Check if profile already exists
    const { data: existing } = await supabase
      .from("provider_profiles")
      .select("id")
      .eq("provider_id", providerId)
      .single();

    if (existing) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from("provider_profiles")
        .update({
          speaker_name: speakerName || null,
          speaker_title: speakerTitle || null,
          speaker_bio: speakerBio || null,
          speaker_quote: speakerQuote || null,
          speaker_image: speakerImage || null,
          updated_at: new Date().toISOString(),
        })
        .eq("provider_id", providerId);

      if (updateError) {
        console.error("Error updating provider profile:", updateError);
        return res.status(500).json({
          error: "Failed to update provider profile",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Provider profile updated successfully",
      });
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from("provider_profiles")
        .insert([
          {
            provider_id: providerId,
            speaker_name: speakerName || null,
            speaker_title: speakerTitle || null,
            speaker_bio: speakerBio || null,
            speaker_quote: speakerQuote || null,
            speaker_image: speakerImage || null,
          },
        ]);

      if (insertError) {
        console.error("Error creating provider profile:", insertError);
        return res.status(500).json({
          error: "Failed to create provider profile",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Provider profile created successfully",
      });
    }
  } catch (error) {
    console.error("Error in handleSaveProviderProfile:", error);
    return res.status(500).json({
      error: "An error occurred while saving the provider profile",
    });
  }
}

export async function handleGetProviderProfile(req: Request, res: Response) {
  try {
    const { providerId } = req.query;

    if (!providerId) {
      return res.status(400).json({
        error: "Provider ID is required",
      });
    }

    const { data, error } = await supabase
      .from("provider_profiles")
      .select("*")
      .eq("provider_id", providerId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" - that's expected for new providers
      console.error("Error fetching provider profile:", error);
      return res.status(500).json({
        error: "Failed to fetch provider profile",
      });
    }

    return res.status(200).json({
      success: true,
      profile: data || null,
    });
  } catch (error) {
    console.error("Error in handleGetProviderProfile:", error);
    return res.status(500).json({
      error: "An error occurred while fetching the provider profile",
    });
  }
}
