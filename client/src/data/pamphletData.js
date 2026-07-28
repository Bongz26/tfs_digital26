// Thusanang Funeral Services - Data Model for Digital Pamphlet

export const PLANS_DATA = [
  {
    id: "budget-buster",
    name: "Budget Buster",
    tagline: "Affordable dignity for every family",
    badge: "Most Affordable",
    waitingPeriod: "3 Months Waiting Period",
    casket: "Flatlid Coffin",
    chairs: "50 Chairs",
    programmes: "50 Programmes",
    tentToilet: "Tent, Table & Toilet",
    airtime: "R100",
    storage: "100km Storage & Collection",
    cashPayout: null,
    fleet: "Full Fleet Provided",
    graveyardSetup: true,
    pricing: {
      "18-64": { single: 25, family: 35, m6: 45, m10: 60 },
      "65-74": { single: 35, family: 45, m6: 50, m10: 65 },
      "75-84": { single: 45, family: 55, m6: 65, m10: 70 },
      "85-100": { single: 90, family: 100, m6: 117, m10: 126 }
    },
    valueAdds: [
      "Flatlid Coffin",
      "Full Fleet Provided",
      "Graveyard Setup",
      "Tent, Table & Toilet",
      "50 Chairs",
      "50 Programmes",
      "Airtime / Data / Electricity - R100",
      "Storage & Collection 100km"
    ]
  },
  {
    id: "executive",
    name: "Executive",
    tagline: "Premium care with added peace of mind",
    badge: "Popular",
    waitingPeriod: "6 Months Waiting Period",
    casket: "Pongee Casket (Walnut)",
    chairs: "80 Chairs",
    programmes: "80 Programmes",
    tentToilet: "Tent, Table & Toilet",
    airtime: "R200",
    storage: "100km Storage & Collection",
    cashPayout: "R5,000 Cash Payout",
    fleet: "Full Fleet Provided",
    graveyardSetup: true,
    repatriation: "Free Repatriation* (Single & Family Main Member)",
    mokotiDipere: true,
    graveMarker: true,
    pricing: {
      "18-64": { single: 35, family: 45, m6: 90, m10: 120 },
      "65-74": { single: 45, family: 55, m6: 95, m10: 130 },
      "75-84": { single: 55, family: 65, m6: 110, m10: 140 },
      "85-100": { single: 100, family: 110, m6: 165, m10: 210 }
    },
    valueAdds: [
      "Pongee Casket (Walnut)",
      "Full Fleet Provided & Graveyard Setup",
      "Tent, Table & Toilet",
      "80 Chairs & 80 Programmes",
      "Grave Marker",
      "Airtime / Data / Electricity - R200",
      "Mokoti / Dipere",
      "Storage & Collection 100km",
      "Free Repatriation* (Single & Family Main Member)"
    ]
  },
  {
    id: "royal",
    name: "Royal",
    tagline: "A regal farewell befitting royalty",
    badge: "Best Value",
    waitingPeriod: "6 Months Waiting Period",
    casket: "Raised ½ View (Walnut)",
    chairs: "100 Chairs",
    programmes: "100 Programmes",
    tentToilet: "Tent, Table & Toilet",
    airtime: "R200",
    storage: "100km Storage & Collection",
    cashPayout: "R6,000 Cash Payout",
    fleet: "Full Fleet Provided",
    graveyardSetup: true,
    groceryFreshFlower: true,
    repatriation: "Free Repatriation*",
    mokotiDipere: true,
    graveMarker: true,
    pricing: {
      "18-64": { single: 40, family: 50, m6: 95, m10: 125 },
      "65-74": { single: 50, family: 60, m6: 100, m10: 135 },
      "75-84": { single: 60, family: 70, m6: 115, m10: 145 },
      "85-100": { single: 105, family: 115, m6: 173, m10: 218 }
    },
    valueAdds: [
      "Raised Halfview Casket (Walnut)",
      "Full Fleet Provided & Graveyard Setup",
      "Tent, Table & Toilet",
      "100 Chairs & 100 Programmes",
      "Grocery & Fresh Flower",
      "Grave Marker",
      "Airtime / Data / Electricity - R200",
      "Mokoti / Dipere",
      "Storage & Collection 100km",
      "Free Repatriation*"
    ]
  },
  {
    id: "presidential",
    name: "Presidential",
    tagline: "The ultimate tribute for a distinguished farewell",
    badge: "Premium VIP",
    waitingPeriod: "6 Months Waiting Period",
    casket: "4 Tier Casket (Mountain Ash)",
    chairs: "100 Chairs",
    programmes: "100 VIP Programmes",
    tentToilet: "Tent, 2 Tables, VIP Toilet",
    airtime: "R200",
    storage: "100km Storage & Collection",
    cashPayout: "R10,000 Cash Payout",
    fleet: "Full Fleet Provided",
    graveyardSetup: true,
    groceryFreshFlower: true,
    repatriation: "Free Repatriation*",
    mokotiDipere: true,
    graveMarker: true,
    pricing: {
      "18-64": { single: 45, family: 73, m6: 100, m10: 130 },
      "65-74": { single: 60, family: 80, m6: 115, m10: 140 },
      "75-84": null,
      "85-100": null
    },
    valueAdds: [
      "4 Tier Casket (Mountain Ash)",
      "Full Fleet Provided & Graveyard Setup",
      "Tent, 2 Tables, VIP Toilet",
      "100 Chairs & 100 VIP Programmes",
      "Grocery & Fresh Flower",
      "Grave Marker",
      "Airtime / Data / Electricity - R200",
      "Mokoti / Dipere",
      "Storage & Collection 100km",
      "Free Repatriation*"
    ]
  },
  {
    id: "one-stop",
    name: "One-Stop All-Inclusive",
    tagline: "Everything handled - nothing left to chance",
    badge: "All-Inclusive Elite",
    waitingPeriod: "9 Months Waiting Period",
    casket: "Princeton Dome Casket",
    chairs: "100 Chairs",
    programmes: "150 VIP Programmes",
    tentToilet: "Tent, 2 Tables, 1 VIP Toilet",
    airtime: "R200",
    storage: "100km Storage & Collection",
    cashPayout: "R15,000 Cash Payout",
    fleet: "Full Fleet Provided",
    graveyardSetup: true,
    catering: "Full Catering Service included (replaces Grocery)",
    tombstoneIncluded: "Tombstone (Headstone) included (in place of Grave Marker)",
    freshFlower: true,
    repatriation: "Free Repatriation*",
    mokotiDipere: true,
    pricing: {
      "18-64": { single: 300, family: 600, m6: 1000, m10: null },
      "65-74": null,
      "75-84": null,
      "85-100": null
    },
    valueAdds: [
      "Princeton Dome Casket",
      "Full Fleet Provided & Graveyard Setup",
      "Tent, 2 Tables, 1 VIP Toilet",
      "100 Chairs & 150 VIP Programmes",
      "Full Catering Service (Replaces Grocery)",
      "Tombstone / Headstone Provided",
      "Fresh Flower",
      "Airtime / Data / Electricity - R200",
      "Mokoti / Dipere",
      "Storage & Collection 100km",
      "Free Repatriation*"
    ]
  }
];

