import { site } from "./content";
import { absoluteUrl } from "./site-url";

export type PlanningResource = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  introduction: string;
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    checklist?: string[];
    source?: { label: string; href: string };
  }[];
  worksheet: { title: string; fields: string[] };
  download?: { label: string; href: string };
  schedule?: { time: string; activity: string; note: string }[];
  takeaway: string;
  links: { label: string; href: string }[];
};

/** Editorial planning prompts. Layouts, hours, services, and weather arrangements require confirmation for each event. */
export const planningResources: PlanningResource[] = [
  {
    slug: "small-wedding-layout-checklist",
    title: "Small wedding layout checklist",
    description:
      "Plan a small wedding layout at Happy Trails in Blooming Grove: guest counts, table placement, service routes, ceremony transitions, and a printable worksheet.",
    summary:
      "Turn a guest estimate into a practical layout conversation, with room for the people, the meal, and the moments you want to share.",
    introduction:
      `Happy Trails in Blooming Grove welcomes approximately ${site.guestCapacityEstimate} guests. That estimate starts the discussion; your particular ceremony, meal, and reception need a layout confirmed with Jennifer and Randy. Use this checklist on a tour, then keep the agreed drawing with your event plans.`,
    sections: [
      {
        id: "count-the-people",
        title: "Count everyone who needs a place.",
        paragraphs: [
          "Begin with the people actually attending each part of the day. A ceremony count and a seated-meal count may differ. Record adults, children, and anyone who needs a high chair, extra space, or a specific seating arrangement. Ask how your vendor team should be accounted for when discussing the event setup.",
          "Keep invitations, expected attendance, and confirmed responses in separate columns. Label the layout with the count and revision date so a new RSVP does not silently change an older drawing. Tell the venue which numbers are still estimates before approving furniture placement.",
        ],
      },
      {
        id: "draw-the-activities",
        title: "Draw the activities before the tables.",
        paragraphs: [
          "Make a simple sketch with separate areas for the ceremony, dining, food service, dancing, gifts, and any other activities you actually plan to include. Happy Trails has a renovated 1,800-square-foot barn and a dance floor with lighting. Discuss how your chosen activities work together in the available spaces.",
          "Ask for the dimensions and quantities of the tables and chairs available for your event before drawing them to scale. A photograph can inspire a look, but it cannot confirm how much room that arrangement leaves for your own guest list and vendors.",
        ],
        checklist: [
          "Mark fixed features, entrances, and the locations approved for vendor equipment.",
          "Show chairs as occupied, with space for guests to get up and move.",
          "Identify anything that must be rented or supplied separately.",
        ],
      },
      {
        id: "walk-the-routes",
        title: "Walk through it as a guest and a vendor.",
        paragraphs: [
          "Trace the route from arrival to ceremony seating, refreshments, the meal, and the next activity. Discuss actual paths and surfaces with the venue, particularly for guests with mobility needs. Ask where queues might form and how guests can pass without crossing a serving area or interrupting photographs.",
          "Have your caterer and other vendors review the same sketch. They may need room for equipment, a serving line, or moving supplies. Confirm those requirements with Jennifer and Randy before treating a vendor’s preferred arrangement as an approved venue plan.",
        ],
      },
      {
        id: "plan-the-transitions",
        title: "Decide what changes during the day.",
        paragraphs: [
          "If chairs or tables move between the ceremony and reception, write down who moves them, where guests wait, and how long the change needs. Confirm whether that work is included in any agreement or needs a separate helper. Keep belongings and decorations out of the areas being reset.",
          "Review an alternative layout alongside your outdoor plan. Confirm which spaces can be used, how your guest count fits, and when a decision would need to be made. Before the event, send one final version to everyone setting up; collect late changes with the same point person.",
        ],
      },
    ],
    worksheet: {
      title: "Your layout notes",
      fields: ["Expected ceremony / meal guest counts", "Layout version and date", "Access or seating needs to discuss", "Who confirms the layout and any furniture moves?"],
    },
    takeaway:
      "Leave the tour with a count, a labeled layout, a list of open questions, and a person responsible for confirming each one.",
    links: [
      { label: "Explore the barn and grounds", href: "/venue" },
      { label: "Work through the weather plan", href: "/planning/outdoor-ceremony-weather-plan" },
      { label: "Arrange a layout conversation", href: "/contact" },
    ],
  },
  {
    slug: "wedding-day-timeline",
    title: "Wedding day timeline worksheet",
    description:
      "Build your wedding day timeline with a clearly labeled example, editable time fields, vendor handoffs, and a printable planning worksheet from Happy Trails.",
    summary:
      "Build the day around a few meaningful moments, then give each person enough time to make their part happen.",
    introduction:
      "A useful wedding timeline explains what happens, where it happens, and who starts the next step. The afternoon example below is a planning illustration, not Happy Trails booking hours or an included service. Replace the times after confirming your access period and vendor arrangements.",
    sections: [
      {
        id: "choose-your-anchors",
        title: "Choose the moments that anchor the day.",
        paragraphs: [
          "Start with your preferred ceremony time, then identify the meal, key photographs, and any moments you do not want to rush. Discuss those preferences with your photographer, caterer, and venue before sending invitations. The time that looks right on paper must also work for the people preparing each part.",
          "If photographs depend on natural light, ask your photographer to plan for your particular date and location. Keep their recommendation in the working timeline. Avoid copying another couple’s sunset time or assuming that a sample schedule provides the same light throughout the year.",
        ],
      },
      {
        id: "work-backward",
        title: "Work backward through the preparations.",
        paragraphs: [
          "Ask each provider how long their work needs and when they must begin. Add arrival, unloading, setup, and final checks as separate entries where those are relevant. Confirm venue access before putting a time beside the first delivery or getting-ready appointment.",
          "Happy Trails has a grain-bin bridal suite and a Western-inspired bunkhouse. Discuss when and how your group can use them, then fit preparation appointments and photographs into that confirmed plan. Assign someone to gather personal belongings when the group leaves these spaces so the next moment does not begin with a search for missing items.",
        ],
      },
      {
        id: "name-the-handoffs",
        title: "Give every transition a person.",
        paragraphs: [
          "A timeline entry such as “ceremony begins” leaves several jobs unstated. Decide who gathers the wedding party, who checks that guests are seated, and who gives the musician or audio provider the cue. Record one contact for each handoff so several people do not issue different instructions.",
          "Add breathing room for moving between spaces, greeting guests, and gathering people for photographs. Discuss a simple sequence change if an earlier activity runs late. Keep the agreed meal timing and vendor service periods visible when making that decision.",
        ],
        checklist: [
          "Use one named person to communicate timing changes.",
          "Put the location and responsible person beside each key moment.",
          "Share a guest-facing arrival time separately from the full vendor schedule.",
        ],
      },
      {
        id: "finish-the-day",
        title: "Plan beyond the last dance.",
        paragraphs: [
          "Add guest departure, collecting gifts and belongings, vendor breakdown, and cleanup to the working version. Confirm the relevant deadlines and responsibilities in your arrangements. An advertised business hour does not establish the access period or ending time for your event.",
          "Before the celebration, send a dated final copy to the venue and each provider. Ask them to acknowledge the entries that affect their work. Keep a printed copy with your point person, including day-of contact numbers, so the plan is available without searching through message threads.",
        ],
      },
    ],
    schedule: [
      { time: "2:30 p.m.", activity: "Preparation and detail photographs", note: "Confirm access and photography coverage first." },
      { time: "3:30 p.m.", activity: "Guest arrival", note: "Assign the person who welcomes and directs guests." },
      { time: "4:00 p.m.", activity: "Ceremony", note: "Confirm the location, cues, and expected length." },
      { time: "4:30 p.m.", activity: "Group photographs and guest gathering", note: "Agree on who gathers each photograph group." },
      { time: "5:30 p.m.", activity: "Meal", note: "Set the service timing with your food provider." },
      { time: "6:30 p.m.", activity: "Toasts and dancing", note: "Adapt the order to the moments you want." },
      { time: "To confirm", activity: "Departure, breakdown, and cleanup", note: "Use your agreed event and vendor deadlines." },
    ],
    worksheet: {
      title: "Your timeline anchors",
      fields: ["Event date and confirmed access period", "Ceremony time and location", "Person communicating schedule changes", "Departure / breakdown / cleanup deadlines"],
    },
    download: { label: "Download the event timeline spreadsheet (CSV)", href: "/downloads/planning/event-timeline.csv" },
    takeaway:
      "The useful version is the one your venue, vendors, and helpers have all reviewed for their own responsibilities.",
    links: [
      { label: "Coordinate the vendor handoffs", href: "/planning/vendor-coordination-checklist" },
      { label: "Share the guest arrival guide", href: "/guest-guide" },
      { label: "Discuss your wedding plans", href: "/contact" },
    ],
  },
  {
    slug: "outdoor-ceremony-weather-plan",
    title: "Outdoor ceremony weather planning checklist",
    description:
      "Questions for an outdoor wedding weather plan: confirm alternate layouts, decision timing, vendor responsibilities, guest updates, and appropriate shelter arrangements.",
    summary:
      "Give your outdoor ceremony a written weather plan that everyone can understand before decisions need to be made.",
    introduction:
      "Happy Trails has outdoor ceremony possibilities, covered outdoor seating, and a renovated barn in Blooming Grove. Discuss the suitability and availability of each space for your particular event. This checklist helps organize that conversation; it does not confirm an alternative layout or a severe-weather shelter.",
    sections: [
      {
        id: "confirm-the-alternative",
        title: "Confirm what the alternative actually looks like.",
        paragraphs: [
          "Walk through your preferred ceremony arrangement and the alternative you would use if conditions change. Ask where the guests, wedding party, officiant, and equipment would go. Confirm the arrangement for your expected guest count, including any access or seating needs.",
          "Find out whether the alternative changes the reception setup or requires moving furniture. Write down what is available, what still needs approval, and whether any extra labor or equipment has a separate cost. A roof or a photograph of an indoor setup does not establish the arrangements for your date.",
        ],
      },
      {
        id: "separate-safety-from-setup",
        title: "Discuss safety as its own part of the plan.",
        paragraphs: [
          "Ask the venue what the event’s severe-weather procedures would be, where people should go, and how everyone would be directed there. Include guests who may need help moving between areas. Do not assume that the ceremony backup location also serves every emergency need.",
          "The National Weather Service advises planning ahead for lightning and identifies open-sided picnic shelters and tents as unsafe lightning shelter. Ask specifically about appropriate shelter rather than treating covered outdoor seating as confirmation. Use official forecasts and alerts for the event location, and follow venue and local emergency instructions.",
        ],
        source: {
          label: "National Weather Service: outdoor lightning safety",
          href: "https://www.weather.gov/safety/lightning-outdoors",
        },
      },
      {
        id: "set-the-decision-process",
        title: "Agree on who decides and when.",
        paragraphs: [
          "Ask when the venue and vendors need a decision to prepare the alternate setup. Record the person authorized to confirm it and how that decision reaches the rest of the team. Keep an earlier planning check and an event-day update on the timeline if those are useful to the people doing the work.",
          "A setup deadline is an organizational step, not a prediction that the weather will remain unchanged. Ask how changing conditions would be handled later and who monitors official updates. Confirm the steps for pausing, changing, or ending an outdoor activity with the venue rather than inventing your own thresholds.",
        ],
        source: { label: "Check forecasts and alerts at the National Weather Service", href: "https://www.weather.gov/" },
      },
      {
        id: "brief-the-team",
        title: "Give guests and vendors useful instructions.",
        paragraphs: [
          "Have each vendor explain how a location change affects their equipment, setup time, and work. Check sound, photography, flowers, and any food service against the alternate arrangement. Identify who moves approved items and who keeps guests informed while the team works.",
          "Prepare a short guest message with the confirmed arrival instructions and your organizer’s contact. Decide who sends it and where a late update will appear. After a change is agreed, issue one revised plan so helpers do not continue following different versions.",
        ],
        checklist: [
          "Confirm the preferred layout and the approved alternative.",
          "Record decision contacts, setup deadlines, and communication steps.",
          "Discuss suitable shelter and guest assistance directly with the venue.",
        ],
      },
    ],
    worksheet: {
      title: "Your weather conversation notes",
      fields: ["Alternative arrangement to confirm", "Decision contact and setup deadline", "Shelter / guest assistance questions for the venue", "Who updates guests and vendors?"],
    },
    takeaway:
      "A complete conversation covers the setup, the decision process, guest communication, and safety arrangements as distinct questions.",
    links: [
      { label: "Review the small wedding layout checklist", href: "/planning/small-wedding-layout-checklist" },
      { label: "Build the day’s working timeline", href: "/planning/wedding-day-timeline" },
      { label: "Talk through weather arrangements", href: "/contact" },
    ],
  },
  {
    slug: "vendor-coordination-checklist",
    title: "Wedding vendor coordination checklist",
    description:
      "Keep wedding vendors working from one plan: written scope, venue requirements, delivery details, setup handoffs, contact lists, and a printable coordination worksheet.",
    summary:
      "Turn separate vendor conversations into one clear plan for arrivals, responsibilities, equipment, and the end of the celebration.",
    introduction:
      "Jennifer and Randy can help locate local vendors depending on your event’s needs. Once you are discussing services, use this checklist to coordinate the work across providers. Confirm each arrangement directly; a referral or a listed venue amenity does not establish what a vendor quote includes.",
    sections: [
      {
        id: "write-one-event-brief",
        title: "Start with one shared event brief.",
        paragraphs: [
          `Put the date, guest estimate, event outline, and venue address at the top of the brief: ${site.fullAddress}. Link to the guest arrival guide for the confirmed map pin. Add your main organizer and a separate day-of contact if someone else will handle practical questions during the celebration.`,
          "Describe the parts of the event that each vendor will cover. Include the latest layout and a timeline marked as draft or confirmed. Ask providers to identify assumptions early, especially where their work depends on another business arriving, supplying equipment, or finishing a previous task.",
        ],
      },
      {
        id: "confirm-the-scope",
        title: "Put responsibilities beside every item.",
        paragraphs: [
          "Request a written description of the service, delivery, setup, staffing, collection, and cleanup that each quote covers. Where an item is shared between providers, name the person supplying it and the person installing or moving it. Avoid leaving an item labeled only “venue” or “caterer” until that provider has confirmed it.",
          "Happy Trails lists tables, chairs, linens, a bar, Wi-Fi, and other amenities. Confirm the items and quantities included in your particular arrangement, then reconcile that list with vendor equipment. Ask about outstanding charges and change deadlines directly before finalizing the combined plan.",
        ],
        checklist: [
          "For each item, record the provider, quantity, placement, and responsible contact.",
          "Mark unresolved details visibly instead of assuming they are included.",
          "Keep the written quote or agreement beside the coordination notes.",
        ],
      },
      {
        id: "resolve-practical-needs",
        title: "Review needs with the venue before arrival.",
        paragraphs: [
          "Ask every provider what they need for unloading, vehicle access, electrical supply, food preparation, sound, storage, and waste removal. Share the actual requirements with Jennifer and Randy. The presence of a bar or an outlet does not answer questions about a particular vendor’s equipment or service plan.",
          "Confirm the permitted arrival and collection windows before scheduling deliveries. Check whether two providers need the same route or setup area at the same time. If furniture moves during the event, confirm who handles the move, when it happens, and where the affected guests or equipment will go.",
        ],
      },
      {
        id: "issue-the-final-brief",
        title: "Close the loop with a dated final copy.",
        paragraphs: [
          "Create one contact list with each business, its day-of representative, a phone number, arrival time, and the work they own. Include venue-approved logistics and the weather decision process. Share private contact details only with the people coordinating the event, not on a public invitation page.",
          "Ask each provider to acknowledge the details affecting their work. Collect corrections through the main organizer and issue a revised copy if anything changes. Finish with collection and cleanup responsibilities, including who takes gifts, personal belongings, decorations, and any rented items at the agreed time.",
        ],
      },
    ],
    worksheet: {
      title: "Your coordination notes",
      fields: ["Main organizer and day-of contact", "Vendor requirement awaiting venue confirmation", "Delivery / setup / collection windows", "Who sends the final brief and collects acknowledgments?"],
    },
    download: { label: "Download the vendor contact spreadsheet (CSV)", href: "/downloads/planning/vendor-contacts.csv" },
    takeaway:
      "Every task should have a named owner, a confirmed time, and a shared understanding of what the other providers need.",
    links: [
      { label: "Ask about local vendor help", href: "/vendors" },
      { label: "Use the wedding timeline worksheet", href: "/planning/wedding-day-timeline" },
      { label: "Send the guest arrival guide", href: "/guest-guide" },
    ],
  },
];

