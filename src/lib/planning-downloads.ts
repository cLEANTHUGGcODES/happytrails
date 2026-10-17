import { site } from "./content";

export const planningDownloads = [
  {
    slug: "wedding-budget.csv",
    title: "Wedding budget worksheet",
    description: "Compare written quotes, included services, deposits, and due dates without guessing package prices.",
    headers: ["Category", "Provider", "What the quote includes", "Quoted total", "Deposit", "Balance", "Payment due", "Questions to confirm"],
    rows: [
      ["Venue", site.name, "", "", "", "", "", "Weddings start at $3,000; request a quote for your date and plans."],
      ...["Catering", "Beverages", "Photography", "Music", "Flowers and decor", "Attire", "Transport", "Other"].map((category) => [category, "", "", "", "", "", "", ""]),
    ],
  },
  {
    slug: "vendor-contacts.csv",
    title: "Vendor contact & arrival sheet",
    description: "Give your planning team one place for day-of contacts, arrival windows, equipment needs, and outstanding questions.",
    headers: ["Role", "Business", "Day-of contact", "Phone", "Email", "Arrival agreed with venue", "Equipment or access needs", "Outstanding questions"],
    rows: [
      ["Venue", site.name, "Confirm your day-of contact", site.phone, site.email, "Confirm with the venue", "", ""],
      ...["Event organizer", "Caterer", "Photographer", "Music", "Florist", "Rentals", "Transport"].map((role) => [role, "", "", "", "", "", "", ""]),
    ],
  },
  {
    slug: "event-timeline.csv",
    title: "Event timeline worksheet",
    description: "Build a shared running order with an owner, location, and weather alternative for each part of your day.",
    headers: ["Time to confirm", "Activity", "Location to confirm", "Responsible person", "People to notify", "Weather alternative", "Notes"],
    rows: ["Venue access", "Vendor setup", "Getting ready", "Guest arrival", "Ceremony or welcome", "Photographs", "Meal", "Speeches", "Dancing or activities", "Guest departure", "Cleanup", "Final handover"].map((activity) => ["", activity, "", "", "", "", ""]),
  },
] as const;

export function makePlanningCsv(slug: string): string | undefined {
  const worksheet = planningDownloads.find((entry) => entry.slug === slug);
  if (!worksheet) return undefined;
  const rows = [
    [worksheet.title],
    ["Planning template only. Confirm all access times, services, prices, and arrangements with your providers."],
    ["Venue reference", `${site.url}/planning`, site.fullAddress],
    worksheet.headers,
    ...worksheet.rows,
  ];
  return "\ufeff" + rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\r\n") + "\r\n";
}
