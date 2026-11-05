import * as l from "react";
import { createRoot } from "react-dom/client";
import { createClient as Pa } from "@supabase/supabase-js";
import { QUICK_VIEW_URL } from "./script-content.js";
import { ScriptTab } from "./script-tab.jsx";
import {
  INVITE_BATCHES,
  TAB_BLURB,
  TAB_ORDER,
  isHired,
  onTab,
} from "./tab-membership.js";

const u = { createRoot };

function ko(type, props, key) {
  var element = Symbol.for(`react.transitional.element`);
  var i = null;
  var next = props;
  if (
    (key !== void 0 && (i = `` + key),
    props.key !== void 0 && (i = `` + props.key),
    `key` in props)
  ) {
    next = {};
    for (var name in props) name !== `key` && (next[name] = props[name]);
  }
  var ref = next.ref;
  return {
    $$typeof: element,
    type,
    key: i,
    ref: ref === void 0 ? null : ref,
    props: next,
  };
}

var PERSONAL_SOCIAL =
  /(?:^|\.)(?:facebook|fb|instagram|tiktok|snapchat|twitter|threads)\.com$|(?:^|\.)x\.com$/i;

function safeLinks(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((item) => {
    if (!item || typeof item.href != `string`) return false;
    let host = ``;
    try {
      host = new URL(item.href).hostname;
    } catch {
      return false;
    }
    if (PERSONAL_SOCIAL.test(host)) return false;
    if (/\.(?:png|jpe?g|gif|webp|svg)(?:\?|$)/i.test(item.href)) return false;
    return true;
  });
}

function Ia(e, t) {
  if (!e || !t || e.includes(`YOUR_PROJECT`) || t.includes(`YOUR_ANON`))
    return null;
  try {
    let t = new URL(e);
    if (t.protocol !== `https:` && t.protocol !== `http:`) return null;
  } catch {
    return null;
  }
  return { url: e, anonKey: t };
}
function La() {
  return Ia(``, ``);
}
async function Ra() {
  try {
    let e = await fetch(new URL(`config.json`, document.baseURI), {
      cache: `no-store`,
    });
    if (e.ok) {
      let t = await e.json(),
        n = Ia(t.supabaseUrl?.trim() ?? ``, t.supabaseAnonKey?.trim() ?? ``);
      if (n) return n;
    }
  } catch {}
  return La();
}
var za = { Excellent: 0, Good: 1, OK: 2, Fair: 3, Poor: 4, Not: 5 },
  Ba = (e) => za[e.split(` `)[0]] ?? 9,
  Va = (e, t) => ((e / t) * 10).toFixed(1),
  Ha = (e) =>
    /decline/i.test(e)
      ? `bad`
      : /interview|phone screen|offer|call/i.test(e)
        ? `good`
        : `plain`,
  Ua = (e) => (e === `None` ? `bad` : e === `Yes` ? `good` : `warn`),
  Wa = (e) => `card-${e.replace(/[^A-Za-z0-9]+/g, `-`)}`;
