// Tab membership for the hiring portal.
// Edit these arrays to move people between tabs.
// "All candidates" always shows every row from public.hiring_candidates.
// Names must match the row id (data->>'name'). Do not rename rows here.
// Interview invites is one tab, shown as the two batches below.

export const INVITE_BATCHES = [
  {
    id: "sent",
    label: "Batch 1: invite sent on Indeed Nov 4, status Interviewing",
    names: [
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
  },
  {
    id: "pending",
    label: "Batch 2: Invite sent on Indeed Nov 4, status Interviewing",
    names: [
      "Devin Rumer",
      "Trishan Vithanage",
      "Steve Quintanilla",
      "Daniel Mora",
      "Aluizio Couto",
      "Antonio Gutierrez",
      "Daniel Zaragoza",
    ],
  },
];

export const TAB_MEMBERS = {
  invites: INVITE_BATCHES.flatMap((batch) => batch.names),
  review: ["Nolen Pitre"],
  hired: ["Javier Abrica"],
};

export const TAB_ORDER = [
  { id: "invites", label: "Interview invites" },
  { id: "sched", label: "Interview schedule" },
  { id: "review", label: "Must review" },
  { id: "all", label: "All candidates" },
  { id: "hired", label: "Hired" },
  { id: "yrs", label: "15+ yrs review" },
  { id: "script", label: "Interview Script & Phone Screening" },
];

export const TAB_BLURB = {
  review:
    "Nolen Pitre is still on this list.",
  hired: "Javier Abrica accepted and started Nov 2.",
  yrs: "Kept off the main candidate list. Not declined on Indeed. Ranked by rank. A blank score means the resume was not found.",
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