export function getPlanningResource(slug: string) {
  return planningResources.find((resource) => resource.slug === slug);
}

export function getPlanningResourceStructuredData(resource: PlanningResource) {
  const url = absoluteUrl(`/planning/${resource.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: resource.title,
        description: resource.description,
        inLanguage: "en-US",
        isPartOf: { "@id": absoluteUrl("/#website") },
        about: { "@id": absoluteUrl("/#venue") },
        mainEntity: { "@id": `${url}#article` },
        breadcrumb: { "@id": `${url}#breadcrumbs` },
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        url,
        headline: resource.title,
        description: resource.description,
        inLanguage: "en-US",
        mainEntityOfPage: { "@id": `${url}#webpage` },
        author: { "@id": absoluteUrl("/#venue") },
        publisher: { "@id": absoluteUrl("/#venue") },
        articleSection: "Wedding and event planning",
        articleBody: [
          resource.summary,
          resource.introduction,
          ...resource.sections.flatMap((section) => [section.title, ...section.paragraphs, ...(section.checklist ?? [])]),
          ...(resource.schedule ? ["Illustrative afternoon timeline. Example times are not venue booking hours.", ...resource.schedule.map((row) => `${row.time}: ${row.activity}. ${row.note}`)] : []),
          resource.takeaway,
        ].join("\n\n"),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Planning Guide", item: absoluteUrl("/planning") },
          { "@type": "ListItem", position: 3, name: resource.title, item: url },
        ],
      },
    ],
  };
}
