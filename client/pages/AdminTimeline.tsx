import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface TimelineEvent {
  id: string;
  customer_email: string;
  event_order: number;
  title: string;
  description?: string;
  event_date: string;
  status: "completed" | "pending" | "upcoming";
  event_type: "submission" | "update" | "scheduled" | "email";
}

interface Customer {
  email: string;
  name: string;
  company: string;
}

export default function AdminTimeline() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    status: "pending" as const,
    event_type: "update" as const,
  });
  const [loading, setLoading] = useState(false);

  // Fetch all customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/admin/customers");
        if (response.ok) {
          const data = await response.json();
          setCustomers(data.customers || []);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch timeline events for selected customer
  useEffect(() => {
    if (selectedCustomer) {
      fetchTimelineEvents();
    }
  }, [selectedCustomer]);

  const fetchTimelineEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/timeline-events?email=${encodeURIComponent(selectedCustomer)}`,
      );
      if (response.ok) {
        const data = await response.json();
        setTimelineEvents(data.events || []);
      }
    } catch (error) {
      console.error("Error fetching timeline events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      event_date: "",
      status: "pending",
      event_type: "update",
    });
    setShowForm(true);
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: event.event_date,
      status: event.status,
      event_type: event.event_type,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.event_date) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const adminEmail =
        localStorage.getItem("userEmail") || "admin@itmethods.com";

      if (editingEvent) {
        // Update existing event
        const response = await fetch("/api/admin/timeline-events/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-email": adminEmail,
          },
          body: JSON.stringify({
            id: editingEvent.id,
            title: formData.title,
            description: formData.description,
            eventDate: formData.event_date,
            status: formData.status,
            eventType: formData.event_type,
          }),
        });

        if (response.ok) {
          alert("Event updated successfully");
          setShowForm(false);
          fetchTimelineEvents();
        } else {
          const error = await response.json();
          alert(error.error || "Failed to update event");
        }
      } else {
        // Add new event
        const response = await fetch("/api/admin/timeline-events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-email": adminEmail,
          },
          body: JSON.stringify({
            customerEmail: selectedCustomer,
            title: formData.title,
            description: formData.description,
            eventDate: formData.event_date,
            status: formData.status,
            eventType: formData.event_type,
          }),
        });

        if (response.ok) {
          alert("Event added successfully");
          setShowForm(false);
          fetchTimelineEvents();
        } else {
          const error = await response.json();
          alert(error.error || "Failed to add event");
        }
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert("An error occurred while saving the event");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const adminEmail =
        localStorage.getItem("userEmail") || "admin@itmethods.com";

      const response = await fetch("/api/admin/timeline-events/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({ id: eventId }),
      });

      if (response.ok) {
        alert("Event deleted successfully");
        fetchTimelineEvents();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Manage Customer Timelines
          </h1>
          <p className="text-slate-600">
            Create and manage briefing timeline events for customers
          </p>
        </div>

        {/* Customer Selection */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Customer
          </label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a customer --</option>
            {customers.map((customer) => (
              <option key={customer.email} value={customer.email}>
                {customer.name} ({customer.company}) - {customer.email}
              </option>
            ))}
          </select>
        </div>

        {/* Timeline Events Section */}
        {selectedCustomer && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Timeline Events
              </h2>
              <Button
                onClick={handleAddEvent}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </div>

            {loading ? (
              <p className="text-slate-600">Loading timeline events...</p>
            ) : timelineEvents.length === 0 ? (
              <p className="text-slate-600">
                No timeline events yet. Click "Add Event" to create one.
              </p>
            ) : (
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="inline-block bg-slate-100 text-slate-700 text-sm font-medium px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {event.title}
                          </h3>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              event.status === "completed"
                                ? "bg-green-50 text-green-700"
                                : event.status === "upcoming"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">
                          Date: {event.event_date}
                        </p>
                        <p className="text-sm text-slate-600 mb-2">
                          Type: {event.event_type}
                        </p>
                        {event.description && (
                          <p className="text-sm text-slate-700 mb-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleEditEvent(event)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteEvent(event.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Form Modal */}
        {showForm && selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingEvent ? "Edit Timeline Event" : "Add Timeline Event"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Briefing Itinerary Added"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional description of the event"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as
                          | "completed"
                          | "pending"
                          | "upcoming",
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={formData.event_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        event_type: e.target.value as
                          | "submission"
                          | "update"
                          | "scheduled"
                          | "email",
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="submission">Submission</option>
                    <option value="email">Email</option>
                    <option value="update">Update</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    {editingEvent ? "Update Event" : "Add Event"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