function Ga(e) {
  let t = e.match(/(\d+(?:\.\d+)?)\s*(months?|mo\b)?/i);
  return !t || t[2] ? !1 : Number.parseFloat(t[1]) >= 10;
}
function Ka(e) {
  return /^yes/i.test(e)
    ? `Yes`
    : /^(possibly|claimed|consultancy|kaseya)/i.test(e)
      ? `Limited`
      : `No`;
}
function qa(e, t) {
  let n = e.trim();
  return n ? (n.length <= 6 ? n : Ja(n)) : Ja(t);
}
function Ja(e) {
  let t = e.trim();
  if (!t) return `—`;
  let n = t.startsWith(`~`) || /\babout\b/i.test(t),
    r = t.match(/(\d+(?:\.\d+)?)/);
  if (!r) return t.length <= 6 ? t : `—`;
  let i = r[1];
  return (
    i.endsWith(`.0`)
      ? (i = i.slice(0, -2))
      : i.includes(`.`) && (i = String(Math.round(Number(i)))),
    n ? `~${i}` : i
  );
}
function Ya(e, t) {
  let n = (e) => e.trim().split(/[\s(/]/)[0] ?? ``,
    r = (e) =>
      /^excellent$/i.test(e)
        ? `Excellent`
        : /^good$/i.test(e)
          ? `Good`
          : /^fair$/i.test(e)
            ? `Fair`
            : /^poor$/i.test(e)
              ? `Poor`
              : /^ok$/i.test(e)
                ? `OK`
                : /^far$/i.test(e) || /^not$/i.test(e)
                  ? `Far`
                  : null;
  return r(n(e)) || r(t.trim()) || r(n(t)) || `—`;
}
function Xa(e) {
  return e === `Phone screen` || /phone/i.test(e)
    ? `Screen`
    : e === `Interview` || /interview/i.test(e)
      ? `Interview`
      : e === `Hold` || /hold/i.test(e)
        ? `Hold`
        : e === `Decline` || /decline/i.test(e)
          ? `Decline`
          : e || `—`;
}
var Za = { rows: [], updatedAt: null, phase: `loading`, notice: `` };
function Qa(e) {
  return Array.isArray(e) ? e.filter((e) => typeof e == `string`) : [];
}
function $a(e) {
  return Array.isArray(e) ? e.filter((e) => typeof e == `number`) : [];
}
function eo(e) {
  let t = e.data;
  return !t ||
    typeof t != `object` ||
    t.name !== e.id ||
    typeof t.s10 != `string` ||
    typeof t.grp != `string` ||
    typeof t.sRec != `string`
    ? null
    : {
        ...t,
        rank: typeof e.rank == `number` ? e.rank : Number(t.rank) || 0,
        strengths: Qa(t.strengths),
        gaps: Qa(t.gaps),
        qs: Qa(t.qs),
        tools: Qa(t.tools),
        questions: Qa(t.questions),
        sub: $a(t.sub),
        yrsRed:
          typeof t.yrsRed == `boolean` ? t.yrsRed : Ga(String(t.yrs ?? ``)),
        mspShort:
          typeof t.mspShort == `string` && t.mspShort
            ? t.mspShort
            : Ka(String(t.msp ?? ``)),
        presetNote: typeof t.presetNote == `string` ? t.presetNote : void 0,
      };
}
function to(e) {
  let t = e.filter((e) => e.st.startsWith(`Contacting`)),
    n = e.filter((e) => e.st.startsWith(`Reviewing`)).length,
    r = t.map((e) => e.name).join(`, `),
    i = t.length ? `Contacting ${t.length} (${r})` : `Contacting 0`;
  return `${e.length} active Indeed applicants: Reviewing ${n}, ${i}. Rejected and withdrawn people are not listed.`;
}
function no(e) {
  if (!e) return `—`;
  let t = new Date(e);
  return Number.isNaN(t.getTime())
    ? `—`
    : `${new Intl.DateTimeFormat(`en-US`, { month: `short`, day: `numeric`, year: `numeric`, hour: `numeric`, minute: `2-digit`, timeZone: `America/Los_Angeles` }).format(t)} PT`;
}
function ro() {
  let [e, t] = (0, l.useState)(Za);
  return (
    (0, l.useEffect)(() => {
      let e = !1,
        n = null,
        r = null,
        i = !1;
      async function a() {
        if (!n || e) return;
        let { data: r, error: a } = await n
          .from(`hiring_candidates`)
          .select(`id,data,rank,updated_at`)
          .order(`rank`, { ascending: !0 });
        if (e) return;
        if (a || !r) {
          t((e) =>
            e.rows.length
              ? {
                  ...e,
                  phase: `ready`,
                  notice: `Showing the last candidate list. The latest refresh failed.`,
                }
              : {
                  rows: [],
                  updatedAt: null,
                  phase: `error`,
                  notice: `Candidates could not be loaded. Refresh the page.`,
                },
          );
          return;
        }
        let o = r.map(eo).filter((e) => e !== null),
          s = r.reduce((e, t) => (t.updated_at > e ? t.updated_at : e), ``);
        ((i = !0),
          t({ rows: o, updatedAt: s || null, phase: `ready`, notice: `` }));
      }
      let o = window.setInterval(() => {
          a();
        }, 15e3),
        s = () => {
          a();
        },
        c = () => {
          document.visibilityState === `visible` && a();
        };
      return (
        window.addEventListener(`focus`, s),
        document.addEventListener(`visibilitychange`, c),
        (async () => {
          let o = await Ra();
          e ||
            (o
              ? ((n = Pa(o.url, o.anonKey, {
                  auth: { persistSession: !1, autoRefreshToken: !1 },
                })),
                await a(),
                !e &&
                  i &&
                  (r = n
                    .channel(`hiring-candidates-live`)
                    .on(
                      `postgres_changes`,
                      {
                        event: `*`,
                        schema: `public`,
                        table: `hiring_candidates`,
                      },
                      () => {
                        a();
                      },
                    )
                    .subscribe()))
              : t({
                  rows: [],
                  updatedAt: null,
                  phase: `error`,
                  notice: `Supabase is not configured, so the candidate list cannot load.`,
                }));
        })(),
        () => {
          ((e = !0),
            window.clearInterval(o),
            window.removeEventListener(`focus`, s),
            document.removeEventListener(`visibilitychange`, c),
            r && n?.removeChannel(r),
            (n = null));
        }
      );
    }, []),
    e
  );
}
function str(e) {
  return typeof e == `string` ? e : ``;
}
function hiddenRow(e) {
  let t = e.data;
  if (!t || typeof t != `object` || t.name !== e.id) return null;
  let missing = typeof t.s10 != `string` || !t.s10.trim(),
    row = eo({
      id: e.id,
      rank: e.rank,
      data: {
        ...t,
        s10: missing ? `` : t.s10,
        grp: typeof t.grp == `string` ? t.grp : ``,
        sRec: typeof t.sRec == `string` ? t.sRec : ``,
        presetNote: missing
          ? `resume not found`
          : typeof t.presetNote == `string`
            ? t.presetNote
            : ``,
      },
    });
  if (!row) return null;
  row.noScore = missing;
  row.hiddenReason = str(e.hidden_reason);
  row.commute = str(row.commute);
  row.st = str(row.st);
  row.sYrs = str(row.sYrs);
  row.sCom = str(row.sCom);
  row.loc = str(row.loc);
  row.certs = str(row.certs);
  row.msp = str(row.msp);
  row.rec2 = str(row.rec2);
  row.paid = str(row.paid);
  row.avail = str(row.avail);
  row.verif = str(row.verif);
  row.risks = str(row.risks);
  row.next = str(row.next);
  row.yrs = str(row.yrs);
  row.bonus = Number(row.bonus) || 0;
  row.base = Number(row.base) || 0;
  row.nv = Number(row.nv) || 0;
  row.total = Number(row.total) || 0;
  if (!Array.isArray(row.tools)) row.tools = [];
  if (!Array.isArray(row.sub)) row.sub = [];
  if (!Array.isArray(row.strengths)) row.strengths = [];
  if (!Array.isArray(row.gaps)) row.gaps = [];
  if (!Array.isArray(row.questions)) row.questions = [];
  return row;
}
function hiddenList() {
  let [e, t] = (0, l.useState)(Za);
  return (
    (0, l.useEffect)(() => {
      let e = !1,
        n = null,
        r = null,
        i = !1;
      async function a() {
        if (!n || e) return;
        let { data: r, error: a } = await n
          .from(`hiring_candidates_hidden`)
          .select(`id,data,rank,hidden_reason,hidden_at,updated_at`)
          .order(`rank`, { ascending: !0 });
        if (e) return;
        if (a || !r) {
          t((e) =>
            e.rows.length
              ? {
                  ...e,
                  phase: `ready`,
                  notice: `Showing the last 15+ yrs list. The latest refresh failed.`,
                }
              : {
                  rows: [],
                  updatedAt: null,
                  phase: `error`,
                  notice: `The 15+ yrs list could not be loaded. Refresh the page.`,
                },
          );
          return;
        }
        let o = r.map(hiddenRow).filter((e) => e !== null),
          s = r.reduce((e, t) => (t.updated_at > e ? t.updated_at : e), ``);
        ((i = !0),
          t({ rows: o, updatedAt: s || null, phase: `ready`, notice: `` }));
      }
      let o = window.setInterval(() => {
          a();
        }, 15e3),
        s = () => {
          a();
        },
        c = () => {
          document.visibilityState === `visible` && a();
        };
      return (
        window.addEventListener(`focus`, s),
        document.addEventListener(`visibilitychange`, c),
        (async () => {
          let o = await Ra();
          e ||
            (o
              ? ((n = Pa(o.url, o.anonKey, {
                  auth: { persistSession: !1, autoRefreshToken: !1 },
                })),
                await a(),
                !e &&
                  i &&
                  (r = n
                    .channel(`hiring-candidates-hidden-live`)
                    .on(
                      `postgres_changes`,
                      {
                        event: `*`,
                        schema: `public`,
                        table: `hiring_candidates_hidden`,
                      },
                      () => {
                        a();
                      },
                    )
                    .subscribe()))
              : t({
                  rows: [],
                  updatedAt: null,
                  phase: `error`,
                  notice: `Supabase is not configured, so the 15+ yrs list cannot load.`,
                }));
        })(),
        () => {
          ((e = !0),
            window.clearInterval(o),
            window.removeEventListener(`focus`, s),
            document.removeEventListener(`visibilitychange`, c),
            r && n?.removeChannel(r),
            (n = null));
        }
      );
    }, []),
    e
  );
}
var io = [
    `Set up a PC under a desk: power, monitor, network, peripherals, tidy cabling.`,
    `Verify Windows 11 and updates, join the device to Entra ID and confirm Intune enrollment.`,
    `Create an M365 user, assign a license, set up Outlook/Teams/OneDrive.`,
    `Reset a user's MFA and clear an account lockout in Entra.`,
    `Grant Full Access / Send As on a shared mailbox in Exchange Online.`,
    `Map a network printer and print a test page.`,
    `Troubleshoot a staged network fault (bad cable / wrong DNS / DHCP off) and explain the fix.`,
    `Write a clear ticket note: problem, steps, resolution, follow-up.`,
  ],
  ao = [
    [`Hands-on paid support`, 30],
    [`Core stack (Win/M365/Entra/Azure/network)`, 20],
    [`MSP / RMM / ticketing`, 15],
    [`AD / Intune / Server`, 10],
    [`Verification & credibility`, 10],
    [`Location / commute`, 5],
    [`Role & pay fit (Level 1, confirm on call)`, 10],
  ],
  z = {
    Fragment: Symbol.for(`react.fragment`),
    jsx: ko,
    jsxs: ko,
  },
  so = `iit-phone-script-v1`,
  co = () => ({ checks: {}, knocks: {}, scores: {}, hours: ``, gear: `` });
function lo() {
  try {
    let e = sessionStorage.getItem(so);
    if (!e) return co();
    let t = JSON.parse(e);
    return {
      checks: t.checks ?? {},
      knocks: t.knocks ?? {},
      scores: t.scores ?? {},
      hours: typeof t.hours == `string` ? t.hours : ``,
      gear: typeof t.gear == `string` ? t.gear : ``,
    };
  } catch {
    return co();
  }
}
var uo = [
    [`communication`, `Communication`],
    [`technical`, `Technical`],
    [`service`, `Customer service`],
    [`reliability`, `Reliability`],
    [`fit`, `Fit`],
  ],
  fo = [
    `Age, or anything that points at age`,
    `Graduation year, or dates you can use to guess age`,
    `Marital status, kids, pregnancy, or family plans`,
    `Religion`,
    `National origin, citizenship, or accent. You may ask only: are you legally authorized to work in the United States?`,
    `Disability, injuries, or medical history. You may describe the physical work and ask if they can do it.`,
    `Arrests or convictions. California’s Fair Chance Act: a background check, if any, comes after a conditional offer.`,
    `Salary history. California bans it. Ask what they want for this role, not what they used to make.`,
  ];
function po() {
  let [e, t] = (0, l.useState)(lo);
  (0, l.useEffect)(() => {
    try {
      sessionStorage.setItem(so, JSON.stringify(e));
    } catch {}
  }, [e]);
  function n(e) {
    t((t) => ({ ...t, checks: { ...t.checks, [e]: !t.checks[e] } }));
  }
  function r(e, n) {
    t((t) => ({ ...t, knocks: { ...t.knocks, [e]: n } }));
  }
  function i(e, n) {
    t((t) => ({ ...t, scores: { ...t.scores, [e]: n } }));
  }
  function a() {
    t((e) => ({ ...co(), hours: e.hours, gear: e.gear }));
  }
  let o = uo.map(([t]) => e.scores[t]).filter((e) => typeof e == `number`),
    s = o.length ? o.reduce((e, t) => e + t, 0) / o.length : null,
    u = e.gear.trim();
  return (0, z.jsxs)(`section`, {
    className: `phone-script`,
    id: `phone-script`,
    children: [
      (0, z.jsxs)(`div`, {
        className: `script-head`,
        children: [
          (0, z.jsx)(`h2`, { children: `Phone Screen Script` }),
          (0, z.jsx)(`button`, {
            type: `button`,
            className: `ghost`,
            onClick: a,
            children: `Clear this call`,
          }),
        ],
      }),
      (0, z.jsx)(`p`, {
        className: `lede`,
        children: `Level 1 IT Help Desk at Intelligent IT. Plan on 20–25 minutes. Open one step, read it, then close it. Checks and scores stay on this phone for this tab only. They are not saved to the candidate. Use the questions on the candidate’s card for anything about that person’s resume.`,
      }),
      (0, z.jsxs)(`aside`, {
        className: `dont-ask`,
        children: [
          (0, z.jsx)(`h3`, { children: `Do NOT ask` }),
          (0, z.jsx)(`ul`, {
            children: fo.map((e) => (0, z.jsx)(`li`, { children: e }, e)),
          }),
        ],
      }),
      (0, z.jsxs)(`details`, {
        className: `step`,
        open: !0,
        children: [
          (0, z.jsxs)(`summary`, {
            children: [
              (0, z.jsx)(`span`, { className: `step-time`, children: `2 min` }),
              `1. Intro`,
            ],
          }),
          (0, z.jsxs)(`div`, {
            className: `step-body`,
            children: [
              (0, z.jsxs)(`p`, {
                className: `say`,
                children: [
                  `Hi, this is `,
                  (0, z.jsx)(`em`, { children: `[your name]` }),
                  ` from Intelligent IT. Thanks for making time. We’re an MSP in Woodland Hills. We take care of day-to-day IT for small and mid-size businesses: Microsoft 365, computers, printers, networks, and the occasional on-site visit.`,
                ],
              }),
              (0, z.jsx)(`p`, {
                className: `say`,
                children: `This is a short screen for our Level 1 IT Help Desk role. I’ll tell you how the job actually works, then ask a few questions. It should take about 20 to 25 minutes. Is now still a good time?`,
              }),
              (0, z.jsx)(B, {
                id: `intro-who`,
                on: !!e.checks[`intro-who`],
                onToggle: n,
                children: `Told them who Intelligent IT is`,
              }),
              (0, z.jsx)(B, {
                id: `intro-why`,
                on: !!e.checks[`intro-why`],
                onToggle: n,
                children: `Told them the purpose of the call`,
              }),
            ],
          }),
        ],
      }),
      (0, z.jsxs)(`details`, {
        className: `step`,
        children: [
          (0, z.jsx)(`summary`, { children: `2. Tell them about the job` }),
          (0, z.jsxs)(`div`, {
            className: `step-body`,
            children: [
              (0, z.jsxs)(`p`, {
                className: `for-you`,
                children: [
                  (0, z.jsx)(`strong`, { children: `Fill in before you dial` }),
                  `Hours are on site, Monday to Friday, 9am to 5pm. Confirm the equipment out loud. Don’t leave it as “to be determined” on the call.`,
                ],
              }),
              (0, z.jsxs)(`label`, {
                className: `fill`,
                children: [
                  `Equipment we provide`,
                  (0, z.jsx)(`textarea`, {
                    rows: 2,
                    value: e.gear,
                    maxLength: 400,
                    autoComplete: `off`,
                    placeholder: `Example: laptop, phone, and a small tool bag. They use their own car.`,
                    onChange: (e) => t((t) => ({ ...t, gear: e.target.value })),
                  }),
                ],
              }),
              (0, z.jsx)(`p`, {
                className: `say`,
                children: `Before I ask about your background, I want you to have the real picture. Stop me if any of this is a problem.`,
              }),
              (0, z.jsx)(B, {
                id: `job-pay`,
                on: !!e.checks[`job-pay`],
                onToggle: n,
                children: `Pay is $20 to $30 an hour, depending on experience.`,
              }),
              (0, z.jsx)(B, {
                id: `job-1099`,
                on: !!e.checks[`job-1099`],
                onToggle: n,
                children: `This is a 1099 contractor role, not a W-2 job.`,
              }),
              (0, z.jsxs)(`p`, {
                className: `for-you`,
                children: [
                  (0, z.jsx)(`strong`, {
                    children: `For you, not the candidate`,
                  }),
                  `Confirm 1099 versus W-2 with a CPA or employment attorney before any offer. California AB5 makes misclassification a real risk for on-site help desk work. Don’t tell them the classification is already settled.`,
                ],
              }),
              (0, z.jsx)(B, {
                id: `job-benefits`,
                on: !!e.checks[`job-benefits`],
                onToggle: n,
                children: `There is no health insurance and no other benefits.`,
              }),
              (0, z.jsx)(B, {
                id: `job-where`,
                on: !!e.checks[`job-where`],
                onToggle: n,
                children: `Based in Woodland Hills. Clients are in the surrounding cities. The farthest is San Clemente. On-site visits are occasional, and they have to be willing to go.`,
              }),
              (0, z.jsx)(B, {
                id: `job-car`,
                on: !!e.checks[`job-car`],
                onToggle: n,
                children: `Valid driver’s license, a reliable car, and their own auto insurance. Mileage is reimbursed at the IRS rate.`,
              }),
              (0, z.jsx)(B, {
                id: `job-body`,
                on: !!e.checks[`job-body`],
                onToggle: n,
                children: `Hands-on physical work: under desks, lifting about 50 pounds, running cable, and setting up PCs and printers.`,
              }),
              (0, z.jsx)(B, {
                id: `job-hours`,
                on: !!e.checks[`job-hours`],
                onToggle: n,
                children: `Hours: on site, Monday to Friday, 9am to 5pm.`,
              }),
              (0, z.jsxs)(B, {
                id: `job-gear`,
                on: !!e.checks[`job-gear`],
                onToggle: n,
                children: [
                  `Equipment we provide: `,
                  u || `type the equipment above before you read this.`,
                ],
              }),
              (0, z.jsx)(B, {
                id: `job-train`,
                on: !!e.checks[`job-train`],
                onToggle: n,
                children: `The first 30 to 90 days are training. They will not be sent to a client alone on day one.`,
              }),
              (0, z.jsx)(B, {
                id: `job-grow`,
                on: !!e.checks[`job-grow`],
                onToggle: n,
                children: `People who do the work well can grow into Level 2.`,
              }),
              (0, z.jsx)(B, {
                id: `job-process`,
                on: !!e.checks[`job-process`],
                onToggle: n,
                children: `Process: phone screen, then a hands-on skills test, then references, then an offer.`,
              }),
              (0, z.jsx)(`p`, {
                className: `say ask-line`,
                children: `Then ask: “Is all of that OK for you?”`,
              }),
              (0, z.jsx)(B, {
                id: `job-ok`,
                on: !!e.checks[`job-ok`],
                onToggle: n,
                children: `Asked, and heard their answer`,
              }),
            ],
          }),
        ],
      }),
      (0, z.jsxs)(`details`, {
        className: `step`,
        children: [
          (0, z.jsx)(`summary`, { children: `3. Knockout questions` }),
          (0, z.jsxs)(`div`, {
            className: `step-body`,
            children: [
              (0, z.jsxs)(`p`, {
                className: `for-you`,
                children: [
                  (0, z.jsx)(`strong`, {
                    children: `If they land on the stop side`,
                  }),
                  `Thank them and end the call. Don’t talk them into a yes.`,
                ],
              }),
              (0, z.jsx)(mo, {
                id: `ko-1099`,
                ask: `Are you OK working as a 1099 contractor, with no health insurance or other benefits?`,
                yes: `Yes`,
                no: `No`,
                value: e.knocks[`ko-1099`],
                onPick: r,
              }),
              (0, z.jsx)(mo, {
                id: `ko-pay`,
                ask: `What hourly rate are you looking for in this role? Mark whether it sits inside $20 to $30. Do not ask what they made before.`,
                yes: `In range`,
                no: `Outside`,
                value: e.knocks[`ko-pay`],
                onPick: r,
              }),
              (0, z.jsx)(mo, {
                id: `ko-car`,
                ask: `Do you have a valid license, a reliable car, and auto insurance, and are you OK driving to clients as far as San Clemente?`,
                yes: `Yes`,
                no: `No`,
                value: e.knocks[`ko-car`],
                onPick: r,
              }),
              (0, z.jsx)(mo, {
                id: `ko-body`,
                ask: `Can you do the physical work: under desks, lifting about 50 pounds, cabling, and PC and printer setup?`,
                yes: `Yes`,
                no: `No`,
                value: e.knocks[`ko-body`],
                onPick: r,
              }),
              (0, z.jsx)(mo, {
                id: `ko-start`,
                ask: `When can you start, and what notice do you owe your current job?`,
                yes: `Date works`,
                no: `Doesn’t work`,
                value: e.knocks[`ko-start`],
                onPick: r,
              }),
              (0, z.jsx)(mo, {
                id: `ko-auth`,
                ask: `Are you legally authorized to work in the United States?`,
                yes: `Yes`,
                no: `No`,
                hint: `Stop there. Don’t ask where they are from or whether they are a citizen.`,
                value: e.knocks[`ko-auth`],
                onPick: r,
              }),
              (0, z.jsx)(mo, {
                id: `ko-hours`,
                ask: `The role is on site Monday to Friday, 9am to 5pm. Are you available for the full schedule every week?`,
                yes: `Hours work`,
                no: `Don’t work`,
                value: e.knocks[`ko-hours`],
                onPick: r,
              }),
            ],
          }),
        ],
      }),
      (0, z.jsxs)(`details`, {
        className: `step`,
        children: [
          (0, z.jsx)(`summary`, { children: `4. Experience` }),
          (0, z.jsxs)(`div`, {
            className: `step-body`,
            children: [
              (0, z.jsx)(`p`, {
                children: `Let them talk. You want what they did with their own hands, not a job title.`,
              }),
              (0, z.jsx)(B, {
                id: `ex-last`,
                on: !!e.checks[`ex-last`],
                onToggle: n,
                children: `Walk me through your last support role. Who were the users, and what did a normal day look like?`,
              }),
              (0, z.jsx)(B, {
                id: `ex-volume`,
                on: !!e.checks[`ex-volume`],
                onToggle: n,
                children: `About how many tickets did you close in a day?`,
              }),
              (0, z.jsx)(B, {
                id: `ex-tools`,
                on: !!e.checks[`ex-tools`],
                onToggle: n,
                children: `What ticketing system did you use? Have you used an RMM such as NinjaOne, Datto, or ConnectWise? Which remote tools?`,
              }),
              (0, z.jsx)(B, {
                id: `ex-m365`,
                on: !!e.checks[`ex-m365`],
                onToggle: n,
                children: `Which Microsoft 365 or Exchange tasks have you done yourself: create a user, assign a license, shared mailbox, message trace?`,
              }),
              (0, z.jsx)(B, {
                id: `ex-mfa`,
                on: !!e.checks[`ex-mfa`],
                onToggle: n,
                children: `Have you reset MFA or cleared a sign-in block in Entra ID?`,
              }),
              (0, z.jsx)(B, {
                id: `ex-ad`,
                on: !!e.checks[`ex-ad`],
                onToggle: n,
                children: `Have you created or disabled an Active Directory account, or changed Group Policy?`,
              }),
              (0, z.jsx)(B, {
                id: `ex-intune`,
                on: !!e.checks[`ex-intune`],
                onToggle: n,
                children: `Have you enrolled a PC in Intune, or pushed an app or a policy?`,
              }),
              (0, z.jsx)(B, {
                id: `ex-net`,
                on: !!e.checks[`ex-net`],
                onToggle: n,
                children: `On a PC with no internet, how do you tell a DNS problem from a DHCP problem?`,
              }),
              (0, z.jsx)(B, {
                id: `ex-msp`,
                on: !!e.checks[`ex-msp`],
                onToggle: n,
                children: `Have you supported more than one client, the way an MSP does? How did you keep their setups from getting mixed together?`,
              }),
            ],
          }),
        ],
      }),
      (0, z.jsxs)(`details`, {
        className: `step`,
        children: [
          (0, z.jsx)(`summary`, { children: `5. Quick technical questions` }),
          (0, z.jsxs)(`div`, {
            className: `step-body`,
            children: [
              (0, z.jsx)(`p`, {
                children: `Ask four or five if time is short. The lost-phone MFA question and the password-reset question matter most.`,
              }),
              (0, z.jsx)(ho, {
                id: `tech-mail`,
                on: !!e.checks[`tech-mail`],
                onToggle: n,
                q: `A user changed their password and now email will not open on their phone. What do you do?`,
                good: `The phone is still holding the old password. Confirm the new password works on the web first, then update or remove the account in Outlook or Apple Mail. Check whether MFA also needs a fresh approval. Don’t reset the password a second time as the first move.`,
              }),
              (0, z.jsx)(ho, {
                id: `tech-dns`,
                on: !!e.checks[`tech-dns`],
                onToggle: n,
                q: `What’s the difference between DNS and DHCP?`,
                good: `DHCP gives the PC an address, a gateway, and usually the DNS servers. A broken DHCP often looks like no IP, or a 169.254 address. DNS turns a name into an address. A broken DNS often means a ping to an IP works and a ping to a name does not.`,
              }),
              (0, z.jsx)(ho, {
                id: `tech-print`,
                on: !!e.checks[`tech-print`],
                onToggle: n,
                q: `The printer is offline for the whole office. Where do you start?`,
                good: `Everyone is down, so look at the printer and the network, not one PC. Power, lights, paper, cable or Wi-Fi, and the printer’s IP. Ask whether they print through a queue or straight to the printer. Don’t reinstall the driver on every computer first.`,
              }),
              (0, z.jsx)(ho, {
                id: `tech-mfa`,
                on: !!e.checks[`tech-mfa`],
                onToggle: n,
                q: `Someone calls and says they lost their phone and need MFA reset. What do you do?`,
                good: `Prove who they are before you touch the account. Then revoke the sessions in Entra and require a new sign-in method the company already allows. Don’t read a bypass code to a caller you have not verified. If they still have a backup method, point them to that.`,
              }),
              (0, z.jsx)(ho, {
                id: `tech-share`,
                on: !!e.checks[`tech-share`],
                onToggle: n,
                q: `A user says they can’t reach the shared drive. What do you check?`,
                good: `One person or everyone? Can they open the internet and other office resources? Get the real path, not only the drive letter, and try it as a UNC path. If they are remote, check the VPN. “Access denied” is permissions. “Network path not found” is name, VPN, or the server.`,
              }),
              (0, z.jsx)(ho, {
                id: `tech-slow`,
                on: !!e.checks[`tech-slow`],
                onToggle: n,
                q: `A PC is slow. Walk me through how you triage it.`,
                good: `Since when, one PC or many, and what changed. Then Task Manager: CPU, memory, disk, and startup apps. Check free disk space and a stuck Windows Update. Reboot if they have not. Don’t jump to replacing the PC.`,
              }),
              (0, z.jsx)(ho, {
                id: `tech-vpn`,
                on: !!e.checks[`tech-vpn`],
                onToggle: n,
                q: `What is a VPN, in plain language?`,
                good: `An encrypted tunnel from the person’s device into the client network, so they can reach internal servers as if they were in the office. It is not “the internet.” If the VPN is down, public websites can still work while the shared drive does not.`,
              }),
              (0, z.jsx)(ho, {
                id: `tech-social`,
                on: !!e.checks[`tech-social`],
                onToggle: n,
                q: `How do you verify a caller before you reset a password?`,
                good: `Urgency is not proof. Someone saying they are the owner is not proof. Call back on a number already on file, not a number they just gave you. Or have their manager confirm. Never accept a new email address from the caller as the only check. This is how social engineering starts.`,
              }),
            ],
          }),
        ],
      }),
      (0, z.jsxs)(`details`, {
        className: `step`,
        children: [
          (0, z.jsx)(`summary`, { children: `6. Customer service` }),
          (0, z.jsxs)(`div`, {
            className: `step-body`,
            children: [
              (0, z.jsx)(`p`, {
                className: `say`,
                children: `A client calls angry. Their email has been down for two hours. What do you say in the first minute, and what do you do in the next five?`,
              }),
              (0, z.jsxs)(`p`, {
                className: `good-answer`,
                children: [
                  (0, z.jsx)(`strong`, { children: `A good answer.` }),
                  ` Stay calm and don’t argue or blame. Say you understand the business is stuck. Find out whether it is one mailbox or the whole company, the exact error, and what they already tried. Give a real callback time, such as 15 minutes, even if you don’t have the fix yet. Open the ticket, check Microsoft service health and that mailbox, and escalate if the whole tenant is down. When it is back, explain what happened in plain language.`,
                ],
              }),
              (0, z.jsx)(B, {
                id: `cs-owned`,
                on: !!e.checks[`cs-owned`],
                onToggle: n,
                children: `They took ownership and stayed calm`,
              }),
            ],
          }),
        ],
      }),
      (0, z.jsxs)(`details`, {
        className: `step`,
        children: [
          (0, z.jsx)(`summary`, { children: `7. Motivation and fit` }),
          (0, z.jsxs)(`div`, {
            className: `step-body`,
            children: [
              (0, z.jsx)(B, {
                id: `fit-why`,
                on: !!e.checks[`fit-why`],
                onToggle: n,
                children: `Why Level 1 help desk, and why an MSP instead of a single company’s IT team?`,
              }),
              (0, z.jsx)(B, {
                id: `fit-learn`,
                on: !!e.checks[`fit-learn`],
                onToggle: n,
                children: `What have you taught yourself lately: a home lab, a cert, or a course?`,
              }),
              (0, z.jsxs)(`p`, {
                className: `for-you`,
                children: [
                  (0, z.jsx)(`strong`, {
                    children: `If they are senior for this pay`,
                  }),
                  `Ask this. A strong tech who wants $40 an hour will not stay, and that is fine to learn now.`,
                ],
              }),
              (0, z.jsx)(B, {
                id: `fit-stay`,
                on: !!e.checks[`fit-stay`],
                onToggle: n,
                children: `This is Level 1 at $20 to $30 an hour, with desk-side and on-site work. Why this role, and how long would you plan to stay?`,
              }),
            ],
          }),
        ],
      }),
      (0, z.jsxs)(`details`, {
        className: `step`,
        children: [
          (0, z.jsx)(`summary`, { children: `8. Their questions` }),
          (0, z.jsxs)(`div`, {
            className: `step-body`,
            children: [
              (0, z.jsx)(`p`, {
                className: `say`,
                children: `What questions do you have about the work, the clients, or a normal day?`,
              }),
              (0, z.jsxs)(`p`, {
                className: `for-you`,
                children: [
                  (0, z.jsx)(`strong`, { children: `For you` }),
                  `Answer plainly. If you don’t know the hours or the equipment, say you will confirm. Don’t invent benefits, and don’t promise W-2.`,
                ],
              }),
              (0, z.jsx)(B, {
                id: `their-q`,
                on: !!e.checks[`their-q`],
                onToggle: n,
                children: `Left real time for their questions`,
              }),
            ],
          }),
        ],
      }),
      (0, z.jsxs)(`details`, {
        className: `step`,
        children: [
          (0, z.jsx)(`summary`, { children: `9. Close` }),
          (0, z.jsxs)(`div`, {
            className: `step-body`,
            children: [
              (0, z.jsxs)(`p`, {
                className: `say`,
                children: [
                  `Thanks for the time. If we both want to continue, the next step is a hands-on skills test. After that we call references, and then we talk about an offer. I’ll follow up with you by `,
                  (0, z.jsx)(`em`, {
                    children: `[say when, such as within two business days]`,
                  }),
                  `.`,
                ],
              }),
              (0, z.jsx)(B, {
                id: `close-next`,
                on: !!e.checks[`close-next`],
                onToggle: n,
                children: `Told them the next step and a real timeline`,
              }),
              (0, z.jsx)(B, {
                id: `close-refs`,
                on: !!e.checks[`close-refs`],
                onToggle: n,
                children: `Asked for two managers we can call as references`,
              }),
              (0, z.jsxs)(`p`, {
                className: `for-you`,
                children: [
                  (0, z.jsx)(`strong`, {
                    children: `For you, not the candidate`,
                  }),
                  `A background check may follow a conditional offer. Say that only if you are actually extending an offer. Do not ask about criminal history on this call. That is the California Fair Chance Act.`,
                ],
              }),
              (0, z.jsx)(B, {
                id: `close-fair`,
                on: !!e.checks[`close-fair`],
                onToggle: n,
                children: `Did not ask about criminal history`,
              }),
            ],
          }),
        ],
      }),
      (0, z.jsxs)(`div`, {
        className: `score-card`,
        children: [
          (0, z.jsx)(`h3`, { children: `Score this call, 1 to 5` }),
          (0, z.jsx)(`p`, {
            children: `5 is a clear yes. 3 is mixed. 1 is a stop. This row stays on this phone. Paste it into the candidate’s shared note if Hooman and Ryan should see it.`,
          }),
          uo.map(([t, n]) =>
            (0, z.jsxs)(
              `div`,
              {
                className: `score-item`,
                children: [
                  (0, z.jsx)(`span`, { children: n }),
                  (0, z.jsx)(`div`, {
                    className: `score-pips`,
                    role: `group`,
                    "aria-label": `${n} score`,
                    children: [1, 2, 3, 4, 5].map((n) =>
                      (0, z.jsx)(
                        `button`,
                        {
                          type: `button`,
                          className: e.scores[t] === n ? `pip on` : `pip`,
                          "aria-pressed": e.scores[t] === n,
                          onClick: () => i(t, n),
                          children: n,
                        },
                        n,
                      ),
                    ),
                  }),
                ],
              },
              t,
            ),
          ),
          (0, z.jsx)(`p`, {
            className: `score-total`,
            children:
              s === null ? `No scores yet.` : `Average ${s.toFixed(1)} / 5`,
          }),
        ],
      }),
    ],
  });
}
function B({ id: e, on: t, onToggle: n, children: r }) {
  return (0, z.jsxs)(`label`, {
    className: `check`,
    children: [
      (0, z.jsx)(`input`, {
        type: `checkbox`,
        checked: t,
        onChange: () => n(e),
      }),
      (0, z.jsx)(`span`, { children: r }),
    ],
  });
}
function mo({ id: e, ask: t, yes: n, no: r, hint: i, value: a, onPick: o }) {
  return (0, z.jsxs)(`div`, {
    className: a === `no` ? `knock stop` : `knock`,
    children: [
      (0, z.jsx)(`p`, { children: t }),
      i ? (0, z.jsx)(`p`, { className: `hint`, children: i }) : null,
      (0, z.jsxs)(`div`, {
        className: `yesno`,
        role: `group`,
        "aria-label": t,
        children: [
          (0, z.jsx)(`button`, {
            type: `button`,
            className: a === `yes` ? `yes on` : `yes`,
            "aria-pressed": a === `yes`,
            onClick: () => o(e, `yes`),
            children: n,
          }),
          (0, z.jsx)(`button`, {
            type: `button`,
            className: a === `no` ? `no on` : `no`,
            "aria-pressed": a === `no`,
            onClick: () => o(e, `no`),
            children: r,
          }),
        ],
      }),
      a === `no`
        ? (0, z.jsx)(`p`, {
            className: `knock-flag`,
            children: `Knockout. Thank them and end the call.`,
          })
        : null,
    ],
  });
}
function ho({ id: e, q: t, good: n, on: r, onToggle: i }) {
  return (0, z.jsxs)(`div`, {
    className: `tech`,
    children: [
      (0, z.jsx)(B, { id: e, on: r, onToggle: i, children: t }),
      (0, z.jsxs)(`p`, {
        className: `good-answer`,
        children: [
          (0, z.jsx)(`strong`, { children: `A good answer.` }),
          ` `,
          n,
        ],
      }),
    ],
  });
}
var go = `iit-hiring-v1`,
  _o = `candidate_id,favorite,note,updated_by,updated_at,interview_done,interviewed_at`,
  vo = () => ({
    fav: {},
    notes: {},
    known: {},
    by: {},
    at: {},
    done: {},
    when: {},
  });
function yo() {
  let e = vo();
  try {
    let t = localStorage.getItem(go);
    if (t) {
      let e = JSON.parse(t);
      return {
        fav: e.fav ?? {},
        notes: e.notes ?? {},
        known: e.known ?? {},
        by: e.by ?? {},
        at: e.at ?? {},
        done: e.done ?? {},
        when: e.when ?? {},
      };
    }
    let n = localStorage.getItem(`iit-fav`),
      r = localStorage.getItem(`iit-notes`);
    if ((n && (e.fav = JSON.parse(n)), r)) {
      e.notes = JSON.parse(r);
      for (let t of Object.keys(e.notes)) e.known[t] = !0;
    }
  } catch {}
  return e;
}
function bo(e) {
  if (!e) return 0;
  let t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function xo() {
  let e = (0, l.useRef)(yo()).current,
    [t, n] = (0, l.useState)(e.fav),
    [r, i] = (0, l.useState)(e.notes),
    [a, o] = (0, l.useState)(e.known),
    [s, c] = (0, l.useState)(e.by),
    [u, d] = (0, l.useState)(e.done),
    [f, p] = (0, l.useState)(e.when),
    [m, h] = (0, l.useState)(() => localStorage.getItem(`iit-author`) ?? ``),
    [g, _] = (0, l.useState)(`loading`),
    [v, y] = (0, l.useState)(`Loading shared notes…`),
    b = (0, l.useRef)(e.fav),
    x = (0, l.useRef)(e.notes),
    S = (0, l.useRef)(e.known),
    ee = (0, l.useRef)(e.by),
    te = (0, l.useRef)(e.at),
    C = (0, l.useRef)(e.done),
    ne = (0, l.useRef)(e.when),
    w = (0, l.useRef)(m),
    re = (0, l.useRef)(``),
    ie = (0, l.useRef)(new Set()),
    ae = (0, l.useRef)(0),
    oe = (0, l.useRef)(null),
    se = (0, l.useRef)(null),
    ce = (0, l.useRef)(new Map());
  function le(e) {
    ((b.current = e.fav),
      (x.current = e.notes),
      (S.current = e.known),
      (ee.current = e.by),
      (te.current = e.at),
      (C.current = e.done),
      (ne.current = e.when),
      n(e.fav),
      i(e.notes),
      o(e.known),
      c(e.by),
      d(e.done),
      p(e.when));
    try {
      localStorage.setItem(go, JSON.stringify(e));
    } catch {}
  }
  function ue() {
    return {
      fav: b.current,
      notes: x.current,
      known: S.current,
      by: ee.current,
      at: te.current,
      done: C.current,
      when: ne.current,
    };
  }
  function de(e) {
    let t = te.current[e.candidate_id];
    if (t && bo(t) > bo(e.updated_at)) return;
    let n = re.current === e.candidate_id && ie.current.has(e.candidate_id),
      r = ue();
    ((r.at = { ...r.at, [e.candidate_id]: e.updated_at }),
      (r.by = { ...r.by, [e.candidate_id]: e.updated_by }),
      (r.fav = { ...r.fav, [e.candidate_id]: e.favorite }));
    let i = !!e.interview_done;
    ((r.done = { ...r.done, [e.candidate_id]: i }),
      (r.when = { ...r.when, [e.candidate_id]: i ? e.interviewed_at : null }),
      n ||
        ((r.notes = { ...r.notes, [e.candidate_id]: e.note }),
        (r.known = { ...r.known, [e.candidate_id]: !0 }),
        ie.current.delete(e.candidate_id)),
      le(r));
  }
  async function T(e, t, n, r, i) {
    let a = w.current.trim().slice(0, 80) || `Anonymous`,
      o = !!r,
      s = o ? i || new Date().toISOString() : null,
      c = ue();
    ((c.fav = { ...c.fav, [e]: t }),
      (c.notes = { ...c.notes, [e]: n.slice(0, 8e3) }),
      (c.known = { ...c.known, [e]: !0 }),
      (c.by = { ...c.by, [e]: a }),
      (c.done = { ...c.done, [e]: o }),
      (c.when = { ...c.when, [e]: s }),
      le(c));
    let l = oe.current;
    if (!l) {
      (_(`local`), y(`Saved on this browser`));
      return;
    }
    ((ae.current += 1), _(`saving`), y(`Saving…`));
    let { data: u, error: d } = await l
      .from(`hiring_dashboard_state`)
      .upsert({
        candidate_id: e,
        favorite: t,
        note: n.slice(0, 8e3),
        updated_by: a,
        interview_done: o,
        interviewed_at: s,
      })
      .select(_o);
    if (((ae.current = Math.max(0, ae.current - 1)), d || !u?.[0])) {
      let t = ue();
      ((t.at = { ...t.at, [e]: new Date().toISOString() }),
        le(t),
        _(`error`),
        y(`Saved on this browser — sync paused`));
      return;
    }
    (ie.current.delete(e), de(u[0]), _(`saved`), y(`Saved / shared`));
    let f = se.current;
    f && f.send({ type: `broadcast`, event: `changed`, payload: { id: e } });
  }
  async function fe() {
    let e = oe.current;
    if (!e) return;
    let { data: t, error: n } = await e
      .from(`hiring_dashboard_state`)
      .select(_o);
    if (n || !t) {
      ae.current === 0 &&
        (_(`error`), y(`Saved on this browser — sync paused`));
      return;
    }
    let r = new Set();
    for (let e of t) {
      r.add(e.candidate_id);
      let t = te.current[e.candidate_id];
      t && bo(t) > bo(e.updated_at)
        ? T(
            e.candidate_id,
            !!b.current[e.candidate_id],
            x.current[e.candidate_id] ?? ``,
            !!C.current[e.candidate_id],
            ne.current[e.candidate_id] ?? null,
          )
        : de(e);
    }
    for (let e of Object.keys(S.current))
      r.has(e) ||
        T(
          e,
          !!b.current[e],
          x.current[e] ?? ``,
          !!C.current[e],
          ne.current[e] ?? null,
        );
    ae.current === 0 && (_(`saved`), y(`Saved / shared`));
  }
  function pe(e) {
    let t = e ? [e] : [...ce.current.keys()];
    for (let e of t) {
      let t = ce.current.get(e);
      (t && window.clearTimeout(t),
        ce.current.delete(e),
        ie.current.has(e) &&
          T(
            e,
            !!b.current[e],
            x.current[e] ?? ``,
            !!C.current[e],
            ne.current[e] ?? null,
          ));
    }
  }
  let me = (0, l.useRef)({
    toggleFavorite(e, t) {
      T(
        e,
        !b.current[e],
        S.current[e] ? (x.current[e] ?? ``) : t,
        !!C.current[e],
        ne.current[e] ?? null,
      );
    },
    toggleInterview(e, t) {
      let n = !C.current[e],
        r = S.current[e] ? (x.current[e] ?? ``) : t,
        i = n ? new Date().toISOString() : null;
      T(e, !!b.current[e], r, n, i);
    },
    editNote(e, t) {
      ie.current.add(e);
      let n = ue();
      ((n.notes = { ...n.notes, [e]: t }),
        (n.known = { ...n.known, [e]: !0 }),
        le(n));
      let r = ce.current.get(e);
      (r && window.clearTimeout(r),
        ce.current.set(
          e,
          window.setTimeout(() => {
            (ce.current.delete(e),
              T(
                e,
                !!b.current[e],
                x.current[e] ?? ``,
                !!C.current[e],
                ne.current[e] ?? null,
              ));
          }, 600),
        ));
    },
    focus(e) {
      re.current = e;
    },
    blur(e) {
      (re.current === e && (re.current = ``), pe(e));
    },
    setAuthor(e) {
      ((w.current = e), h(e));
      try {
        localStorage.setItem(`iit-author`, e);
      } catch {}
    },
  });
  return (
    (0, l.useEffect)(() => {
      let e = !1,
        t = ce.current,
        n = window.setInterval(() => {
          e || fe();
        }, 4e3);
      (async () => {
        let t = await Ra();
        if (e) return;
        if (!t) {
          (_(`local`), y(`Saved on this browser`));
          return;
        }
        let n = Pa(t.url, t.anonKey, {
          auth: { persistSession: !1, autoRefreshToken: !1 },
        });
        if (((oe.current = n), await fe(), e)) return;
        let r = n
          .channel(`hiring-dashboard-live`)
          .on(`broadcast`, { event: `changed` }, () => {
            fe();
          })
          .on(
            `postgres_changes`,
            { event: `*`, schema: `public`, table: `hiring_dashboard_state` },
            (e) => {
              let t = e.new;
              t?.candidate_id && de(t);
            },
          )
          .subscribe();
        se.current = r;
      })();
      let r = () => {
        document.visibilityState === `hidden` && pe();
      };
      return (
        document.addEventListener(`visibilitychange`, r),
        () => {
          ((e = !0),
            window.clearInterval(n),
            document.removeEventListener(`visibilitychange`, r));
          for (let e of t.values()) window.clearTimeout(e);
          t.clear();
          let i = se.current;
          ((se.current = null),
            i && oe.current?.removeChannel(i),
            (oe.current = null));
        }
      );
    }, []),
    {
      fav: t,
      notes: r,
      known: a,
      by: s,
      done: u,
      when: f,
      author: m,
      status: g,
      statusDetail: v,
      ...me.current,
    }
  );
}
var So = [`Interview`, `Phone screen`, `Hold`, `Decline`];
function Co() {
  let e = xo(),
    t = ro(),
    hidden = hiddenList(),
    n = t.rows,
    [r, i] = (0, l.useState)(``),
    [a, o] = (0, l.useState)(`All`),
    [s, c] = (0, l.useState)(`All`),
    [u, d] = (0, l.useState)(`All`),
    [f, p] = (0, l.useState)(`All`),
    [m, h] = (0, l.useState)(`All`),
    [g, _] = (0, l.useState)(!1),
    [v, y] = (0, l.useState)(`All`),
    [b, x] = (0, l.useState)(`Score`),
    sortMemory = (0, l.useRef)(`Score`),
    [S, ee] = (0, l.useState)([]),
    [te, C] = (0, l.useState)({}),
    [ne, w] = (0, l.useState)(``),
    [re, ie] = (0, l.useState)(`invites`),
    ae = n.filter((e) => e.st.startsWith(`Contacting`)).length,
    pool = re === `yrs` ? hidden.rows : n,
    listPhase = re === `yrs` ? hidden.phase : t.phase,
    listNotice = re === `yrs` ? hidden.notice : t.notice,
    oe = (0, l.useMemo)(() => {
      let e = {};
      for (let t of pool) t.presetNote && (e[t.name] = t.presetNote);
      return e;
    }, [pool]);
  function se(t) {
    return e.known[t] ? (e.notes[t] ?? ``) : (oe[t] ?? ``);
  }
  function ce(e) {
    (C((t) => ({ ...t, [e]: (t[e] ?? 0) + 1 })),
      w(e),
      window.setTimeout(() => {
        document
          .getElementById(Wa(e))
          ?.scrollIntoView({ behavior: `smooth`, block: `start` });
      }, 60),
      window.setTimeout(() => w((t) => (t === e ? `` : t)), 2200));
  }
  function le() {
    document
      .getElementById(`rank-table`)
      ?.scrollIntoView({ behavior: `smooth`, block: `start` });
  }
  function ue(e) {
    ee((t) =>
      t.includes(e) ? t.filter((t) => t !== e) : t.length >= 3 ? t : [...t, e],
    );
  }
  let de = (0, l.useMemo)(() => {
      let t = r.trim().toLowerCase();
      return pool
        .filter((n) =>
          (re !== `yrs` && re !== `all` && re !== `script` && !onTab(n.name, re)) ||
          (a !== `All` && n.grp !== a) ||
          (s !== `All` && n.paid !== s) ||
          (u !== `All` && n.mspShort !== u) ||
          (f !== `All` && !n.commute.startsWith(f)) ||
          (m !== `All` && !n.st.startsWith(m)) ||
          (g && !e.fav[n.name]) ||
          (v === `Interviewed` && !e.done[n.name]) ||
          (v === `Not yet` && e.done[n.name])
            ? !1
            : !t ||
              `${n.name} ${n.loc} ${n.certs} ${n.msp} ${n.rec2} ${n.tools.join(` `)} ${se(n.name)}`
                .toLowerCase()
                .includes(t),
        )
        .sort((e, t) =>
          b === `Name`
            ? e.name.localeCompare(t.name)
            : b === `Rank`
              ? e.rank - t.rank || t.total - e.total
              : b === `Commute`
                ? Ba(e.commute) - Ba(t.commute) || t.total - e.total
                : (b === `Recommendation` &&
                    So.indexOf(e.grp) - So.indexOf(t.grp)) ||
                  t.total - e.total,
        );
    }, [pool, r, a, s, u, f, m, g, v, b, re, e.fav, e.notes, e.known, e.done, oe]),
    tabRows =
      re === `yrs` || re === `all` || re === `script`
        ? pool
        : n.filter((row) => onTab(row.name, re)),
    T = tabRows.filter((row) => S.includes(row.name)),
    groups =
      re === `invites`
        ? INVITE_BATCHES.map((batch) => ({
            id: batch.id,
            label: batch.label,
            rows: de.filter((row) => batch.names.includes(row.name)),
          }))
        : [{ id: `main`, label: ``, rows: de }];
  function fe(tab) {
    if (tab === `yrs` && re !== `yrs`) {
      sortMemory.current = b;
      x(`Rank`);
    } else if (tab !== `yrs` && re === `yrs`) x(sortMemory.current);
    (ie(tab), window.scrollTo({ top: 0 }));
  }
  return (0, z.jsxs)(z.Fragment, {
    children: [
      (0, z.jsxs)(`div`, {
        className: `sticky-head`,
        children: [
          (0, z.jsxs)(`header`, {
            className: `topbar`,
            children: [
              (0, z.jsxs)(`div`, {
                className: `brand`,
                children: [
                  (0, z.jsx)(`span`, {
                    className: `mark`,
                    "aria-hidden": `true`,
                    children: `IT`,
                  }),
                  (0, z.jsxs)(`div`, {
                    children: [
                      (0, z.jsx)(`strong`, {
                        children: `Intelligent IT Hiring`,
                      }),
                      (0, z.jsx)(`span`, {
                        children: `Help desk · Woodland Hills`,
                      }),
                    ],
                  }),
                ],
              }),
              (0, z.jsxs)(`div`, {
                className: `top-tools`,
                children: [
                  (0, z.jsx)(`a`, {
                    className: `quick-link`,
                    href: QUICK_VIEW_URL,
                    target: `_blank`,
                    rel: `noreferrer`,
                    children: `Owner’s quick view`,
                  }),
                  (0, z.jsxs)(`label`, {
                    children: [
                      `Your name`,
                      (0, z.jsx)(`input`, {
                        value: e.author,
                        placeholder: `Hooman or Ryan`,
                        maxLength: 80,
                        onChange: (t) => e.setAuthor(t.target.value),
                      }),
                    ],
                  }),
                  (0, z.jsxs)(`p`, {
                    className: `sync sync-${e.status}`,
                    role: `status`,
                    "aria-live": `polite`,
                    children: [
                      (0, z.jsx)(`span`, {
                        className: `dot`,
                        "aria-hidden": `true`,
                      }),
                      e.statusDetail,
                    ],
                  }),
                ],
              }),
            ],
          }),
          (0, z.jsxs)(`div`, {
            className: `tabs`,
            role: `tablist`,
            "aria-label": `Hiring portal`,
            children: TAB_ORDER.map((tab) => {
              let count =
                tab.id === `script`
                  ? null
                  : tab.id === `yrs`
                    ? hidden.rows.length
                    : tab.id === `all`
                      ? n.length
                      : n.filter((row) => onTab(row.name, tab.id)).length;
              return (0, z.jsx)(
                `button`,
                {
                  type: `button`,
                  role: `tab`,
                  id: `tab-${tab.id}`,
                  className: re === tab.id ? `tab on` : `tab`,
                  "aria-selected": re === tab.id,
                  "aria-controls":
                    tab.id === `script` ? `panel-script` : `panel-candidates`,
                  onClick: () => fe(tab.id),
                  children:
                    count === null ? tab.label : `${tab.label} (${count})`,
                },
                tab.id,
              );
            }),
          }),
        ],
      }),
      (0, z.jsxs)(`main`, {
        className: `page`,
        children: [
          listNotice
            ? (0, z.jsx)(`p`, {
                className: `banner`,
                role: `alert`,
                children: listNotice,
              })
            : null,
          re === `script`
            ? (0, z.jsxs)(`div`, {
                role: `tabpanel`,
                id: `panel-script`,
                "aria-labelledby": `tab-script`,
                children: [
                  (0, z.jsx)(ScriptTab, {}),
                  (0, z.jsxs)(`details`, {
                    className: `fold`,
                    children: [
                      (0, z.jsx)(`summary`, {
                        children: `Overview: role, requirements, and scoring`,
                      }),
                      (0, z.jsxs)(`div`, {
                        className: `fold-body`,
                        children: [
                  (0, z.jsx)(`h1`, { children: `IT Help Desk candidates` }),
                  (0, z.jsxs)(`p`, {
                    className: `lede`,
                    children: [
                      `Level 1 MSP tech, Woodland Hills (on site Monday–Friday 9am–5pm, 1099, $20–30/hr).`,
                      ` `,
                      n.length
                        ? `${n.length} active Indeed applicants (rejected/withdrawn excluded); ${ae} contacting.`
                        : `Loading the live applicant list.`,
                      ` `,
                      `All scores out of 10. Last updated `,
                      no(t.updatedAt),
                      `.`,
                    ],
                  }),
                  (0, z.jsx)(`h2`, { children: `Overview` }),
                  (0, z.jsxs)(`dl`, {
                    className: `props`,
                    children: [
                      (0, z.jsxs)(`div`, {
                        children: [
                          (0, z.jsx)(`dt`, { children: `Role` }),
                          (0, z.jsx)(`dd`, {
                            children: `IT Help Desk, Level 1 MSP tech, on site Monday–Friday 9am–5pm, 1099 contractor · 21550 Oxnard St, Woodland Hills CA 91367 · $20–30/hr`,
                          }),
                        ],
                      }),
                      (0, z.jsxs)(`div`, {
                        children: [
                          (0, z.jsx)(`dt`, { children: `Required` }),
                          (0, z.jsx)(`dd`, {
                            children: `2+ yrs IT support; Windows 10/11; M365 admin (Exchange Online, Teams, OneDrive, SharePoint); Entra ID/MFA; basic Azure; desktop/printer/network troubleshooting; remote tools and ticketing; driver's license. Preferred: MSP, Intune, Windows Server/AD, RMM, firewall, endpoint security.`,
                          }),
                        ],
                      }),
                      (0, z.jsxs)(`div`, {
                        children: [
                          (0, z.jsx)(`dt`, { children: `Indeed` }),
                          (0, z.jsx)(`dd`, {
                            children: n.length
                              ? to(n)
                              : `The live list is loading.`,
                          }),
                        ],
                      }),
                      (0, z.jsxs)(`div`, {
                        children: [
                          (0, z.jsx)(`dt`, { children: `Scoring` }),
                          (0, z.jsx)(`dd`, {
                            children: `One scale, out of 10. Each rubric category is scored out of 10; the overall score is the weighted average (one decimal). Weights: hands-on paid support 30%, core stack 20%, MSP/RMM/ticketing 15%, AD/Intune/Server 10%, verification 10%, commute 5%, role & pay fit 10%. Certs are a bonus only: +0.1 per verified relevant cert (A+, Network+, Security+, CCNA, Microsoft, etc.), max +0.3, total capped at 10; no cert = no penalty (Level 1 hands-on at $20–30/hr; judged from senior titles and expected pay, not age or years; confirm on call).`,
                          }),
                        ],
                      }),
                      (0, z.jsxs)(`div`, {
                        children: [
                          (0, z.jsx)(`dt`, { children: `Legend` }),
                          (0, z.jsx)(`dd`, {
                            children: `Scores are out of 10, e.g. 7.8/10 (weighted average plus cert bonus up to +0.3). Table shows short values; full detail is on each card. Recommendation: green = interview / phone screen, red = decline. Paid IT work: green Yes, amber Limited, red None. Red years = 10+ yrs (check pay/level fit). Fit is judged from titles and pay expectations, never age. “Pay fit?” means a senior title that may expect more than $20–30/hr.`,
                          }),
                        ],
                      }),
                      (0, z.jsxs)(`div`, {
                        children: [
                          (0, z.jsx)(`dt`, { children: `Last updated` }),
                          (0, z.jsx)(`dd`, { children: no(t.updatedAt) }),
                        ],
                      }),
                    ],
                  }),
                        ],
                      }),
                    ],
                  }),
                  (0, z.jsxs)(`details`, {
                    className: `fold`,
                    children: [
                      (0, z.jsx)(`summary`, {
                        children: `Hands-on practical test checklist (all candidates)`,
                      }),
                      (0, z.jsx)(`ol`, {
                        children: io.map((e) =>
                          (0, z.jsx)(`li`, { children: e }, e),
                        ),
                      }),
                    ],
                  }),
                  (0, z.jsxs)(`details`, {
                    className: `fold`,
                    children: [
                      (0, z.jsx)(`summary`, {
                        children: `Earlier phone-screen script`,
                      }),
                      (0, z.jsx)(po, {}),
                    ],
                  }),
                ],
              })
            : (0, z.jsxs)(`div`, {
                role: `tabpanel`,
                id: `panel-candidates`,
                "aria-labelledby": `tab-${re}`,
                children: [
                  (0, z.jsx)(`h1`, {
                    children:
                      TAB_ORDER.find((tab) => tab.id === re)?.label ??
                      `Candidates`,
                  }),
                  re === `all` || TAB_BLURB[re]
                    ? (0, z.jsx)(`p`, {
                        className: `lede`,
                        children:
                          re === `all`
                            ? `${n.length} active candidates from Supabase, ranked by score.`
                            : TAB_BLURB[re],
                      })
                    : null,
                  (0, z.jsxs)(`section`, {
                    children: [
                      (0, z.jsxs)(`div`, {
                        className: `filters`,
                        children: [
                          (0, z.jsx)(`input`, {
                            className: `search`,
                            placeholder: `Search name, location, tool, cert…`,
                            value: r,
                            onChange: (e) => i(e.target.value),
                            "aria-label": `Search candidates`,
                          }),
                          (0, z.jsx)(wo, {
                            label: `Recommendation`,
                            value: a,
                            set: o,
                            options: [
                              `All`,
                              `Interview`,
                              `Phone screen`,
                              `Hold`,
                              `Decline`,
                            ],
                          }),
                          (0, z.jsx)(wo, {
                            label: `Paid IT`,
                            value: s,
                            set: c,
                            options: [`All`, `Yes`, `Limited`, `None`],
                          }),
                          (0, z.jsx)(wo, {
                            label: `MSP`,
                            value: u,
                            set: d,
                            options: [`All`, `Yes`, `Limited`, `No`],
                          }),
                          (0, z.jsx)(wo, {
                            label: `Commute`,
                            value: f,
                            set: p,
                            options: [
                              `All`,
                              `Excellent`,
                              `Good`,
                              `OK`,
                              `Fair`,
                              `Poor`,
                              `Not`,
                            ],
                          }),
                          (0, z.jsx)(wo, {
                            label: `Status`,
                            value: m,
                            set: h,
                            options: [`All`, `Contacting`, `Reviewing`],
                          }),
                          (0, z.jsx)(wo, {
                            label: `Interviewed`,
                            value: v,
                            set: y,
                            options: [`All`, `Interviewed`, `Not yet`],
                          }),
                          (0, z.jsx)(wo, {
                            label: `Sort`,
                            value: b,
                            set: x,
                            options: [
                              `Score`,
                              `Rank`,
                              `Recommendation`,
                              `Commute`,
                              `Name`,
                            ],
                          }),
                          (0, z.jsxs)(`label`, {
                            className: `check`,
                            children: [
                              (0, z.jsx)(`input`, {
                                type: `checkbox`,
                                checked: g,
                                onChange: () => _((e) => !e),
                              }),
                              ` ★ Favorites only`,
                            ],
                          }),
                          (0, z.jsxs)(`span`, {
                            className: `count`,
                            children: [
                              de.length,
                              ` shown · compare `,
                              S.length,
                              `/3`,
                            ],
                          }),
                        ],
                      }),
                      (0, z.jsxs)(`div`, {
                        className: `explainer`,
                        children: [
                          (0, z.jsx)(`strong`, {
                            children: `How recommendations work`,
                          }),
                          (0, z.jsxs)(`p`, {
                            children: [
                              (0, z.jsx)(`span`, {
                                className: `good`,
                                children: `7.5+ Interview`,
                              }),
                              ` · `,
                              (0, z.jsx)(`span`, {
                                className: `good`,
                                children: `6–7.4 Phone screen`,
                              }),
                              ` · 4.5–5.9 Hold · `,
                              (0, z.jsx)(`span`, {
                                className: `bad`,
                                children: `under 4.5 Decline`,
                              }),
                              `. Red-flag overrides (unverifiable employers, resume/LinkedIn mismatches, inflated screener answers, or a far commute) can place someone below their score band.`,
                            ],
                          }),
                        ],
                      }),
                      groups.map((group) =>
                        (0, z.jsxs)(
                          `div`,
                          {
                            className: `batch`,
                            children: [
                              group.label
                                ? (0, z.jsxs)(`h2`, {
                                    className: `batch-head`,
                                    children: [
                                      group.label,
                                      ` (`,
                                      group.rows.length,
                                      `)`,
                                    ],
                                  })
                                : null,
                              (0, z.jsxs)(`div`, {
                        id:
                          group.id === `main` || group.id === `sent`
                            ? `rank-table`
                            : `rank-table-${group.id}`,
                        className: `rank-scroll`,
                        children: [
                          (0, z.jsxs)(`table`, {
                            className: `rank-table`,
                            children: [
                              (0, z.jsx)(`caption`, {
                                children: `Ranked help desk candidates`,
                              }),
                              (0, z.jsxs)(`colgroup`, {
                                children: [
                                  (0, z.jsx)(`col`, { className: `num` }),
                                  (0, z.jsx)(`col`, { className: `name` }),
                                  (0, z.jsx)(`col`, { className: `score` }),
                                  (0, z.jsx)(`col`, { className: `years` }),
                                  (0, z.jsx)(`col`, { className: `msp` }),
                                  (0, z.jsx)(`col`, { className: `commute` }),
                                  (0, z.jsx)(`col`, { className: `int` }),
                                  (0, z.jsx)(`col`, { className: `notes` }),
                                  (0, z.jsx)(`col`, { className: `rec` }),
                                ],
                              }),
                              (0, z.jsx)(`thead`, {
                                children: (0, z.jsxs)(`tr`, {
                                  children: [
                                    (0, z.jsx)(`th`, {
                                      className: `num`,
                                      scope: `col`,
                                      children: `#`,
                                    }),
                                    (0, z.jsx)(`th`, {
                                      className: `name`,
                                      scope: `col`,
                                      children: `Name`,
                                    }),
                                    (0, z.jsx)(`th`, {
                                      className: `score`,
                                      scope: `col`,
                                      title: `Score out of 10`,
                                      children: `Score`,
                                    }),
                                    (0, z.jsx)(`th`, {
                                      className: `years`,
                                      scope: `col`,
                                      title: `Years`,
                                      children: `Yrs`,
                                    }),
                                    (0, z.jsx)(`th`, {
                                      className: `msp`,
                                      scope: `col`,
                                      children: `MSP`,
                                    }),
                                    (0, z.jsx)(`th`, {
                                      className: `commute`,
                                      scope: `col`,
                                      title: `Commute`,
                                      children: `Commute`,
                                    }),
                                    (0, z.jsx)(`th`, {
                                      className: `int`,
                                      scope: `col`,
                                      title: `Interview done`,
                                      children: `✓`,
                                    }),
                                    (0, z.jsx)(`th`, {
                                      className: `notes`,
                                      scope: `col`,
                                      children: `Notes`,
                                    }),
                                    (0, z.jsx)(`th`, {
                                      className: `rec`,
                                      scope: `col`,
                                      title: `Recommendation`,
                                      children: `Rec.`,
                                    }),
                                  ],
                                }),
                              }),
                              (0, z.jsx)(`tbody`, {
                                children: group.rows.map((t) => {
                                  let n = se(t.name),
                                    r = qa(t.sYrs, t.yrs),
                                    i =
                                      t.mspShort === `Limited`
                                        ? `Ltd`
                                        : t.mspShort;
                                  return (0, z.jsxs)(
                                    `tr`,
                                    {
                                      children: [
                                        (0, z.jsx)(`td`, {
                                          className: `num`,
                                          children: t.rank,
                                        }),
                                        (0, z.jsx)(`td`, {
                                          className: `name`,
                                          children: (0, z.jsxs)(`span`, {
                                            className: `who`,
                                            children: [
                                              (0, z.jsx)(`button`, {
                                                type: `button`,
                                                className: e.fav[t.name]
                                                  ? `star on`
                                                  : `star`,
                                                "aria-pressed": !!e.fav[t.name],
                                                "aria-label": e.fav[t.name]
                                                  ? `Unfavorite ${t.name}`
                                                  : `Favorite ${t.name}`,
                                                onClick: () =>
                                                  e.toggleFavorite(
                                                    t.name,
                                                    se(t.name),
                                                  ),
                                                children: e.fav[t.name]
                                                  ? `★`
                                                  : `☆`,
                                              }),
                                              (0, z.jsx)(`a`, {
                                                href: `#${Wa(t.name)}`,
                                                title: t.name,
                                                onClick: (e) => {
                                                  (e.preventDefault(),
                                                    ce(t.name));
                                                },
                                                children: t.name,
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, z.jsx)(`td`, {
                                          className: t.noScore
                                            ? `score muted`
                                            : `score score-cell`,
                                          title: t.noScore
                                            ? `resume not found`
                                            : `${t.s10}/10`,
                                          children: t.noScore
                                            ? `resume not found`
                                            : t.s10,
                                        }),
                                        (0, z.jsx)(`td`, {
                                          className: t.yrsRed
                                            ? `years bad`
                                            : `years`,
                                          title: t.yrs,
                                          children: r,
                                        }),
                                        (0, z.jsx)(`td`, {
                                          className: `msp`,
                                          title: t.msp,
                                          children: i,
                                        }),
                                        (0, z.jsx)(`td`, {
                                          className: `commute`,
                                          title: `${t.commute}${t.loc ? ` · ${t.loc}` : ``}`,
                                          children: Ya(t.commute, t.sCom),
                                        }),
                                        (0, z.jsx)(`td`, {
                                          className: `int`,
                                          children: (0, z.jsx)(`input`, {
                                            type: `checkbox`,
                                            checked: !!e.done[t.name],
                                            onChange: () =>
                                              e.toggleInterview(
                                                t.name,
                                                se(t.name),
                                              ),
                                            "aria-label": e.done[t.name]
                                              ? `Clear interview done for ${t.name}`
                                              : `Mark interview done for ${t.name}`,
                                            title: `Interview done`,
                                          }),
                                        }),
                                        (0, z.jsx)(`td`, {
                                          className: n
                                            ? `notes`
                                            : `notes muted`,
                                          title: n || void 0,
                                          children: n || `—`,
                                        }),
                                        (0, z.jsx)(`td`, {
                                          className: `rec rec-cell`,
                                          children: (0, z.jsx)(`span`, {
                                            className: `pill ${isHired(t.name) ? `good` : Ha(t.grp)}`,
                                            title: isHired(t.name)
                                              ? `Hired`
                                              : t.rec2 || t.sRec,
                                            children: isHired(t.name)
                                              ? `Hired`
                                              : Xa(t.grp),
                                          }),
                                        }),
                                      ],
                                    },
                                    t.name,
                                  );
                                }),
                              }),
                            ],
                          }),
                          group.rows.length === 0
                            ? (0, z.jsx)(`p`, {
                                className: `empty`,
                                children:
                                  listPhase === `loading`
                                    ? `Loading candidates…`
                                    : pool.length === 0
                                      ? `No candidates are in this list yet.`
                                      : `No candidates match these filters.`,
                              })
                            : null,
                        ],
                      }),
                            ],
                          },
                          group.id,
                        ),
                      ),
                    ],
                  }),
                  (0, z.jsxs)(`section`, {
                    children: [
                      (0, z.jsx)(`h2`, { children: `Compare` }),
                      T.length < 2
                        ? (0, z.jsx)(`p`, {
                            children: `Use Add to compare on two or three candidate cards to see them side by side.`,
                          })
                        : (0, z.jsxs)(z.Fragment, {
                            children: [
                              (0, z.jsx)(`div`, {
                                className: `compare-scroll`,
                                children: (0, z.jsxs)(`table`, {
                                  className: `compare`,
                                  children: [
                                    (0, z.jsx)(`thead`, {
                                      children: (0, z.jsxs)(`tr`, {
                                        children: [
                                          (0, z.jsx)(`th`, {
                                            scope: `col`,
                                            children: `Field`,
                                          }),
                                          T.map((e) =>
                                            (0, z.jsx)(
                                              `th`,
                                              {
                                                scope: `col`,
                                                children: e.name,
                                              },
                                              e.name,
                                            ),
                                          ),
                                        ],
                                      }),
                                    }),
                                    (0, z.jsxs)(`tbody`, {
                                      children: [
                                        (0, z.jsx)(To, {
                                          label: `Recommendation`,
                                          cells: T.map((e) => e.rec2),
                                        }),
                                        (0, z.jsx)(To, {
                                          label: `Overall (weighted)`,
                                          cells: T.map((e) => `${e.s10}/10`),
                                        }),
                                        ao.map(([e, t], n) =>
                                          (0, z.jsx)(
                                            To,
                                            {
                                              label: `${e} (weight ${t}%)`,
                                              cells: T.map(
                                                (e) =>
                                                  `${Va(e.sub[n] ?? 0, t)}/10`,
                                              ),
                                            },
                                            e,
                                          ),
                                        ),
                                        (0, z.jsx)(To, {
                                          label: `Cert bonus (verified, max +0.3)`,
                                          cells: T.map(
                                            (e) => `+${e.bonus.toFixed(1)}`,
                                          ),
                                        }),
                                        (0, z.jsx)(To, {
                                          label: `Years`,
                                          cells: T.map((e) => e.yrs),
                                        }),
                                        (0, z.jsx)(To, {
                                          label: `Paid IT work`,
                                          cells: T.map((e) => e.paid),
                                        }),
                                        (0, z.jsx)(To, {
                                          label: `MSP`,
                                          cells: T.map((e) => e.msp),
                                        }),
                                        (0, z.jsx)(To, {
                                          label: `Certs`,
                                          cells: T.map((e) => e.certs),
                                        }),
                                        (0, z.jsx)(To, {
                                          label: `Commute`,
                                          cells: T.map(
                                            (e) => `${e.loc} · ${e.commute}`,
                                          ),
                                        }),
                                        (0, z.jsx)(To, {
                                          label: `Tools`,
                                          cells: T.map(
                                            (e) => e.tools.join(`, `) || `—`,
                                          ),
                                        }),
                                        (0, z.jsx)(To, {
                                          label: `Indeed status`,
                                          cells: T.map((e) => e.st),
                                        }),
                                        (0, z.jsx)(To, {
                                          label: `Availability`,
                                          cells: T.map((e) => e.avail),
                                        }),
                                        (0, z.jsx)(To, {
                                          label: `Concerns`,
                                          cells: T.map((e) => e.risks),
                                        }),
                                        (0, z.jsx)(To, {
                                          label: `Next step`,
                                          cells: T.map((e) => e.next),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              }),
                              (0, z.jsx)(`button`, {
                                type: `button`,
                                className: `ghost`,
                                onClick: () => ee([]),
                                children: `Clear comparison`,
                              }),
                            ],
                          }),
                    ],
                  }),
                  (0, z.jsxs)(`section`, {
                    children: [
                      (0, z.jsx)(`h2`, { children: `Pipeline` }),
                      (0, z.jsx)(`div`, {
                        className: `pipeline`,
                        children: So.map((t) => {
                          let r = tabRows.filter((e) => e.grp === t);
                          return (0, z.jsxs)(
                            `div`,
                            {
                              className: `lane lane-${t.toLowerCase().split(` `)[0]}`,
                              children: [
                                (0, z.jsxs)(`h3`, {
                                  children: [t, ` (`, r.length, `)`],
                                }),
                                r.map((t) =>
                                  (0, z.jsxs)(
                                    `button`,
                                    {
                                      type: `button`,
                                      className: `lane-item`,
                                      onClick: () => ce(t.name),
                                      children: [
                                        e.fav[t.name] ? `★ ` : ``,
                                        t.rank,
                                        `. `,
                                        t.name,
                                        ` · `,
                                        t.s10,
                                        `/10`,
                                        t.st.startsWith(`Contacting`)
                                          ? ` · Contacting`
                                          : ``,
                                      ],
                                    },
                                    t.name,
                                  ),
                                ),
                              ],
                            },
                            t,
                          );
                        }),
                      }),
                    ],
                  }),
                  (0, z.jsxs)(`section`, {
                    children: [
                      (0, z.jsx)(`h2`, { children: `Candidate cards` }),
                      tabRows.map((t) =>
                        (0, z.jsx)(
                          Eo,
                          {
                            row: t,
                            rubric: ao,
                            hot: ne === t.name,
                            favorite: !!e.fav[t.name],
                            interviewed: !!e.done[t.name],
                            interviewedAt: e.when[t.name] ?? null,
                            note: se(t.name),
                            editor: e.by[t.name] ?? ``,
                            compared: S.includes(t.name),
                            defaultOpen: t.rank <= 3 || !!te[t.name],
                            onBack: le,
                            onFavorite: () =>
                              e.toggleFavorite(t.name, se(t.name)),
                            onInterview: () =>
                              e.toggleInterview(t.name, se(t.name)),
                            onCompare: () => ue(t.name),
                            onNote: (n) => e.editNote(t.name, n),
                            onFocus: () => e.focus(t.name),
                            onBlur: () => e.blur(t.name),
                          },
                          `${t.name}-${te[t.name] ?? 0}`,
                        ),
                      ),
                    ],
                  }),
                ],
              }),
        ],
      }),
    ],
  });
}
function wo({ label: e, value: t, set: n, options: r }) {
  return (0, z.jsxs)(`label`, {
    children: [
      e,
      (0, z.jsx)(`select`, {
        value: t,
        onChange: (e) => n(e.target.value),
        "aria-label": e,
        children: r.map((e) =>
          (0, z.jsx)(`option`, { value: e, children: e }, e),
        ),
      }),
    ],
  });
}
function To({ label: e, cells: t }) {
  return (0, z.jsxs)(`tr`, {
    children: [
      (0, z.jsx)(`th`, { scope: `row`, children: e }),
      t.map((t, n) => (0, z.jsx)(`td`, { children: t }, `${e}-${n}`)),
    ],
  });
}
function Eo({
  row: e,
  rubric: t,
  hot: n,
  favorite: r,
  interviewed: i,
  interviewedAt: a,
  note: o,
  editor: s,
  compared: c,
  defaultOpen: u,
  onBack: d,
  onFavorite: f,
  onInterview: p,
  onCompare: m,
  onNote: h,
  onFocus: g,
  onBlur: _,
}) {
  let v = (0, l.useRef)(null);
  return (
    (0, l.useLayoutEffect)(() => {
      v.current && (v.current.open = u);
    }, [u]),
    (0, z.jsxs)(`details`, {
      ref: v,
      id: Wa(e.name),
      className: n ? `card hot` : `card`,
      children: [
        (0, z.jsxs)(`summary`, {
          children: e.noScore
            ? [e.rank, `. `, r ? `★ ` : ``, e.name, ` — resume not found`]
            : [e.rank, `. `, r ? `★ ` : ``, e.name, ` — `, e.s10, `/10`],
        }),
        (0, z.jsxs)(`div`, {
          className: `card-body`,
          children: [
            (0, z.jsxs)(`div`, {
              className: `card-nav`,
              children: [
                (0, z.jsx)(`span`, { children: n ? `Opened from table` : `` }),
                (0, z.jsx)(`a`, {
                  href: `#rank-table`,
                  onClick: (e) => {
                    (e.preventDefault(), d());
                  },
                  children: `↑ Back to table`,
                }),
              ],
            }),
            (0, z.jsxs)(`dl`, {
              className: `props tight`,
              children: [
                (0, z.jsx)(Do, {
                  label: `Recommendation`,
                  children: (0, z.jsx)(`span`, {
                    className: e.noScore ? void 0 : Ha(e.rec2),
                    children: e.noScore ? `resume not found` : e.rec2,
                  }),
                }),
                (0, z.jsx)(Do, { label: `Next step`, children: e.next }),
                (0, z.jsx)(Do, { label: `Indeed status`, children: e.st }),
                (0, z.jsx)(Do, {
                  label: `Years`,
                  children: (0, z.jsxs)(`span`, {
                    className: e.yrsRed ? `bad` : void 0,
                    children: [e.yrs, e.yrsRed ? ` — check pay/level fit` : ``],
                  }),
                }),
                (0, z.jsx)(Do, {
                  label: `Paid IT work`,
                  children: (0, z.jsx)(`span`, {
                    className: Ua(e.paid),
                    children: e.paid,
                  }),
                }),
                (0, z.jsx)(Do, { label: `MSP experience`, children: e.msp }),
                (0, z.jsxs)(Do, {
                  label: `Commute`,
                  children: [e.loc, ` · `, e.commute],
                }),
                (0, z.jsx)(Do, { label: `Certs`, children: e.certs }),
                (0, z.jsx)(Do, {
                  label: `Tools named`,
                  children: e.tools.join(`, `) || `None specific named`,
                }),
                (0, z.jsx)(Do, {
                  label: `Availability / notes`,
                  children: e.avail,
                }),
                (0, z.jsx)(Do, { label: `Verification`, children: e.verif }),
                (0, z.jsx)(Do, {
                  label: `Concerns / red flags`,
                  children: e.risks,
                }),
              ],
            }),
            (0, z.jsxs)(`table`, {
              className: `rubric`,
              children: [
                (0, z.jsx)(`thead`, {
                  children: (0, z.jsxs)(`tr`, {
                    children: [
                      (0, z.jsx)(`th`, {
                        scope: `col`,
                        children: `Rubric category`,
                      }),
                      (0, z.jsx)(`th`, { scope: `col`, children: `Weight` }),
                      (0, z.jsx)(`th`, { scope: `col`, children: `Score` }),
                    ],
                  }),
                }),
                (0, z.jsxs)(`tbody`, {
                  children: [
                    t.map(([t, n], r) =>
                      e.noScore
                        ? null
                        : (0, z.jsxs)(
                        `tr`,
                        {
                          children: [
                            (0, z.jsx)(`td`, { children: t }),
                            (0, z.jsxs)(`td`, { children: [n, `%`] }),
                            (0, z.jsxs)(`td`, {
                              children: [Va(e.sub[r] ?? 0, n), `/10`],
                            }),
                          ],
                        },
                        t,
                      ),
                    ),
                    e.noScore
                      ? null
                      : (0, z.jsxs)(`tr`, {
                      children: [
                        (0, z.jsx)(`td`, { children: `Weighted average` }),
                        (0, z.jsx)(`td`, { children: `100%` }),
                        (0, z.jsxs)(`td`, {
                          children: [(e.base / 10).toFixed(1), `/10`],
                        }),
                      ],
                    }),
                    e.noScore
                      ? null
                      : (0, z.jsxs)(`tr`, {
                      children: [
                        (0, z.jsx)(`td`, { children: `Cert bonus` }),
                        (0, z.jsxs)(`td`, { children: [e.nv, ` verified`] }),
                        (0, z.jsxs)(`td`, {
                          children: [`+`, e.bonus.toFixed(1)],
                        }),
                      ],
                    }),
                    (0, z.jsxs)(`tr`, {
                      children: [
                        (0, z.jsx)(`td`, { children: `Overall` }),
                        (0, z.jsx)(`td`, {}),
                        (0, z.jsx)(`td`, {
                          children: e.noScore ? `resume not found` : `${e.s10}/10`,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, z.jsxs)(`div`, {
              className: `split`,
              children: [
                (0, z.jsxs)(`div`, {
                  children: [
                    (0, z.jsx)(`h3`, { children: `Strengths` }),
                    (0, z.jsx)(`ul`, {
                      children: e.strengths.map((e) =>
                        (0, z.jsx)(`li`, { children: e }, e),
                      ),
                    }),
                  ],
                }),
                (0, z.jsxs)(`div`, {
                  children: [
                    (0, z.jsx)(`h3`, { children: `Gaps` }),
                    (0, z.jsx)(`ul`, {
                      children: e.gaps.map((e) =>
                        (0, z.jsx)(`li`, { children: e }, e),
                      ),
                    }),
                  ],
                }),
              ],
            }),
            (0, z.jsx)(`h3`, { children: `Interview questions` }),
            (0, z.jsx)(`ol`, {
              children: e.questions.map((e) =>
                (0, z.jsx)(`li`, { children: e }, e),
              ),
            }),
            safeLinks(e.links).length > 0
              ? (0, z.jsx)(`div`, {
                  className: `links`,
                  children: safeLinks(e.links).map((e) =>
                    (0, z.jsxs)(
                      `a`,
                      {
                        href: e.href,
                        target: `_blank`,
                        rel: `noreferrer`,
                        children: [
                          (0, z.jsx)(`strong`, { children: e.title }),
                          (0, z.jsx)(`span`, { children: e.site }),
                        ],
                      },
                      e.href,
                    ),
                  ),
                })
              : null,
            (0, z.jsxs)(`div`, {
              className: `card-actions`,
              children: [
                (0, z.jsx)(`button`, {
                  type: `button`,
                  className: `ghost`,
                  onClick: f,
                  children: r ? `★ Favorited` : `☆ Add to favorites`,
                }),
                (0, z.jsxs)(`label`, {
                  className: `check`,
                  children: [
                    (0, z.jsx)(`input`, {
                      type: `checkbox`,
                      checked: i,
                      onChange: p,
                    }),
                    `Interview done`,
                  ],
                }),
                (0, z.jsx)(`button`, {
                  type: `button`,
                  className: `ghost`,
                  onClick: m,
                  children: c ? `Remove from compare` : `Add to compare`,
                }),
              ],
            }),
            i && a
              ? (0, z.jsxs)(`p`, {
                  className: `muted editor`,
                  children: [`Marked `, no(a)],
                })
              : null,
            (0, z.jsxs)(`label`, {
              className: `note-label`,
              htmlFor: `note-${Wa(e.name)}`,
              children: [
                `Shared note`,
                (0, z.jsx)(`textarea`, {
                  id: `note-${Wa(e.name)}`,
                  placeholder: `Shared note — Hooman and Ryan both see this`,
                  value: o,
                  maxLength: 8e3,
                  onChange: (e) => h(e.target.value),
                  onFocus: g,
                  onBlur: _,
                }),
              ],
            }),
            s
              ? (0, z.jsxs)(`p`, {
                  className: `muted editor`,
                  children: [`Last saved by `, s],
                })
              : null,
          ],
        }),
      ],
    })
  );
}
function Do({ label: e, children: t }) {
  return (0, z.jsxs)(`div`, {
    children: [
      (0, z.jsx)(`dt`, { children: e }),
      (0, z.jsx)(`dd`, { children: t }),
    ],
  });
}
function Oo() {
  return (0, z.jsx)(Co, {});
}
(0, u.createRoot)(document.getElementById(`root`)).render(
  (0, z.jsx)(l.StrictMode, { children: (0, z.jsx)(Oo, {}) }),
);
