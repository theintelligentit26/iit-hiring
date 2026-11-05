import { InterviewStatusControl } from "./interview-status.jsx";

function textOrDash(value) {
  let text = typeof value === "string" ? value.trim() : "";
  return text || "—";
}

function slotLabel(value) {
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
  return (
    <div role="tabpanel" id="panel-schedule" aria-labelledby="tab-sched">
      <h1>Interview schedule</h1>
      <p className="lede">
        Not contacted -&gt; Invited -&gt; Replied -&gt; Scheduled (set the time)
        -&gt; Done. No-show and Declined are exits.
      </p>
      {phase === "loading" ? (
        <p className="empty">Loading the interview schedule…</p>
      ) : rows.length === 0 ? (
        <p className="empty">No interviews are on the schedule yet.</p>
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
              {rows.map((row) => (
                <tr key={row.name}>
                  <td className="name">{row.name}</td>
                  <td className="score">{textOrDash(row.score)}</td>
                  <td>
                    <InterviewStatusControl name={row.name} status={row.status} />
                  </td>
                  <td>{textOrDash(row.requested)}</td>
                  <td>{slotLabel(row.scheduled_at)}</td>
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
