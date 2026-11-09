// Tab membership for the hiring portal.
// Edit these arrays to move people between tabs.
// "All candidates" always shows every row from public.hiring_candidates.
// Names must match the row id (data->>'name'). Do not rename rows here.
// Interview invites is everyone in hiring_candidates whose interview status is invited.
// No reply names live only in hiring_candidates_noreply. Do not list them here.

export const TAB_MEMBERS = {};

export const TAB_ORDER = [
  { id: "today", label: "Today's interviews" },
  { id: "invites", label: "Interview invites" },
  { id: "sched", label: "Interview schedule" },
  { id: "all", label: "All candidates" },
  { id: "yrs", label: "15+ yrs review" },
  { id: "noreply", label: "No reply" },
];

export const TAB_BLURB = {
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

