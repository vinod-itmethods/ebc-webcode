import { Calendar, CheckCircle2, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
  status: "completed" | "pending" | "upcoming";
  type?: "submission" | "update" | "scheduled" | "email";
}

interface BriefingTimelineProps {
  events: TimelineEvent[];
  onAddToCalendar?: (date: string) => void;
}

export default function BriefingTimeline({ events, onAddToCalendar }: BriefingTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "upcoming":
        return "text-blue-600";
      default:
        return "text-amber-600";
    }
  };

  const getStatusIcon = (status: string, type?: string) => {
    if (status === "completed") {
      return <CheckCircle2 className={`w-6 h-6 ${getStatusColor(status)}`} />;
    }
    if (type === "email") {
      return <Mail className={`w-6 h-6 ${getStatusColor(status)}`} />;
    }
    if (status === "upcoming") {
      return <Calendar className={`w-6 h-6 ${getStatusColor(status)}`} />;
    }
    return <Clock className={`w-6 h-6 ${getStatusColor(status)}`} />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Timeline & Updates</h3>
        <p className="text-foreground/70">Track the status of your briefing request</p>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="relative">
            {/* Timeline line */}
            {index < events.length - 1 && (
              <div className="absolute left-3 top-12 w-0.5 h-12 bg-slate-200"></div>
            )}

            {/* Event Card */}
            <div className="flex gap-4">
              {/* Icon */}
              <div className="relative z-10 mt-1 flex-shrink-0">
                <div className={`w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center ${
                  event.status === 'completed' ? 'border-green-600' : event.status === 'upcoming' ? 'border-blue-600' : 'border-amber-600'
                }`}>
                  {getStatusIcon(event.status, event.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="bg-white rounded-lg border border-border/10 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-semibold text-foreground ${getStatusColor(event.status)}`}>
                      {event.title}
                    </h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      event.status === 'completed' ? 'bg-green-50 text-green-700' :
                      event.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {event.status === 'completed' ? 'Completed' : event.status === 'upcoming' ? 'Upcoming' : 'Pending'}
                    </span>
                  </div>

                  <p className="text-sm text-foreground/70 mb-2">{event.date}</p>

                  {event.description && (
                    <p className="text-sm text-foreground/80 mb-3">{event.description}</p>
                  )}

                  {/* Add to Calendar for scheduled events */}
                  {event.status === 'upcoming' && event.type === 'scheduled' && onAddToCalendar && (
                    <Button
                      onClick={() => onAddToCalendar(event.date)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Add to calendar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
