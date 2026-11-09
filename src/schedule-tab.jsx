import { InterviewStatusControl } from "./interview-status.jsx";

function textOrDash(value) {
  let text = typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
  text = text.replaceAll("mid-morning", "mid morning");
  return text || "not set";
}

function pacificDay(value) {
  let date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function slotLabel(value, status) {
  if (status !== "scheduled" && status !== "done") return "not set";
  if (!value) return "not set";
  let date = new Date(value);
  if (Number.isNaN(date.getTime())) return "not set";
  return `${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  }).format(date)} PT`;
}

export function ScheduleTab({ rows, phase }) {
  let today = pacificDay(new Date());
  let shown = rows.filter((row) => pacificDay(row.scheduled_at) === today);
  return (
    <div role="tabpanel" id="panel-schedule" aria-labelledby="tab-sched">
      <h1>Interview schedule</h1>
      <p className="lede">
        Not contacted, then Invited, then Replied, then Scheduled (set the time), then Done. No show and Declined are exits. Today only. A time in Requested is not a confirmed slot until the status is Scheduled.
      </p>
      {phase === "loading" ? (
        <p className="empty">Loading the interview schedule…</p>
      ) : shown.length === 0 ? (
        <p className="empty">No interviews are on the schedule for today.</p>
      ) : (
        <div className="sched-scroll">
          <table className="sched-table">
            <caption>Interview schedule</caption>
            <thead>
              <tr>
                <th className="name" scope="col">
                  Name
                </th>
                <th className="score" scope="col">
                  Score
                </th>
                <th scope="col">Status</th>
                <th scope="col">Requested</th>
                <th scope="col">Confirmed slot</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={row.name}>
                  <td className="name">{row.name}</td>
                  <td className="score">{textOrDash(row.score)}</td>
                  <td>
                    <InterviewStatusControl name={row.name} status={row.status} />
                  </td>
                  <td>{textOrDash(row.requested)}</td>
                  <td>{slotLabel(row.scheduled_at, row.status)}</td>
                  <td className="qnotes">{textOrDash(row.notes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
