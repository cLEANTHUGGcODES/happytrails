import { site } from "./content";

/** Practical planning prompts, kept separate from the venue's confirmed amenities and terms. */
export const planningGuides = [
  {
    id: "tour-checklist",
    label: "Your venue tour",
    title: "Come with a few good questions.",
    intro:
      "A tour is your chance to connect the photographs with your own plans. Bring a short list of priorities so the conversation covers what matters to your celebration.",
    steps: [
      {
        title: "Bring your starting point",
        copy: "Note your occasion, preferred dates, estimated guest count, and the parts of the day you want to host here. A few reference photographs can help explain your ideas.",
      },
      {
        title: "Walk through your day",
        copy: "Look at the barn, outdoor setting, covered seating, and getting-ready spaces. Talk through where guests would arrive, gather, eat, and celebrate.",
      },
      {
        title: "Discuss the practical details",
        copy: "Ask about the layout for your guest count, weather alternatives, access needs, setup and cleanup times, and what your quoted rental would include.",
      },
      {
        title: "Write down the next step",
        copy: "Keep a list of what was discussed, what still needs confirmation, and which details you need before deciding. Request a quote for the plans you actually discussed.",
      },
    ],
    takeaway: "Bring your preferred dates, a guest estimate, and your three biggest priorities.",
    link: { href: "/contact", label: "Arrange a venue tour" },
  },
  {
    id: "guest-planning",
    label: "Your guest list",
    title: "Plan around the people coming.",
    intro: `Happy Trails welcomes approximately ${site.guestCapacityEstimate} guests. Use that estimate to start a conversation about your particular gathering and layout, rather than treating it as a confirmed seating plan.`,
    steps: [
      {
        title: "Make one working guest list",
        copy: "Separate confirmed guests from possible guests and note children or other people who may need a seat or meal. Ask how your vendors and event team fit into the plan.",
      },
      {
        title: "Explain how the spaces will be used",
        copy: "Tell Jennifer and Randy whether you are imagining a seated meal, a ceremony followed by a reception, or a gathering with people moving between spaces.",
      },
      {
        title: "Leave room for the whole occasion",
        copy: "Include the dance floor, food service, gifts, and any activities when discussing a layout. Confirm table and chair quantities and placement for your event.",
      },
      {
        title: "Raise individual needs early",
        copy: "Mention mobility, seating, or other access needs when arranging a visit so you can discuss the actual routes and spaces together.",
      },
    ],
    takeaway: "Share a guest estimate and the kind of gathering you want, then confirm a suitable layout.",
    link: { href: "/venue", label: "Explore the venue spaces" },
  },
  {
    id: "getting-ready",
    label: "Getting ready",
    title: "Give the morning a little breathing room.",
    intro:
      "The grain-bin bridal suite and Western-inspired bunkhouse are each approximately 400 square feet, with air conditioning and a bathroom. Plan how your group will use these preparation spaces before the day arrives.",
    steps: [
      {
        title: "Build a shared timetable",
        copy: "List who needs to get ready, any hair or makeup appointments, and your photography plans. Confirm when the spaces can be accessed before setting arrival times.",
      },
      {
        title: "Make a simple packing plan",
        copy: "Assign someone to bring outfits, personal supplies, and the items needed for photographs. Plan where belongings will go when everyone moves on to the celebration.",
      },
      {
        title: "Walk the transitions",
        copy: "During your tour, discuss how your group will move between the suite, bunkhouse, ceremony setting, and barn. Check the arrangements against your group’s access needs.",
      },
    ],
    takeaway: "Agree on access times, a getting-ready schedule, and someone to look after belongings.",
    link: { href: "/venue#getting-ready", label: "See the bridal suite and bunkhouse" },
  },
  {
    id: "vendor-brief",
    label: "Briefing vendors",
    title: "Give everyone the same picture.",
    intro:
      "Jennifer and Randy can help you locate local vendors depending on your event’s needs. A clear brief makes it easier to explain the celebration and compare the help you are considering.",
    steps: [
      {
        title: "Start with the essentials",
        copy: `Share the occasion, preferred date, guest estimate, and venue address: ${site.fullAddress}. Include the website so the vendor can see the spaces.`,
      },
      {
        title: "Describe the job",
        copy: "Explain the service you need, the parts of the day it covers, your priorities, and your budget for that service. Ask for an itemized description of the work and charges.",
      },
      {
        title: "Check what the service needs",
        copy: "Ask vendors about equipment, electrical supply, food preparation, delivery access, and setup time. Review those needs with the venue before finalizing arrangements.",
      },
      {
        title: "Keep a shared contact list",
        copy: "Record each business, the contact for the day, agreed arrival times, and outstanding questions. Confirm venue requirements for any catering or bar plans directly.",
      },
    ],
    takeaway: "Send one consistent brief, then confirm each vendor’s practical needs with the venue.",
    link: { href: "/vendors", label: "Ask about local vendor help" },
  },
  {
    id: "wedding-budget",
    label: "Wedding budget",
    title: "Understand the quote, line by line.",
    intro:
      "Weddings at Happy Trails start at $3,000. Build your budget from a quote for your date and plans, with the venue rental and any other services clearly identified.",
    steps: [
      {
        title: "Ask what the venue quote covers",
        copy: "Confirm the spaces, access period, and any furniture, linens, equipment, setup, or cleanup included in the quoted price. An amenity listed on the website is a starting point for that discussion.",
      },
      {
        title: "List the other services you want",
        copy: "Add your own categories for food, beverages, photography, music, flowers, attire, and transport. Mark who will provide each service and whether you have a written quote.",
      },
      {
        title: "Check the total and the terms",
        copy: "Ask each provider about taxes, additional charges, payment dates, and the written terms for changes or cancellation. Keep unanswered items visible rather than assigning guessed prices.",
      },
      {
        title: "Compare the same plans",
        copy: "When comparing options, use the same date, guest estimate, rental duration, and services. Update your budget when any of those details change.",
      },
    ],
    takeaway: "Keep a written quote, a list of separate services, and a payment calendar together.",
    link: { href: "/pricing", label: "View starting prices and FAQs" },
  },
  {
    id: "family-gatherings",
    label: "Family gatherings",
    title: "Make the plan fit your people.",
    intro:
      "Happy Trails also welcomes birthdays, family reunions, and other gatherings. Pricing for these occasions is based on your plans, so begin with the people coming and the time you want to spend together.",
    steps: [
      {
        title: "Choose a point person",
        copy: "Have one person collect the guest estimate, preferred dates, and ideas, then bring them to the venue conversation. Share the decisions with everyone helping organize.",
      },
      {
        title: "Choose the moments that matter",
        copy: "Sketch a simple order for arrivals, a meal or refreshments, speeches, photographs, and any activities. Discuss where each part could happen and what it would need.",
      },
      {
        title: "Plan for your mix of guests",
        copy: "Bring up children’s activities, supervision, seating, and mobility needs while discussing the spaces. Check the arrangements before sending the final invitation.",
      },
      {
        title: "Send useful arrival details",
        copy: "Share the confirmed event time, full venue address, and the website’s map link with guests. Give them an organizer’s contact for questions about your particular gathering.",
      },
    ],
    takeaway: "Start with your occasion, guest estimate, preferred date, and a simple outline of the day.",
    link: { href: "/contact", label: "Tell us about your gathering" },
  },
] as const;

export const visitorResources = [
  {
    title: "Places to stay",
    description: "Browse Visit Corsicana’s accommodation information for guests planning an overnight trip.",
    href: "https://visitcorsicana.com/places-to-stay/",
    source: "Visit Corsicana",
  },
  {
    title: "Places to eat",
    description: "Explore the visitor bureau’s restaurant directory for plans before or after your celebration.",
    href: "https://visitcorsicana.com/restaurants/",
    source: "Visit Corsicana",
  },
  {
    title: "Road conditions",
    description: "Check current Texas road closures, construction, and travel conditions before setting off.",
    href: "https://drivetexas.org/",
    source: "Texas Department of Transportation",
  },
] as const;
