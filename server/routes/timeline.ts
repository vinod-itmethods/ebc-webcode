import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  status: "completed" | "pending" | "upcoming";
  event_type: "submission" | "update" | "scheduled" | "email";
  event_order: number;
}

// Get timeline events for a customer
export async function handleGetTimelineEvents(req: Request, res: Response) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Customer email is required" });
  }

  try {
    const { data, error } = await supabase
      .from("briefing_timeline_events")
      .select("*")
      .eq("customer_email", email)
      .order("event_order", { ascending: true });

    if (error) {
      console.error("Error fetching timeline events:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch timeline events" });
    }

    // Format dates
    const formattedEvents = (data || []).map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: new Date(event.event_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status: event.status,
      type: event.event_type,
    }));

    return res.status(200).json({ events: formattedEvents });
  } catch (error) {
    console.error("Error in handleGetTimelineEvents:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Add a timeline event (admin only)
export async function handleAddTimelineEvent(req: Request, res: Response) {
  const { customerEmail, title, description, eventDate, status, eventType } =
    req.body;
  const adminEmail = req.headers["x-admin-email"] as string;

  // Verify admin access
  if (!adminEmail || !adminEmail.endsWith("@itmethods.com")) {
    return res.status(403).json({ error: "Admin access required" });
  }

  if (!customerEmail || !title || !eventDate || !status || !eventType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Get the next event order number
    const { data: lastEvent } = await supabase
      .from("briefing_timeline_events")
      .select("event_order")
      .eq("customer_email", customerEmail)
      .order("event_order", { ascending: false })
      .limit(1);

    const nextOrder = lastEvent && lastEvent.length > 0 ? lastEvent[0].event_order + 1 : 1;

    const { data, error } = await supabase
      .from("briefing_timeline_events")
      .insert({
        customer_email: customerEmail,
        title,
        description,
        event_date: eventDate,
        status,
        event_type: eventType,
        event_order: nextOrder,
        created_by: adminEmail,
      })
      .select();

    if (error) {
      console.error("Error adding timeline event:", error);
      return res.status(500).json({ error: "Failed to add timeline event" });
    }

    return res.status(201).json({ event: data?.[0] });
  } catch (error) {
    console.error("Error in handleAddTimelineEvent:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Update a timeline event (admin only)
export async function handleUpdateTimelineEvent(req: Request, res: Response) {
  const { id, title, description, eventDate, status, eventType } = req.body;
  const adminEmail = req.headers["x-admin-email"] as string;

  // Verify admin access
  if (!adminEmail || !adminEmail.endsWith("@itmethods.com")) {
    return res.status(403).json({ error: "Admin access required" });
  }

  if (!id) {
    return res.status(400).json({ error: "Event ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("briefing_timeline_events")
      .update({
        title,
        description,
        event_date: eventDate,
        status,
        event_type: eventType,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating timeline event:", error);
      return res.status(500).json({ error: "Failed to update timeline event" });
    }

    return res.status(200).json({ event: data?.[0] });
  } catch (error) {
    console.error("Error in handleUpdateTimelineEvent:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Delete a timeline event (admin only)
export async function handleDeleteTimelineEvent(req: Request, res: Response) {
  const { id } = req.body;
  const adminEmail = req.headers["x-admin-email"] as string;

  // Verify admin access
  if (!adminEmail || !adminEmail.endsWith("@itmethods.com")) {
    return res.status(403).json({ error: "Admin access required" });
  }

  if (!id) {
    return res.status(400).json({ error: "Event ID is required" });
  }

  try {
    const { error } = await supabase
      .from("briefing_timeline_events")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting timeline event:", error);
      return res.status(500).json({ error: "Failed to delete timeline event" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in handleDeleteTimelineEvent:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
