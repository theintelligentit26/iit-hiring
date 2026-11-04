// Tab membership for the hiring portal.
// Edit these arrays to move people between tabs.
// "All candidates" always shows every row from public.hiring_candidates.
// Names must match the row id (data->>'name'). Do not rename rows here.

export const TAB_MEMBERS = {
  invites: [
    "Humberto Gutierrez",
    "Nick Mitevski",
    "Gene Berdnik",
    "Geordin Smith",
    "Alexander Valencia Bran",
    "Marco Hernandez",
    "Walter Calderon",
    "Justin Caven",
    "Brian Chu",
  ],
  review: [
    "Chase Reyes",
    "Raymundo Lopez",
    "Steve Quintanilla",
    "Devin Rumer",
    "Hassana Adamou",
    "Aluizio Couto",
    "Antonio Gutierrez",
    "Andrew Walldez",
    "Nolen Pitre",
    "William Folgar",
    "Navin Prajapati",
  ],
  hired: ["Javier Abrica"],
};

export const TAB_ORDER = [
  { id: "invites", label: "Interview invites" },
  { id: "review", label: "Must review" },
  { id: "all", label: "All candidates" },
  { id: "hired", label: "Hired" },
  { id: "script", label: "Interview Script & Phone Screening" },
];

export const TAB_BLURB = {
  invites:
    "Invite sent on Indeed Nov 4, status Interviewing",
  review:
    "Backups worth a look: Chase Reyes, Raymundo Lopez and Steve Quintanilla, plus anyone 6.0+ flagged for distance or pay fit.",
  hired: "Javier Abrica accepted and started Nov 2.",
};

export function membersOf(tabId) {
  if (tabId === "all") return null;
  return TAB_MEMBERS[tabId] ?? [];
}

export function onTab(name, tabId) {
  if (tabId === "all") return true;
  return (TAB_MEMBERS[tabId] ?? []).includes(name);
}

export function isHired(name) {
  return TAB_MEMBERS.hired.includes(name);
}
