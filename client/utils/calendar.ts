export interface CalendarEvent {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
}

export function generateICS(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const now = new Date();
  const uid = `${now.getTime()}@itmethods.com`;
  const dtstamp = formatDate(now);
  const dtstart = formatDate(event.startDate);
  const dtend = event.endDate ? formatDate(event.endDate) : formatDate(new Date(event.startDate.getTime() + 60 * 60 * 1000));

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Executive Briefing Council//itmethods.com//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}T000000Z
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}
LOCATION:${event.location || ""}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  return ics;
}

export function downloadICS(event: CalendarEvent): void {
  const ics = generateICS(event);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getOutlookLink(event: CalendarEvent): string {
  const startDate = event.startDate.toISOString().split("T")[0].replace(/-/g, "");
  const endDate = (event.endDate || new Date(event.startDate.getTime() + 60 * 60 * 1000))
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");
  
  const params = new URLSearchParams({
    subject: event.title,
    startdt: startDate,
    enddt: endDate,
    body: event.description || "",
    location: event.location || "",
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
