import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const PASS_KEY = "iit-interview-passcode";

export const INTERVIEW_STATUSES = [
  { id: "not_contacted", label: "Not contacted" },
  { id: "invited", label: "Invited" },
  { id: "replied", label: "Replied" },
  { id: "scheduled", label: "Scheduled" },
  { id: "done", label: "Done" },
  { id: "no_show", label: "No-show" },
  { id: "declined", label: "Declined" },
];

export function statusLabel(status) {
  return INTERVIEW_STATUSES.find((item) => item.id === status)?.label || "Not contacted";
}

function storedPasscode() {
  try {
    return sessionStorage.getItem(PASS_KEY) || "";
  } catch {
    return "";
  }
}

function rememberPasscode(value) {
  try {
    if (value) sessionStorage.setItem(PASS_KEY, value);
    else sessionStorage.removeItem(PASS_KEY);
  } catch {
    /* session storage unavailable */
  }
}

async function supabaseClient() {
  let response = await fetch(new URL("config.json", document.baseURI), {
    cache: "no-store",
  });
  let config = await response.json();
  return createClient(config.supabaseUrl.trim(), config.supabaseAnonKey.trim(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function pacificToIso(value) {
  let match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value || "");
  if (!match) return null;
  let year = Number(match[1]);
  let month = Number(match[2]);
  let day = Number(match[3]);
  let hour = Number(match[4]);
  let minute = Number(match[5]);
  let utc = Date.UTC(year, month - 1, day, hour, minute);
  let format = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  for (let i = 0; i < 4; i += 1) {
    let parts = Object.fromEntries(
      format.formatToParts(new Date(utc)).map((part) => [part.type, part.value]),
    );
    let shown = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
    );
    let wanted = Date.UTC(year, month - 1, day, hour, minute);
    utc += wanted - shown;
  }
  return new Date(utc).toISOString();
}

function isPasscodeError(error) {
  let message = `${error?.message || ""} ${error?.details || ""} ${error?.hint || ""}`;
  return (
    /invalid passcode/i.test(message) ||
    error?.status === 403 ||
    error?.code === "42501" ||
    /\b403\b/.test(message)
  );
}

export function InterviewStatusControl({ name, status }) {
  let current = status || "not_contacted";
  let [open, setOpen] = useState(false);
  let [box, setBox] = useState(null);
  let [choice, setChoice] = useState(null);
  let [when, setWhen] = useState("");
  let [note, setNote] = useState("");
  let [passcode, setPasscode] = useState("");
  let [needPass, setNeedPass] = useState(false);
  let [error, setError] = useState("");
  let [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    function close(event) {
      if (event.target.closest?.(".iv-pop")) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  async function send(nextStatus, at, notes, code) {
    setBusy(true);
    setError("");
    try {
      let supabase = await supabaseClient();
      let { error: rpcError } = await supabase.rpc("set_interview_status", {
        p_name: name,
        p_status: nextStatus,
        p_at: at,
        p_notes: notes,
        p_passcode: code,
      });
      if (rpcError) {
        if (isPasscodeError(rpcError)) {
          rememberPasscode("");
          setPasscode("");
          setNeedPass(true);
          setChoice({ status: nextStatus, at, notes });
          setError("Invalid passcode");
          return;
        }
        setError(rpcError.message || "Could not save the interview status.");
        return;
      }
      rememberPasscode(code);
      setOpen(false);
      setNeedPass(false);
      setChoice(null);
      window.dispatchEvent(new Event("iit-interview-saved"));
    } catch (err) {
      setError(err?.message || "Could not save the interview status.");
    } finally {
      setBusy(false);
    }
  }

  function begin(nextStatus, at, notes) {
    let code = storedPasscode();
    if (!code) {
      setChoice({ status: nextStatus, at, notes });
      setNeedPass(true);
      setError("");
      return;
    }
    send(nextStatus, at, notes, code);
  }

  function pick(nextStatus) {
    setError("");
    if (nextStatus === "scheduled") {
      setChoice({ status: "scheduled", at: null, notes: null });
      setNeedPass(false);
      return;
    }
    begin(nextStatus, null, null);
  }

  function saveScheduled() {
    let at = pacificToIso(when);
    if (!at) {
      setError("Pick a date and time.");
      return;
    }
    begin("scheduled", at, note.trim() ? note.trim() : null);
  }

  function submitPasscode() {
    let code = passcode.trim();
    if (!code || !choice) return;
    send(choice.status, choice.at, choice.notes, code);
  }

  return (
    <span className="iv-wrap">
      <button
        type="button"
        className={`iv-pill iv-${current}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Interview status for ${name}: ${statusLabel(current)}`}
        onClick={(event) => {
          event.stopPropagation();
          let rect = event.currentTarget.getBoundingClientRect();
          setBox({ top: rect.bottom + 6, left: Math.max(8, rect.left) });
          setOpen((value) => !value);
          setError("");
        }}
      >
        {statusLabel(current)}
      </button>
      {open ? (
        <div
          className="iv-pop"
          role="menu"
          style={{ top: box?.top ?? 0, left: box?.left ?? 0 }}
        >
          {INTERVIEW_STATUSES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className={item.id === current ? "on" : ""}
              onClick={() => pick(item.id)}
              disabled={busy}
            >
              <span className={`iv-dot iv-${item.id}`} />
              {item.label}
            </button>
          ))}
          {choice?.status === "scheduled" ? (
            <div className="iv-when">
              <label>
                Date and time (Pacific)
                <input
                  type="datetime-local"
                  value={when}
                  onChange={(event) => setWhen(event.target.value)}
                />
              </label>
              <label>
                Note (optional)
                <input
                  type="text"
                  value={note}
                  maxLength={2000}
                  onChange={(event) => setNote(event.target.value)}
                />
              </label>
              <button type="button" className="primary" onClick={saveScheduled} disabled={busy}>
                Save scheduled time
              </button>
            </div>
          ) : null}
          {needPass ? (
            <form
              className="iv-pass"
              onSubmit={(event) => {
                event.preventDefault();
                submitPasscode();
              }}
            >
              <label>
                Passcode
                <input
                  type="password"
                  value={passcode}
                  autoComplete="off"
                  onChange={(event) => setPasscode(event.target.value)}
                />
              </label>
              <button type="submit" className="primary" disabled={busy || !passcode.trim()}>
                Save
              </button>
            </form>
          ) : null}
          {error ? (
            <p className="iv-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </span>
  );
}

export function ScreenScorecard({ card }) {
  if (!card || typeof card !== "object") return null;
  let questions = Array.isArray(card.questions) ? card.questions : [];
  let hasBody =
    questions.length > 0 ||
    card.overall != null ||
    card.recommendation ||
    card.date;
  if (!hasBody) return null;
  return (
    <div className="scorecard">
      <h3>Screen scorecard</h3>
      <dl className="props">
        {card.overall != null ? (
          <div>
            <dt>Overall</dt>
            <dd>{String(card.overall)}</dd>
          </div>
        ) : null}
        {card.recommendation ? (
          <div>
            <dt>Recommendation</dt>
            <dd>{String(card.recommendation)}</dd>
          </div>
        ) : null}
        {card.date ? (
          <div>
            <dt>Date</dt>
            <dd>{String(card.date)}</dd>
          </div>
        ) : null}
      </dl>
      {questions.length ? (
        <ol>
          {questions.map((item, index) => (
            <li key={`${item?.q || "q"}-${index}`}>
              <strong>{item?.q || "Question"}</strong>
              {item?.score != null ? ` — ${item.score}` : ""}
              {item?.note ? <span className="muted"> {item.note}</span> : null}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