export const ADD_ONS = {
  tombstoneA: {
    name: "A. Tombstone Benefit",
    description: "Head & Base, Kerbs & Chips",
    cashPayout: "R5,000 Cash Payout",
    pricing: {
      "18-64": { single: 35, family: 45, m6: 90, m10: 120 },
      "65-74": { single: 45, family: 55, m6: 95, m10: 130 },
      "75-84": { single: 55, family: 65, m6: 110, m10: 140 },
      "85-100": { single: 100, family: 110, m6: 165, m10: 210 }
    }
  },
  tombstoneB: {
    name: "B. Headstone & Base & Ledger Option",
    description: "Head & Base, Ledger",
    cashPayout: "R10,000 Cash Payout",
    pricing: {
      "18-64": { single: 45, family: 73, m6: 100, m10: 130 },
      "65-74": { single: 60, family: 70, m6: 115, m10: 140 }
    }
  },
  cateringC: {
    name: "C. Catering Benefit",
    description: "Full memorial catering setup & staff (Client provides groceries)",
    cashPayout: "R10,000 Cash Payout",
    includes: [
      "Cutlery & Crockery",
      "10 Umbrellas or Tent",
      "10 Chefs to cook and serve",
      "100 Chairs • 10 Tables",
      "Gas Stove & Food Warmers",
      "Cooking Utensils"
    ],
    pricing: {
      "18-64": { single: 45, family: 73, m6: 100, m10: 130 },
      "65-74": { single: 60, family: 70, m6: 115, m10: 140 }
    }
  }
};

export const CHILDREN_COVER = [
  { ageGroup: "14 – 21 years", percentage: "100%", detail: "100% of Main Member Cover Amount" },
  { ageGroup: "6 – 13 years", percentage: "50%", detail: "50% of Main Member Cover Amount" },
  { ageGroup: "0 – 5 years", percentage: "25%", detail: "25% of Main Member Cover Amount" },
  { ageGroup: "Stillborn", percentage: "25%", detail: "25% of Main Member Cover Amount" }
];

export const BRANCHES = [
  { name: "Phuthaditjhaba (Head Office)", address: "Site 1, Portion 2, Beirut (After Circle)", tel: "058 713 0112", tollFree: "080 001 4574", queries: "063 043 9438", claims: "060 726 7994", email: "info@thusanangfs.co.za", isHeadOffice: true },
  { name: "Bethlehem", address: "8 Grey Street", tel: "058 303 6109", call: "063 287 6002" },
  { name: "Botshabelo", address: "Shop 172BA, Varase Centre (Next To Cashbuild)", tel: "076 721 9735" },
  { name: "Harrismith", address: "29A Warden Street", call: "082 233 0704" },
  { name: "Ladybrand", address: "Shop 2, Erasmus Street", call: "079 278 3787" },
  { name: "Lindley", address: "16 Brand Street", call: "073 601 0759" },
  { name: "Makeneng Village", address: "Motebang Str, Witsieshoek", tel: "058 789 0014" },
  { name: "Paul-Roux", address: "187 Old Location, Fateng Tse Ntsho", call: "068 839 0073" },
  { name: "Petrus-Steyn", address: "33 Botha Street", call: "078 063 0451" },
  { name: "Reitz", address: "19 Hoop Street", tel: "058 863 1419" },
  { name: "Tweeling", address: "11 Andries Pretorious Street", call: "073 327 9661" }
];

export const TERMS_AND_CONDITIONS = [
  "Budget Buster: 3 months waiting period for natural death.",
  "Executive, Royal & Presidential: 6 months waiting period for natural death.",
  "One-Stop All-Inclusive: 9 months waiting period for natural death.",
  "Add-on benefits (Tombstone, Catering) follow the waiting period of the underlying plan.",
  "24 months waiting period for suicide.",
  "Immediate cover for accidental death.",
  "Terms and conditions apply."
];
